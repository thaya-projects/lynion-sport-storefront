'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { CartDrawer } from '@/components/cart-drawer';
import { CartToast } from '@/components/cart-toast';
import { MobileStickyCart } from '@/components/mobile-sticky-cart';

// reducedMotion="user": con "reducir movimiento" activado en el sistema, las
// animaciones de motion dejan solo los cambios de opacidad.
export function CartProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <MobileStickyCart />
      <CartToast />
      <CartDrawer />
    </MotionConfig>
  );
}
