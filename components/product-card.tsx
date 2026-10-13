'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/mocks/products';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/lib/cart/store';
import { cn } from '@/lib/utils';

const badgeStyles: Record<NonNullable<Product['badge']>, { label: string; className: string }> = {
  MAS_VENDIDO: { label: 'Más vendido', className: 'bg-primary text-ink' },
  NUEVO: { label: 'Nuevo', className: 'bg-primary text-ink' },
  OFERTA: { label: 'Oferta', className: 'bg-red-500 text-white' },
  EN_STOCK: { label: 'En stock', className: 'bg-emerald-500 text-white' },
};

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const badge = product.badge ? badgeStyles[product.badge] : null;

  function handleAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      imageHue: product.imageHue,
    });
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-ink-soft"
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 60%, hsl(${product.imageHue} 55% 25% / 0.45), transparent 65%), radial-gradient(circle at 30% 30%, rgba(16,165,245,0.15), transparent 55%), #0d0d14`,
        }}
      >
        {discount ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-wider text-ink shadow-lg shadow-primary/30">
            -{discount}%
          </span>
        ) : badge ? (
          <span
            className={cn(
              'absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-wider',
              badge.className,
            )}
          >
            {badge.label}
          </span>
        ) : null}

        <span className="absolute right-3 top-3 z-10 rounded-md bg-black/50 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          {product.brand}
        </span>

        <Image
          src={product.imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-8 transition duration-500 group-hover:scale-110 group-hover:rotate-3"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/50">
          {product.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-white/95">
          {product.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-white">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-white/40 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-3 py-2.5 text-xs font-black uppercase tracking-widest text-ink transition hover:bg-primary-hi active:scale-[0.98]"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Agregar
        </button>
      </div>
    </motion.article>
  );
}
