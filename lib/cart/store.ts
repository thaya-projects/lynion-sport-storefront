'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  imageHue: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartActions = {
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

export const useCart = create<CartState & CartActions>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, qty: i.qty + qty } : i,
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { ...item, qty }], isOpen: true };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) => (i.productId === productId ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'lynion-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((acc, i) => acc + i.price * i.qty, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((acc, i) => acc + i.qty, 0);
}
