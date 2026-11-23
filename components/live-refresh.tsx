'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Escucha /api/live y, cuando Thaya avisa un cambio, vuelve a pedir los datos
// de la página actual sin recargarla: el carrito, el scroll y lo escrito en
// los formularios se mantienen. Si la conexión se corta, EventSource
// reintenta solo.
export function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    const source = new EventSource('/api/live');
    const refresh = () => router.refresh();
    source.addEventListener('catalog-changed', refresh);
    return () => {
      source.removeEventListener('catalog-changed', refresh);
      source.close();
    };
  }, [router]);

  return null;
}
