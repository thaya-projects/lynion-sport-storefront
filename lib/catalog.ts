import { cache } from 'react';
import { fetchAllCatalogProducts, fetchStorefront, type ApiProduct } from '@/lib/api/storefront';
import type { CatalogCategory, CatalogFilters, CatalogProduct } from '@/lib/catalog-types';
import { CATEGORIES, categoryDisplayName, categoryHue, slugify } from '@/lib/categories';
import { products as mockProducts } from '@/lib/mocks/products';

// Única puerta de entrada al catálogo. Con INVENTORIES_API_URL definida se lee
// la API pública del backend; los mocks solo se usan sin API configurada o
// forzándolos con CATALOG_SOURCE=mock.
export const CATALOG_FROM_API =
  !!process.env.INVENTORIES_API_URL && process.env.CATALOG_SOURCE !== 'mock';

const HOME_PRODUCTS_LIMIT = 4;
const RELATED_LIMIT = 4;

// ─── Mapeo API → CatalogProduct ──────────────────────────────────────────

// Slug legible + los primeros 8 caracteres del id: el nombre puede cambiar,
// el id no, así que el producto se encuentra por el sufijo.
const ID_SUFFIX_LENGTH = 8;

function apiProductSlug(p: ApiProduct) {
  return `${slugify(p.name)}-${p.id.slice(0, ID_SUFFIX_LENGTH)}`;
}

// Con descuento vigente, discountPrice es el precio real y price queda como
// precio tachado.
function apiPrices(p: ApiProduct): Pick<CatalogProduct, 'price' | 'originalPrice'> {
  const onSale = p.price !== null && p.discountPrice !== null && p.discountPrice < p.price;
  return onSale ? { price: p.discountPrice, originalPrice: p.price! } : { price: p.price };
}

function fromApi(p: ApiProduct): CatalogProduct {
  const category = p.categoryName ? slugify(p.categoryName) : null;
  return {
    id: p.id,
    slug: apiProductSlug(p),
    name: p.name,
    ...apiPrices(p),
    imageSrc: p.imageUrl,
    category,
    categoryName: category && p.categoryName ? categoryDisplayName(category, p.categoryName) : null,
    imageHue: categoryHue(category),
  };
}

function fromMock(p: (typeof mockProducts)[number]): CatalogProduct {
  return {
    ...p,
    categoryName: categoryDisplayName(p.category, p.category),
  };
}

// ─── Fuente de datos ─────────────────────────────────────────────────────

// cache() deduplica dentro del mismo request (generateMetadata + página +
// componentes); entre requests, la caché la maneja fetch (revalidate).
export const getAllProducts = cache(async (): Promise<CatalogProduct[]> => {
  if (!CATALOG_FROM_API) return mockProducts.map(fromMock);
  const items = await fetchAllCatalogProducts();
  return items.map(fromApi);
});

export const getCategories = cache(async (): Promise<CatalogCategory[]> => {
  if (!CATALOG_FROM_API) return CATEGORIES.map(({ slug, name }) => ({ slug, name }));
  const storefront = await fetchStorefront();
  return storefront.categories.map((c) => {
    const slug = slugify(c.name);
    return { slug, name: categoryDisplayName(slug, c.name) };
  });
});

// Producto destacado + los más vendidos, sin repetir.
export const getHomeProducts = cache(async (): Promise<CatalogProduct[]> => {
  if (!CATALOG_FROM_API) {
    return mockProducts.filter((p) => p.featured).map(fromMock);
  }
  const storefront = await fetchStorefront();
  const picks = [storefront.featuredProduct, ...storefront.topProducts].filter(
    (p): p is ApiProduct => p !== null,
  );
  const unique = picks.filter((p, i) => picks.findIndex((q) => q.id === p.id) === i);
  return unique.slice(0, HOME_PRODUCTS_LIMIT).map(fromApi);
});

// ─── Consultas ───────────────────────────────────────────────────────────

// Mientras el backend no tenga endpoint de detalle, el producto se busca en el
// listado completo (cacheado). Con la API, también acepta un slug viejo si el
// sufijo del id coincide: la página redirige al slug actual.
export const getProduct = cache(async (slug: string) => {
  const all = await getAllProducts();
  const exact = all.find((p) => p.slug === slug);
  if (exact || !CATALOG_FROM_API) return exact;
  const suffix = slug.slice(slug.lastIndexOf('-') + 1);
  if (suffix.length !== ID_SUFFIX_LENGTH) return undefined;
  return all.find((p) => p.id.startsWith(suffix));
});

export async function getRelatedProducts(product: CatalogProduct) {
  const all = await getAllProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, RELATED_LIMIT);
}

export async function getProductCountsByCategory() {
  const all = await getAllProducts();
  const counts: Record<string, number> = {};
  for (const p of all) {
    if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}

export function getBrands(products: CatalogProduct[]) {
  return [...new Set(products.map((p) => p.brand).filter((b): b is string => !!b))].sort();
}

export function hasProductsOnSale(products: CatalogProduct[]) {
  return products.some(isOnSale);
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function isOnSale(p: CatalogProduct) {
  return p.price !== null && p.originalPrice !== undefined && p.originalPrice > p.price;
}

// Los productos sin precio van al final en los órdenes por precio.
function comparePrice(a: CatalogProduct, b: CatalogProduct, dir: 1 | -1) {
  if (a.price === null) return b.price === null ? 0 : 1;
  if (b.price === null) return -1;
  return (a.price - b.price) * dir;
}

export function filterProducts(all: CatalogProduct[], filters: CatalogFilters = {}) {
  let result = all.slice();

  if (filters.category) result = result.filter((p) => p.category === filters.category);
  if (filters.brand) result = result.filter((p) => p.brand === filters.brand);
  if (filters.onSale) result = result.filter(isOnSale);
  if (filters.q) {
    // Cada palabra buscada tiene que aparecer, sin importar tildes ni orden.
    const terms = normalizeText(filters.q).split(/\s+/).filter(Boolean);
    result = result.filter((p) => {
      const haystack = normalizeText(`${p.name} ${p.brand ?? ''} ${p.categoryName ?? ''}`);
      return terms.every((t) => haystack.includes(t));
    });
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => comparePrice(a, b, 1));
      break;
    case 'price-desc':
      result.sort((a, b) => comparePrice(a, b, -1));
      break;
    case 'newest':
      result.sort((a, b) => (a.badge === 'NUEVO' ? -1 : 0) - (b.badge === 'NUEVO' ? -1 : 0));
      break;
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return result;
}
