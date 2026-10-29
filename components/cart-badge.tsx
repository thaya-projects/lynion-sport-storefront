'use client';

import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cartCount, useCart } from '@/lib/cart/store';

export function CartBadge() {
  const items = useCart((s) => s.items);
  const openDrawer = useCart((s) => s.openDrawer);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={count === 1 ? 'Abrir carrito (1 producto)' : `Abrir carrito (${count} productos)`}
      className="relative inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-white/85 transition hover:border-lynion-500 hover:text-white"
    >
      <ShoppingCart className="h-4 w-4" aria-hidden />
      <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] md:inline">Carrito</span>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-black tabular-nums text-ink">
          {count}
        </span>
      )}
    </button>
  );
}
