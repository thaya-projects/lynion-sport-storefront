import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, RefreshCcw, Package } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductCard } from '@/components/product-card';
import { AddToCartButton } from '@/components/catalog/add-to-cart-button';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { getProductBySlug, getRelatedProducts, products } from '@/lib/mocks/products';
import { CATEGORIES } from '@/lib/categories';
import { formatPrice } from '@/lib/format';
import { buildProductInquiryUrl } from '@/lib/whatsapp';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const related = getRelatedProducts(product);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
  const inquiryUrl = buildProductInquiryUrl(wa, product);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-8">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Catálogo', href: '/productos' },
            {
              label: category?.name ?? product.category,
              href: `/productos?category=${product.category}`,
            },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div
            className="relative aspect-square overflow-hidden rounded-3xl border border-white/8 bg-ink-soft"
            style={{
              background: `radial-gradient(circle at 50% 55%, hsl(${product.imageHue} 55% 30% / 0.35), transparent 65%), #0d0d14`,
            }}
          >
            <Image
              src={product.imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
              className="object-contain p-12"
            />
            {discount && (
              <span className="absolute left-5 top-5 rounded-full bg-primary px-3 py-1.5 text-xs font-black uppercase tracking-wider text-ink shadow-lg shadow-primary/30">
                -{discount}%
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-[0.72rem] font-black uppercase tracking-[0.26em] text-primary">
              {product.brand}
            </p>
            <h1 className="mt-2 font-display text-3xl font-black text-white md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-black text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-white/40 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {product.stock !== undefined && (
              <p className="mt-3 flex items-center gap-2 text-xs text-white/60">
                <Package className="h-3.5 w-3.5 text-primary" />
                {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
              </p>
            )}

            <p className="mt-6 text-sm leading-relaxed text-white/70">{product.description}</p>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            <WhatsAppCTA href={inquiryUrl} size="md" className="mt-3 justify-start px-4">
              Consultar este producto por WhatsApp
            </WhatsAppCTA>

            <div className="mt-10 rounded-2xl border border-white/8 bg-ink-soft p-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/85">
                Especificaciones
              </h3>
              <dl className="mt-4 divide-y divide-white/5">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-[auto_1fr] gap-6 py-2.5 text-sm">
                    <dt className="font-semibold text-white/55">{key}</dt>
                    <dd className="text-right text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <TrustBadge icon={ShieldCheck} label="Originales" />
              <TrustBadge icon={Truck} label="Envío Bolivia" />
              <TrustBadge icon={RefreshCcw} label="Cambios 15d" />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-20">
            <h2 id="related-title" className="font-display text-2xl font-extrabold text-white md:text-3xl">
              También te puede interesar
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function TrustBadge({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-ink-soft/60 px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <span className="text-[0.72rem] font-semibold text-white/80">{label}</span>
    </div>
  );
}
