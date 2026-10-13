'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cartCount, cartSubtotal, useCart } from '@/lib/cart/store';
import { formatPrice } from '@/lib/format';

export function MobileStickyCart() {
  const items = useCart((s) => s.items);
  const openDrawer = useCart((s) => s.openDrawer);
  const isDrawerOpen = useCart((s) => s.isOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? cartCount(items) : 0;
  const subtotal = mounted ? cartSubtotal(items) : 0;
  const visible = mounted && count > 0 && !isDrawerOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          onClick={openDrawer}
          className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-ink-soft/95 px-5 py-3.5 shadow-2xl shadow-primary/20 backdrop-blur-xl lg:hidden"
          aria-label={`Ver carrito con ${count} productos por ${formatPrice(subtotal)}`}
        >
          <span className="flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-ink">
              <ShoppingBag className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="flex flex-col text-left">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/60">
                {count} {count === 1 ? 'producto' : 'productos'}
              </span>
              <span className="text-sm font-black text-white">{formatPrice(subtotal)}</span>
            </span>
          </span>
          <span className="text-[0.7rem] font-black uppercase tracking-[0.16em] text-primary">
            Ver carrito ➔
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
