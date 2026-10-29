'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import type { CatalogProduct } from '@/lib/catalog-types';
import { NoPhoto } from '@/components/no-photo';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/lib/cart/store';
import { buildProductInquiryUrl } from '@/lib/whatsapp';
import { WHATSAPP_NUMBER } from '@/lib/site';
import { formatDealEnd, isSoldOut } from '@/lib/product-status';
import { cn } from '@/lib/utils';

// Ofertas siempre en rojo (badge o % de descuento); el resto, en el azul de la marca.
const badgeStyles: Record<NonNullable<CatalogProduct['badge']>, { label: string; className: string }> = {
  MAS_VENDIDO: { label: 'Más vendido', className: 'bg-primary text-ink' },
  NUEVO: { label: 'Nuevo', className: 'bg-primary text-ink' },
  OFERTA: { label: 'Oferta', className: 'bg-red-600 text-white' },
  EN_STOCK: { label: 'En stock', className: 'bg-emerald-400 text-ink' },
};

const badgeBase =
  'absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-xs font-black uppercase tracking-wide md:left-3 md:top-3 md:px-2.5 md:py-1';

export function ProductCard({ product }: { product: CatalogProduct }) {
  const add = useCart((s) => s.add);

  const discount =
    product.price !== null && product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const badge = product.badge ? badgeStyles[product.badge] : null;
  const soldOut = isSoldOut(product);
  const dealEnd = discount ? formatDealEnd(product.discountEndsAt) : null;
  const canAdd = product.price !== null && !soldOut;
  const href = `/productos/${product.slug}`;
  const hoverImage = product.images[1];

  function handleAdd() {
    if (!canAdd || product.price === null) return;
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      imageHue: product.imageHue,
      imageSrc: product.imageSrc,
      maxQty: product.stock,
    });
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-ink-soft transition-colors hover:border-white/20"
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 60%, hsl(${product.imageHue} 55% 25% / 0.45), transparent 65%), #0d0d14`,
        }}
      >
        {soldOut ? (
          <span className={cn(badgeBase, 'bg-white/85 text-ink')}>Agotado</span>
        ) : discount ? (
          <span className={cn(badgeBase, 'bg-red-600 text-white')}>-{discount}%</span>
        ) : badge ? (
          <span className={cn(badgeBase, badge.className)}>{badge.label}</span>
        ) : null}

        {product.imageSrc ? (
          <>
            <Image
              src={product.imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className={cn(
                'object-contain p-3 transition duration-500 ease-out group-hover:scale-105 md:p-5',
                hoverImage && 'group-hover:opacity-0',
                soldOut && 'opacity-50',
              )}
            />
            {/* Si el producto tiene más fotos en Thaya, la segunda aparece al pasar el mouse. */}
            {hoverImage && (
              <Image
                src={hoverImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-contain p-3 opacity-0 transition duration-500 ease-out group-hover:scale-105 group-hover:opacity-100 md:p-5"
              />
            )}
          </>
        ) : (
          <NoPhoto />
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-4">
        {(product.brand ?? product.categoryName) && (
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">
            {product.brand ?? product.categoryName}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-white">
          {/* Enlace estirado: toda la tarjeta lleva a la ficha; el botón queda encima. */}
          <Link
            href={href}
            title={product.name}
            className="after:absolute after:inset-0 after:z-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 md:mt-3">
          <span className="text-base font-bold tabular-nums text-white md:text-lg">
            {product.price !== null ? formatPrice(product.price) : 'Precio a consultar'}
          </span>
          {discount && product.originalPrice && (
            <span className="text-xs tabular-nums text-white/60 line-through">
              <span className="sr-only">Antes </span>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {dealEnd && <p className="mt-1 text-xs font-semibold text-red-300">Oferta hasta el {dealEnd}</p>}

        <div className="relative z-10 mt-auto pt-3 md:pt-4">
          {canAdd ? (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Agregar ${product.name} al carrito`}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-3 text-xs font-black uppercase tracking-wider text-ink transition hover:bg-primary-hi active:scale-[0.98]"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden />
              Agregar
            </button>
          ) : (
            <a
              href={buildProductInquiryUrl(WHATSAPP_NUMBER, product)}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/15 px-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-whatsapp/60"
            >
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
              {soldOut ? 'Consultar disponibilidad' : 'Consultar precio'}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
