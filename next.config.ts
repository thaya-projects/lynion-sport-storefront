import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // El backend local guarda las fotos en disco y las sirve desde
      // http://localhost:5293/uploads. Solo en desarrollo.
      ...(process.env.NODE_ENV === 'development'
        ? [{ protocol: 'http' as const, hostname: 'localhost', port: '5293', pathname: '/uploads/**' }]
        : []),
    ],
    // Vercel cobra cada transformación. Las fotos de S3 no traen Cache-Control,
    // así que con el TTL por defecto (60 s) se volvían a transformar cada
    // minuto. Cachear 31 días es seguro: al reemplazar una foto su URL cambia.
    minimumCacheTTL: 2678400,
    // Menos anchos posibles = menos transformaciones distintas por imagen.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [128, 256, 384],
  },
};

export default nextConfig;
