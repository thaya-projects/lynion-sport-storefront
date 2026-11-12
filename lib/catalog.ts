import { cache } from 'react';
import { fetchAllCatalogProducts, fetchStorefront, type ApiProduct } from '@/lib/api/storefront';
import type { CatalogCategory, CatalogFilters, CatalogProduct, ProductOption, StoreInfo } from '@/lib/catalog-types';
import { CATEGORIES, categoryDisplayName, categoryHue, slugify } from '@/lib/categories';
import { products as mockProducts } from '@/lib/mocks/products';
import { SITE_NAME, WHATSAPP_NUMBER } from '@/lib/site';

// Única puerta de entrada al catálogo. Con INVENTORIES_API_URL definida se lee
// la API pública del backend; los mocks solo se usan sin API configurada o
// forzándolos con CATALOG_SOURCE=mock.
export const CATALOG_FROM_API =
  !!process.env.INVENTORIES_API_URL && process.env.CATALOG_SOURCE !== 'mock';

const HOME_PRODUCTS_LIMIT = 4;
const HOME_DEALS_LIMIT = 4;
// Un producto cargado en Thaya hace menos de esto lleva la etiqueta "Nuevo".
const NEW_PRODUCT_DAYS = 30;
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

// Con un backend que todavía no manda imageUrls, la galería es solo la principal.
function apiImages(p: ApiProduct) {
  if (p.imageUrls?.length) return p.imageUrls;
  return p.imageUrl ? [p.imageUrl] : [];
}

// En los atributos de Thaya, la clave "marca" (o "brand") es la marca del
// producto; el resto se muestra como especificaciones.
const BRAND_KEYS = new Set(['marca', 'brand']);

function apiAttributes(attributes: Record<string, string> | undefined) {
  let brand: string | undefined;
  const specs: Record<string, string> = {};
  for (const [key, value] of Object.entries(attributes ?? {})) {
    if (BRAND_KEYS.has(key.trim().toLowerCase())) brand = value;
    else specs[capitalize(key.trim())] = value;
  }
  // Lo que se elige al comprar (Talla) ya se ve en el selector: no se repite en especificaciones.
  const option = productOption(specs);
  if (option) delete specs[option.name];
  return { brand, specs: Object.keys(specs).length > 0 ? specs : undefined, option };
}

// "Talla: 5, 6, 7" (o Tamaño, Medida, Número, Color) con más de un valor: el cliente elige uno
// al agregar al carrito. Thaya guarda las tallas repetidas juntas, separadas por coma.
const OPTION_KEY = /^(tallas?|tama[ñn]os?|medidas?|n[uú]meros?|colou?r(es)?|size)$/i;

function productOption(specs: Record<string, string>): ProductOption | undefined {
  for (const [name, raw] of Object.entries(specs)) {
    if (!OPTION_KEY.test(name.trim())) continue;
    const values = [...new Set(raw.split(/\s*(?:,|;|\/|\s+y\s+)\s*/i).map((v) => v.trim()).filter(Boolean))];
    if (values.length < 2) continue;
    const numeric = values.every((v) => /\d/.test(v));
    if (numeric) values.sort((a, b) => parseFloat(a.replace(/[^\d.]/g, '')) - parseFloat(b.replace(/[^\d.]/g, '')));
    return { name, values };
  }
  return undefined;
}

// En Thaya las claves de atributos se escriben a mano ("tamaño"); en la ficha
// se muestran como etiqueta ("Tamaño").
function capitalize(text: string) {
  return text.charAt(0).toLocaleUpperCase('es') + text.slice(1);
}

function isRecent(iso: string | undefined) {
  if (!iso) return false;
  const created = new Date(iso).getTime();
  return Number.isFinite(created) && Date.now() - created < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
}

function fromApi(p: ApiProduct): CatalogProduct {
  const category = p.categoryName ? slugify(p.categoryName) : null;
  const images = apiImages(p);
  const { brand, specs, option } = apiAttributes(p.attributes);
  return {
    id: p.id,
    slug: apiProductSlug(p),
    name: p.name,
    ...apiPrices(p),
    imageSrc: images[0] ?? null,
    images,
    category,
    categoryName: category && p.categoryName ? categoryDisplayName(category, p.categoryName) : null,
    imageHue: categoryHue(category),
    brand,
    specs,
    option,
    sku: p.code || undefined,
    description: p.description?.trim() || undefined,
    stock: p.stock === null || p.stock === undefined ? undefined : Math.max(0, Math.floor(p.stock)),
    discountEndsAt: p.discountEndsAt ?? undefined,
    featured: p.isFeatured,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt ?? p.createdAt,
    badge: isRecent(p.createdAt) ? 'NUEVO' : undefined,
  };
}

function fromMock(p: (typeof mockProducts)[number]): CatalogProduct {
  return {
    ...p,
    images: p.images ?? [p.imageSrc],
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
  if (!CATALOG_FROM_API) return CATEGORIES.map(({ slug, name }) => ({ slug, name, imageUrl: null, isRoot: true }));
  const storefront = await fetchStorefront();
  return storefront.categories.map((c) => {
    const slug = slugify(c.name);
    return {
      slug,
      name: categoryDisplayName(slug, c.name),
      imageUrl: c.imageUrl ?? null,
      isRoot: !c.parentId,
    };
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

// Productos con descuento vigente en Thaya, los que más ahorran primero.
export async function getDealProducts(): Promise<CatalogProduct[]> {
  const all = await getAllProducts();
  return all
    .filter(isOnSale)
    .sort((a, b) => savings(b) - savings(a))
    .slice(0, HOME_DEALS_LIMIT);
}

function savings(p: CatalogProduct) {
  return p.originalPrice && p.price !== null ? (p.originalPrice - p.price) / p.originalPrice : 0;
}

export const getStoreInfo = cache(async (): Promise<StoreInfo> => {
  const fallback: StoreInfo = {
    name: SITE_NAME,
    phone: WHATSAPP_NUMBER,
    email: null,
    city: 'Potosí',
    address: null,
    productCount: null,
    categoryCount: null,
  };
  if (!CATALOG_FROM_API) return fallback;
  try {
    const { company, stats } = await fetchStorefront();
    return {
      name: company.name || SITE_NAME,
      phone: company.phone?.trim() || fallback.phone,
      email: company.email?.trim() || null,
      city: company.city?.trim() || fallback.city,
      address: company.address?.trim() || null,
      productCount: stats.productCount,
      categoryCount: stats.categoryCount,
    };
  } catch (error) {
    console.error('No se pudieron leer los datos de la tienda', error);
    return fallback;
  }
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
      // Con la API se ordena por la fecha de alta en Thaya; los mocks no la
      // tienen y usan la etiqueta "Nuevo".
      result.sort((a, b) =>
        a.createdAt && b.createdAt
          ? b.createdAt.localeCompare(a.createdAt)
          : (a.badge === 'NUEVO' ? -1 : 0) - (b.badge === 'NUEVO' ? -1 : 0),
      );
      break;
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return result;
}
