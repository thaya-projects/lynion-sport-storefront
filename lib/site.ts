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

// Un solo número para todo el sitio: sin la variable de entorno, los enlaces
// de WhatsApp quedarían como wa.me/ vacío.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+59163693408';

export const CONTACT_EMAIL = 'lynionsports@gmail.com';

// Horario de atención: lo usan el footer, Contacto y el JSON-LD de la tienda.
export const STORE_HOURS = {
  label: 'Lun a Sáb · 9:00 — 20:00',
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  opens: '09:00',
  closes: '20:00',
} as const;

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
