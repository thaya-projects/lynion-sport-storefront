export const SITE_NAME = 'Lynion Sport';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lynion.thaya.app').replace(/\/$/, '');

export const SITE_DESCRIPTION =
  'Tienda oficial Lynion Sport en Bolivia. Pelotas de fútbol, futsal, vóley y básquet de marcas oficiales: Molten, Spalding, Mikasa, Adidas, Nike y Wilson. Envíos desde Potosí a todo el país.';

// Next reemplaza (no combina) el openGraph del layout cuando una página define
// el suyo, así que cada página parte de esta base para no perder estos campos.
export const BASE_OPEN_GRAPH = {
  type: 'website',
  siteName: SITE_NAME,
  locale: 'es_BO',
} as const;

// Generada por app/opengraph-image.tsx.
export const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Lynion Sport — Pelotas y equipamiento deportivo en Bolivia',
};

export const SOCIAL_PROFILES = {
  instagram: 'https://instagram.com/lynionsport',
  facebook: 'https://facebook.com/lynionsport',
  tiktok: 'https://tiktok.com/@lynionsport',
  youtube: 'https://youtube.com/@lynionsport',
} as const;

// Mientras el catálogo venga de mocks, no se publican datos de producto a
// buscadores (JSON-LD Product, og:image por producto, sitemap de productos).
// Activar con PRODUCT_SEO_ENABLED=true cuando el catálogo use la API real.
export const PRODUCT_SEO_ENABLED = process.env.PRODUCT_SEO_ENABLED === 'true';
