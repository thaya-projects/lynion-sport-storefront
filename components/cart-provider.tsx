'use client';

import type { ReactNode } from 'react';
import { CartDrawer } from '@/components/cart-drawer';
import { MobileStickyCart } from '@/components/mobile-sticky-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <MobileStickyCart />
      <CartDrawer />
    </>
  );
}
