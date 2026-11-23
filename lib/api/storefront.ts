// Cliente de la API pública del storefront (Inventories backend):
//   GET {INVENTORIES_API_URL}/public/storefront/{slug}
//   GET {INVENTORIES_API_URL}/public/storefront/{slug}/catalog?page=&pageSize=
// Tipos verificados contra la respuesta real, no solo contra el código.

export type ApiProduct = {
  id: string;
  name: string;
  price: number | null;
  // Solo tiene valor si el descuento está vigente ahora; el backend ya
  // resuelve las fechas.
  discountPrice: number | null;
  // Imagen principal. imageUrls trae la galería completa (principal primero,
  // luego por SortOrder); es opcional porque un backend sin actualizar no la
  // devuelve.
  imageUrl: string | null;
  imageUrls?: string[];
  categoryName: string | null;
  // Opcionales: un backend sin actualizar no los devuelve y la UI los omite.
  code?: string;
  description?: string | null;
  // JSON libre del formulario de producto de Thaya, ya aplanado a texto.
  attributes?: Record<string, string>;
  // null si el producto no controla stock.
  stock?: number | null;
  // Fin del descuento vigente (ISO); null si no tiene fecha de fin.
  discountEndsAt?: string | null;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
};

export type ApiCategory = {
  id: string;
  name: string;
  // Foto subida en Thaya para la categoría; null si no tiene.
  imageUrl?: string | null;
  // null en las categorías principales.
  parentId?: string | null;
};

export type ApiStorefront = {
  company: {
    id: string;
    name: string;
    logoUrl: string | null;
    industry: string | null;
    phone?: string | null;
    email?: string | null;
    city?: string | null;
    address?: string | null;
  };
  stats: { categoryCount: number; productCount: number };
  featuredProduct: ApiProduct | null;
  topProducts: ApiProduct[];
  categories: ApiCategory[];
};

type ApiCatalogPage = {
  items: ApiProduct[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

// En producción los datos se cachean 5 minutos como respaldo: lo normal es que
// Thaya avise de cada cambio a /api/revalidate y se vea al instante. En
// desarrollo no se cachea nada, así cualquier cambio (incluso por SQL) se ve
// al recargar.
const REVALIDATE_SECONDS = process.env.NODE_ENV === 'development' ? 0 : 300;
const PAGE_SIZE = 100;
const MAX_PAGES = 20;

function storefrontUrl(path = '') {
  const base = process.env.INVENTORIES_API_URL;
  if (!base) throw new Error('Falta INVENTORIES_API_URL para leer el catálogo desde la API');
  const slug = process.env.STOREFRONT_SLUG ?? 'lynion';
  return `${base.replace(/\/$/, '')}/public/storefront/${encodeURIComponent(slug)}${path}`;
}

// Las llamadas salen siempre del servidor de Next (nunca del navegador), así
// que la clave no llega al visitante. El backend todavía no la exige: si
// STOREFRONT_API_KEY no está definida, no se manda el header.
function storefrontHeaders(): HeadersInit {
  const key = process.env.STOREFRONT_API_KEY;
  return key ? { 'X-Storefront-Key': key } : {};
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: storefrontHeaders(),
    next: { revalidate: REVALIDATE_SECONDS, tags: ['storefront'] },
  });
  if (!res.ok) throw new Error(`API storefront respondió ${res.status} en ${url}`);
  return res.json() as Promise<T>;
}

export function fetchStorefront() {
  return getJson<ApiStorefront>(storefrontUrl());
}

export async function fetchAllCatalogProducts() {
  const items: ApiProduct[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await getJson<ApiCatalogPage>(
      storefrontUrl(`/catalog?page=${page}&pageSize=${PAGE_SIZE}`),
    );
    items.push(...data.items);
    if (page >= data.totalPages) break;
  }
  return items;
}
