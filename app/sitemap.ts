import type { MetadataRoute } from 'next';
import { products } from '@/lib/mocks/products';
import { PRODUCT_SEO_ENABLED, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  // Ni las páginas ni los mocks tienen fecha de actualización real: se usa la
  // fecha de generación. Con la API, usar la fecha de actualización de cada ítem.
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/productos`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ];

  if (!PRODUCT_SEO_ENABLED) return pages;

  return [
    ...pages,
    ...products.map((p) => ({
      url: `${SITE_URL}/productos/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];
}
