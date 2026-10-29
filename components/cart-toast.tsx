'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useCart } from '@/lib/cart/store';

const VISIBLE_MS = 3500;

// Confirmación al agregar: no interrumpe la navegación como lo hacía abrir el
// carrito, pero deja el acceso a un toque.
export function CartToast() {
  const lastAdded = useCart((s) => s.lastAdded);
  const dismiss = useCart((s) => s.dismissAdded);
  const openDrawer = useCart((s) => s.openDrawer);

  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(dismiss, VISIBLE_MS);
    return () => clearTimeout(t);
  }, [lastAdded, dismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-24 z-40 flex justify-center lg:inset-x-auto lg:bottom-6 lg:right-6"
    >
      <AnimatePresence>
        {lastAdded && (
          <motion.div
            key={lastAdded.at}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-ink-soft py-2 pl-4 pr-2 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7)]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-ink">
              <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
            </span>
            <p className="min-w-0 flex-1 text-sm text-white">
              <span className="block text-xs text-white/60">Agregado al carrito</span>
              <span className="block truncate font-semibold">{lastAdded.name}</span>
            </p>
            <button
              type="button"
              onClick={openDrawer}
              className="min-h-11 shrink-0 rounded-full px-4 text-sm font-bold text-primary transition hover:bg-primary/10"
            >
              Ver carrito
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
