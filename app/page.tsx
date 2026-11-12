import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeroBanner } from '@/components/hero-banner';
import { SportWorlds } from '@/components/sport-worlds';
import { BrandStrip } from '@/components/brand-strip';
import { FeaturedProducts } from '@/components/featured-products';
import { WhatsAppProcess } from '@/components/whatsapp-process';
import { TrustBar } from '@/components/trust-bar';
import { JsonLd } from '@/components/seo/json-ld';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_PROFILES, STORE_HOURS, WHATSAPP_NUMBER } from '@/lib/site';
import type { StoreInfo } from '@/lib/catalog-types';
import { getCategories, getDealProducts, getHomeProducts, getProductCountsByCategory, getStoreInfo } from '@/lib/catalog';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Datos de la tienda: dirección, teléfono y email salen de la Empresa en Thaya
// cuando están cargados.
function buildStoreJsonLd(store: StoreInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportingGoodsStore',
    '@id': `${SITE_URL}/#store`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/logo/lynion-sport.png`,
    logo: `${SITE_URL}/logo/lynion-sport.png`,
    telephone: store.phone ?? WHATSAPP_NUMBER,
    ...(store.email && { email: store.email }),
    address: {
      '@type': 'PostalAddress',
      ...(store.address && { streetAddress: store.address }),
      addressLocality: store.city ?? 'Potosí',
      addressRegion: 'Potosí',
      addressCountry: 'BO',
    },
    areaServed: { '@type': 'Country', name: 'Bolivia' },
    currenciesAccepted: 'BOB',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: STORE_HOURS.days,
      opens: STORE_HOURS.opens,
      closes: STORE_HOURS.closes,
    },
    sameAs: Object.values(SOCIAL_PROFILES),
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
  };
}

export default async function HomePage() {
  // Si la API de Thaya no responde, la landing igual se muestra: sin
  // destacados ni conteos, pero con todo lo demás.
  const [homeProducts, categoryCounts, allDeals, store, categories] = await Promise.all([
    getHomeProducts().catch((error) => {
      console.error('Home: no se pudieron leer los destacados', error);
      return [];
    }),
    getProductCountsByCategory().catch((error) => {
      console.error('Home: no se pudieron leer los conteos por categoría', error);
      return null;
    }),
    getDealProducts().catch((error) => {
      console.error('Home: no se pudieron leer las ofertas', error);
      return [];
    }),
    getStoreInfo(),
    getCategories().catch((error) => {
      console.error('Home: no se pudieron leer las categorías', error);
      return null;
    }),
  ]);
  // Las ofertas no repiten lo que ya está en "Los más vendidos".
  const deals = allDeals.filter((d) => !homeProducts.some((p) => p.id === d.id));

  return (
    <>
      <JsonLd data={buildStoreJsonLd(store)} />
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-8">
        <HeroBanner hasFeatured={homeProducts.length > 0} />
        {/* Sin productos con categoría en Thaya, las canchas se muestran sin "0 productos". */}
        <SportWorlds
          categories={categories}
          counts={categoryCounts && Object.keys(categoryCounts).length > 0 ? categoryCounts : null}
        />
        <BrandStrip />
        <FeaturedProducts items={homeProducts} />
        <FeaturedProducts
          items={deals}
          id="ofertas"
          title="En oferta."
          linkHref="/productos?onSale=1"
          linkLabel="Ver todas"
        />
        <WhatsAppProcess />
        <TrustBar />
      </main>
      <SiteFooter />
    </>
  );
}
