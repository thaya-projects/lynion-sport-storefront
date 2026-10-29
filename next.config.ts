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
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      ...inventoriesUploadsPattern(),
    ],
  },
};

export default nextConfig;
