import type { NextConfig } from 'next';

type RemotePattern = NonNullable<NonNullable<NextConfig['images']>['remotePatterns']>[number];

// En producción las fotos de Thaya vienen de S3 (amazonaws). Con el backend
// guardando en disco (Storage:Provider=Local) se sirven desde el mismo host de
// la API bajo /uploads, así que se permite ese origen.
function inventoriesUploadsPattern(): RemotePattern[] {
  const apiUrl = process.env.INVENTORIES_API_URL;
  if (!apiUrl) return [];
  try {
    const { protocol, hostname, port } = new URL(apiUrl);
    return [
      {
        protocol: protocol.replace(':', '') as 'http' | 'https',
        hostname,
        port,
        pathname: '/uploads/**',
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Con IMAGES_UNOPTIMIZED=true Vercel no procesa ninguna imagen (costo 0):
    // el navegador las baja tal cual de S3. Activarlo solo cuando el backend
    // ya haya convertido todas las fotos a WebP livianos.
    unoptimized: process.env.IMAGES_UNOPTIMIZED === 'true',
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      ...inventoriesUploadsPattern(),
    ],
    // Vercel cobra cada transformación. Las fotos de S3 no traen Cache-Control,
    // así que con el TTL por defecto se volvían a transformar seguido.
    // Cachear 31 días es seguro: al reemplazar una foto su URL cambia.
    minimumCacheTTL: 2678400,
    // Menos anchos posibles = menos transformaciones distintas por imagen.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [128, 256, 384],
  },
};

export default nextConfig;