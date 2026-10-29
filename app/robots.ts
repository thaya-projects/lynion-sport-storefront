import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Los listados filtrados (/productos?...) no se bloquean aquí a propósito:
// llevan noindex, follow, y Google solo puede leer ese noindex si los rastrea.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
