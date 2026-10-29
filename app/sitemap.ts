import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/catalog';
import { PRODUCT_SEO_ENABLED, SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Las páginas fijas no tienen fecha de actualización real: se usa la de
  // generación. Los productos usan updatedAt cuando la API lo devuelva.
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/productos`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/envios`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/nosotros`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  if (!PRODUCT_SEO_ENABLED) return pages;

  const products = await getAllProducts();
  return [
    ...pages,
    ...products.map((p) => ({
      url: `${SITE_URL}/productos/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];
}
