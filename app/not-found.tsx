import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { buildGeneralInquiryUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const inquiryUrl = buildGeneralInquiryUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '');

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-24 pt-20 text-center md:px-8">
        <p className="font-display text-7xl font-black text-primary md:text-8xl">404</p>
        <h1 className="mt-4 font-display text-3xl font-black text-white md:text-4xl">
          Esta página se fue fuera de la cancha
        </h1>
        <p className="mt-3 max-w-md text-sm text-white/60">
          El link puede estar roto o el producto ya no está publicado. Volvé al inicio o
          escribinos y te ayudamos a encontrarlo.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-ink transition hover:bg-primary-hi"
          >
            Volver al inicio
          </Link>
          <WhatsAppCTA href={inquiryUrl} size="lg">
            Consultar por WhatsApp
          </WhatsAppCTA>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
