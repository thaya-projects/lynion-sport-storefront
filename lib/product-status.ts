import type { CatalogProduct } from '@/lib/catalog-types';

// Con pocas unidades se muestra el número exacto ("¡Quedan 3!"); con más, solo
// "En stock", para no publicar el inventario completo.
const LOW_STOCK = 5;

export type StockStatus = { kind: 'out' } | { kind: 'low'; units: number } | { kind: 'in' };

// undefined: el producto no controla stock en Thaya, no se dice nada.
export function stockStatus(product: Pick<CatalogProduct, 'stock'>): StockStatus | undefined {
  if (product.stock === undefined) return undefined;
  if (product.stock <= 0) return { kind: 'out' };
  if (product.stock <= LOW_STOCK) return { kind: 'low', units: product.stock };
  return { kind: 'in' };
}

export function isSoldOut(product: Pick<CatalogProduct, 'stock'>) {
  return stockStatus(product)?.kind === 'out';
}

const dealDate = new Intl.DateTimeFormat('es-BO', {
  day: 'numeric',
  month: 'long',
  timeZone: 'America/La_Paz',
});

// "15 de noviembre", en hora de Bolivia.
export function formatDealEnd(iso: string | undefined) {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : dealDate.format(date);
}
