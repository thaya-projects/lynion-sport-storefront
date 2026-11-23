import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { buildGeneralInquiryUrl } from '@/lib/whatsapp';
import { WHATSAPP_NUMBER } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const inquiryUrl = buildGeneralInquiryUrl(WHATSAPP_NUMBER);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-24 pt-20 text-center md:px-8">
        <p className="font-display text-7xl font-black text-primary md:text-8xl">404</p>
        <h1 className="mt-4 font-display text-3xl font-black text-white md:text-4xl">
          Esta página se fue fuera de la cancha
        </h1>
        <p className="mt-3 max-w-md text-base text-white/75">
          El enlace puede estar roto o el producto ya no está publicado. Mira el catálogo o
          escríbenos y te ayudamos a encontrarlo.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/productos"
            className="inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-bold text-ink transition hover:bg-primary-hi"
          >
            Ver catálogo
          </Link>
          <WhatsAppCTA href={inquiryUrl} variant="outline">
            Consultar por WhatsApp
          </WhatsAppCTA>
        </div>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-white/70 hover:text-white">
          Volver al inicio
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
