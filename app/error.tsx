'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { buildGeneralInquiryUrl } from '@/lib/whatsapp';
import { WHATSAPP_NUMBER } from '@/lib/site';

// Lo más probable es que la API de Thaya no haya respondido. El visitante no
// queda ante un "Application error": puede reintentar o pedir por WhatsApp.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-24 pt-20 text-center md:px-8">
        <h1 className="font-display text-3xl font-black text-white md:text-4xl">
          No pudimos cargar la tienda
        </h1>
        <p className="mt-3 max-w-md text-base text-white/75">
          Tuvimos un problema para traer los productos. Vuelve a intentarlo en un momento, o
          escríbenos y te ayudamos con tu pedido por WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-ink transition hover:bg-primary-hi"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reintentar
          </button>
          <WhatsAppCTA href={buildGeneralInquiryUrl(WHATSAPP_NUMBER)} variant="outline">
            Pedir por WhatsApp
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
