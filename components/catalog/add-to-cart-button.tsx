'use client';

import { useState } from 'react';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import type { CatalogProduct } from '@/lib/catalog-types';
import { useCart } from '@/lib/cart/store';

export function AddToCartButton({ product }: { product: CatalogProduct }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const option = product.option;
  const [choice, setChoice] = useState<string | null>(null);
  const [missingChoice, setMissingChoice] = useState(false);

  // Sin precio o agotado no se puede armar el pedido: queda la consulta por WhatsApp.
  if (product.price === null || product.stock === 0) return null;
  const price = product.price;

  function handleAdd() {
    if (option && !choice) {
      setMissingChoice(true);
      return;
    }
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price,
        imageHue: product.imageHue,
        imageSrc: product.imageSrc,
        maxQty: product.stock,
        option: option && choice ? `${option.name} ${choice}` : undefined,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const maxStock = Math.max(1, product.stock ?? 99);

  return (
    <div className="space-y-4">
      {option && (
        <fieldset>
          <legend className="text-sm font-semibold text-white">
            {option.name}
            {choice ? <span className="font-normal text-white/70">: {choice}</span> : null}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {option.values.map((value) => {
              const selected = choice === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setChoice(value);
                    setMissingChoice(false);
                  }}
                  className={
                    selected
                      ? 'inline-flex min-h-11 min-w-12 items-center justify-center rounded-xl border border-primary bg-primary/15 px-4 text-sm font-bold text-white'
                      : 'inline-flex min-h-11 min-w-12 items-center justify-center rounded-xl border border-white/15 bg-ink-soft px-4 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white'
                  }
                >
                  {value}
                </button>
              );
            })}
          </div>
          {missingChoice && (
            <p role="alert" className="mt-2 text-sm font-medium text-red-300">
              Elige {withArticle(option.name)} para agregarlo al carrito.
            </p>
          )}
        </fieldset>
      )}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <div className="flex items-center rounded-full border border-white/15 bg-ink-soft">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Una unidad menos"
          className="flex h-11 w-11 items-center justify-center text-white/70 transition hover:text-white disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span aria-live="polite" className="min-w-8 text-center text-sm font-bold tabular-nums text-white">
          <span className="sr-only">Cantidad: </span>
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(maxStock, q + 1))}
          disabled={qty >= maxStock}
          aria-label="Una unidad más"
          className="flex h-11 w-11 items-center justify-center text-white/70 transition hover:text-white disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-ink transition hover:bg-primary-hi active:scale-[0.98]"
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
    </div>
  );
}

// "la talla", "el tamaño", "un color"…
function withArticle(name: string) {
  const n = name.trim().toLowerCase();
  if (/^colou?r/.test(n)) return 'un color';
  if (/^(tama[ñn]o|n[uú]mero|size)/.test(n)) return `el ${n}`;
  return `la ${n}`;
}
