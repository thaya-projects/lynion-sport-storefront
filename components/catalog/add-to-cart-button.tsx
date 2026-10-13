'use client';

import { useState } from 'react';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import type { Product } from '@/lib/mocks/products';
import { useCart } from '@/lib/cart/store';

export function AddToCartButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        imageHue: product.imageHue,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const maxStock = product.stock ?? 99;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <div className="flex items-center rounded-full border border-white/15 bg-ink-soft">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Disminuir"
          className="flex h-11 w-11 items-center justify-center text-white/70 transition hover:text-white disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-8 text-center text-sm font-bold text-white">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(maxStock, q + 1))}
          disabled={qty >= maxStock}
          aria-label="Aumentar"
          className="flex h-11 w-11 items-center justify-center text-white/70 transition hover:text-white disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-ink transition hover:bg-primary-hi active:scale-[0.98]"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" strokeWidth={3} />
            Agregado al carrito
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Agregar al carrito
          </>
        )}
      </button>
    </div>
  );
}
