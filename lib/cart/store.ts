'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  brand?: string;
  price: number;
  imageHue: number;
  // Opcional: carritos guardados antes de tener foto siguen funcionando.
  imageSrc?: string | null;
  // Stock que informa Thaya; sin él, la cantidad no tiene tope.
  maxQty?: number;
  // Talla (u otra opción) elegida, ej. "Talla 7". El mismo producto en dos tallas son dos líneas.
  option?: string;
  qty: number;
};

// Identifica la línea del carrito: producto + opción elegida.
export function cartItemKey(item: Pick<CartItem, 'productId' | 'option'>) {
  return item.option ? `${item.productId}::${item.option}` : item.productId;
}

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  // Último producto agregado, para el aviso. `at` distingue dos agregados
  // seguidos del mismo producto.
  lastAdded: { name: string; at: number } | null;
};

type CartActions = {
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  // Reemplaza el carrito por la versión que corrigió el servidor (precios o
  // stock que cambiaron en Thaya).
  replaceItems: (items: CartItem[]) => void;
  dismissAdded: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

export const useCart = create<CartState & CartActions>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      lastAdded: null,
      // Agregar no abre el carrito: se avisa y se sigue mirando productos.
      add: (item, qty = 1) =>
        set((state) => {
          const lastAdded = { name: item.option ? `${item.name} · ${item.option}` : item.name, at: Date.now() };
          const key = cartItemKey(item);
          const existing = state.items.find((i) => cartItemKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                cartItemKey(i) === key
                  ? { ...i, ...item, qty: clampQty(i.qty + qty, item.maxQty) }
                  : i,
              ),
              lastAdded,
            };
          }
          return { items: [...state.items, { ...item, qty: clampQty(qty, item.maxQty) }], lastAdded };
        }),
      remove: (key) =>
        set((state) => ({ items: state.items.filter((i) => cartItemKey(i) !== key) })),
      setQty: (key, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => cartItemKey(i) !== key)
              : state.items.map((i) =>
                  cartItemKey(i) === key ? { ...i, qty: clampQty(qty, i.maxQty) } : i,
                ),
        })),
      clear: () => set({ items: [] }),
      replaceItems: (items) => set({ items }),
      dismissAdded: () => set({ lastAdded: null }),
      openDrawer: () => set({ isOpen: true, lastAdded: null }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'lynion-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

function clampQty(qty: number, maxQty: number | undefined) {
  return maxQty === undefined ? qty : Math.min(qty, Math.max(1, maxQty));
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((acc, i) => acc + i.price * i.qty, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((acc, i) => acc + i.qty, 0);
}
