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
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

// Solo datos publicados en el sitio: falta calle, coordenadas y email.
const storeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportingGoodsStore',
  '@id': `${SITE_URL}/#store`,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/logo/lynion-sport.png`,
  logo: `${SITE_URL}/logo/lynion-sport.png`,
  ...(whatsappNumber && { telephone: whatsappNumber }),
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Potosí',
    addressRegion: 'Potosí',
    addressCountry: 'BO',
  },
  areaServed: { '@type': 'Country', name: 'Bolivia' },
  currenciesAccepted: 'BOB',
  // Mismo horario que muestra el footer.
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '20:00',
  },
  sameAs: Object.values(SOCIAL_PROFILES),
  parentOrganization: { '@id': `${SITE_URL}/#organization` },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={storeJsonLd} />
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-8">
        <HeroBanner />
        <SportWorlds />
        <BrandStrip />
        <FeaturedProducts />
        <WhatsAppProcess />
        <TrustBar />
      </main>
      <SiteFooter />
    </>
  );
}
