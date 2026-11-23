import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Truck, Package } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductCard } from '@/components/product-card';
import { AddToCartButton } from '@/components/catalog/add-to-cart-button';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { ProductGallery } from '@/components/product-gallery';
import { getAllProducts, getProduct, getRelatedProducts } from '@/lib/catalog';
import type { CatalogProduct } from '@/lib/catalog-types';
import { JsonLd } from '@/components/seo/json-ld';
import { truncateDescription } from '@/lib/seo';
import { richTextToPlain } from '@/lib/rich-text';
import { RichText } from '@/components/rich-text';
import {
  BASE_OPEN_GRAPH,
  DEFAULT_OG_IMAGE,
  PRODUCT_SEO_ENABLED,
  SITE_NAME,
  SITE_URL,
  WHATSAPP_NUMBER,
} from '@/lib/site';
import { formatPrice } from '@/lib/format';
import { buildProductInquiryUrl, buildWhatsappUrl } from '@/lib/whatsapp';
import { formatDealEnd, stockStatus } from '@/lib/product-status';

type Params = Promise<{ slug: string }>;

// Si la API no responde en el build, no se pre-generan páginas: se generan al
// primer request (dynamicParams) en vez de romper el deploy.
export async function generateStaticParams() {
  try {
    const all = await getAllProducts();
    return all.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.warn('generateStaticParams: no se pudo leer el catálogo', error);
    return [];
  }
}

// La API todavía no devuelve descripción: se arma una con datos reales.
function productDescription(product: CatalogProduct) {
  if (product.description) return product.description;
  const parts = [`${product.name} en Lynion Sport.`];
  if (product.categoryName) parts.push(`Categoría ${product.categoryName}.`);
  if (product.price !== null) parts.push(`Precio ${formatPrice(product.price)}.`);
  parts.push('Pídelo por WhatsApp con envío a todo Bolivia.');
  return parts.join(' ');
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const description = truncateDescription(richTextToPlain(productDescription(product)));
  const url = `/productos/${product.slug}`;
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      title: `${product.name} · ${SITE_NAME}`,
      description,
      url,
      images:
        PRODUCT_SEO_ENABLED && product.imageSrc
          ? [{ url: product.imageSrc, alt: product.name }]
          : [DEFAULT_OG_IMAGE],
    },
  };
}

// Solo los campos que existen: si la API no trae marca, SKU o foto, se omiten.
function buildProductJsonLd(product: CatalogProduct) {
  const url = `${SITE_URL}/productos/${product.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: richTextToPlain(productDescription(product)),
    url,
    ...(product.sku && { sku: product.sku }),
    ...(product.images.length > 0 && {
      image: product.images.map((src) => new URL(src, SITE_URL).toString()),
    }),
    ...(product.brand && { brand: { '@type': 'Brand', name: product.brand } }),
    ...(product.categoryName && { category: product.categoryName }),
    // Solo con precio real. Agotado solo si Thaya controla stock y llegó a 0;
    // sin control de stock, si está publicado, está a la venta.
    ...(product.price !== null &&
      product.price > 0 && {
        offers: {
          '@type': 'Offer',
          url,
          price: product.price.toFixed(2),
          priceCurrency: 'BOB',
          availability:
            product.stock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          seller: { '@id': `${SITE_URL}/#organization` },
        },
      }),
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  // Slug viejo (el producto cambió de nombre): se redirige al actual.
  if (product.slug !== slug) permanentRedirect(`/productos/${product.slug}`);

  const related = await getRelatedProducts(product);
  const description = productDescription(product);

  const discount =
    product.price !== null && product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const stock = stockStatus(product);
  const soldOut = stock?.kind === 'out';
  const dealEnd = discount ? formatDealEnd(product.discountEndsAt) : null;
  const inquiryUrl = soldOut
    ? buildWhatsappUrl(
        WHATSAPP_NUMBER,
        `Hola Lynion Sport, vi que ${product.name} está agotado. ¿Cuándo vuelve a llegar?`,
      )
    : buildProductInquiryUrl(WHATSAPP_NUMBER, product);
  const subtitle = [product.brand, product.categoryName].filter(Boolean).join(' · ');
  const whatsappLabel = soldOut
    ? 'Consultar disponibilidad'
    : product.price === null
      ? 'Consultar precio por WhatsApp'
      : 'Consultar este producto por WhatsApp';

  return (
    <>
      {PRODUCT_SEO_ENABLED && <JsonLd data={buildProductJsonLd(product)} />}
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-3 md:px-8 md:pt-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Catálogo', href: '/productos' },
            ...(product.category && product.categoryName
              ? [
                  {
                    label: product.categoryName,
                    href: `/productos?category=${product.category}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />

        <div className="mt-3 grid gap-5 md:mt-6 md:gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <ProductGallery
            images={product.images}
            name={product.name}
            imageHue={product.imageHue}
            discount={discount}
          />

          <div className="flex flex-col">
            <h1 className="font-display text-[1.75rem] font-black leading-tight text-white md:text-4xl">
              {product.name}
            </h1>
            {(subtitle || product.sku) && (
              <p className="mt-1.5 text-sm font-semibold text-white/70">
                {subtitle}
                {product.sku && (
                  <span className="font-normal text-white/60">
                    {subtitle ? ' · ' : ''}Código {product.sku}
                  </span>
                )}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 md:mt-5">
              <span className="font-display text-3xl font-black md:text-4xl tabular-nums text-white">
                {product.price !== null ? formatPrice(product.price) : 'Precio a consultar'}
              </span>
              {discount && product.originalPrice && (
                <span className="text-base tabular-nums text-white/60 line-through">
                  <span className="sr-only">Antes </span>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {dealEnd && (
              <p className="mt-2 text-sm font-semibold text-red-300">Oferta válida hasta el {dealEnd}</p>
            )}

            {stock && (
              <p
                className={
                  stock.kind === 'out'
                    ? 'mt-3 flex items-center gap-2 text-sm font-semibold text-white'
                    : stock.kind === 'low'
                      ? 'mt-3 flex items-center gap-2 text-sm font-semibold text-amber-300'
                      : 'mt-3 flex items-center gap-2 text-sm text-white/70'
                }
              >
                <Package className="h-4 w-4 text-primary" aria-hidden />
                {stock.kind === 'out'
                  ? 'Agotado por ahora'
                  : stock.kind === 'low'
                    ? stock.units === 1
                      ? '¡Queda 1 unidad!'
                      : `¡Quedan ${stock.units} unidades!`
                    : 'En stock'}
              </p>
            )}

            <div className="mt-4 md:mt-6">
              <AddToCartButton product={product} />
            </div>

            <WhatsAppCTA
              href={inquiryUrl}
              size="md"
              variant={product.price === null || soldOut ? 'solid' : 'outline'}
              className="mt-3 w-full"
            >
              {whatsappLabel}
            </WhatsAppCTA>

            <ul className="mt-6 space-y-3 rounded-2xl border border-white/8 bg-ink-soft/60 p-5 text-sm">
              <PurchaseInfo icon={Truck} title="Envío a todo Bolivia">
                Despachamos desde Potosí. El costo depende del destino y lo confirmamos por WhatsApp antes
                de que pagues.
              </PurchaseInfo>
              <PurchaseInfo icon={ShieldCheck} title="Productos originales">
                Somos distribuidor autorizado de las marcas que vendemos.
              </PurchaseInfo>
            </ul>

            <RichText text={description} className="mt-8 max-w-prose space-y-4 text-base leading-relaxed text-white/75" />

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-8 rounded-2xl border border-white/8 bg-ink-soft p-6">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/85">
                  Especificaciones
                </h2>
                <dl className="mt-4 divide-y divide-white/5">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-[auto_1fr] gap-6 py-2.5 text-sm">
                      <dt className="font-semibold text-white/65">{key}</dt>
                      <dd className="text-right text-white">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
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

function PurchaseInfo({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-white/70">{children}</p>
      </div>
    </li>
  );
}
