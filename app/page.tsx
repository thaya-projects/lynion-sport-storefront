import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeroBanner } from '@/components/hero-banner';
import { SportWorlds } from '@/components/sport-worlds';
import { BrandStrip } from '@/components/brand-strip';
import { FeaturedProducts } from '@/components/featured-products';
import { WhatsAppProcess } from '@/components/whatsapp-process';
import { TrustBar } from '@/components/trust-bar';

export default function HomePage() {
  return (
    <>
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
