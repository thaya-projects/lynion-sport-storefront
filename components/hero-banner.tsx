'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { ArrowDown } from 'lucide-react';
import { buildGeneralInquiryUrl } from '@/lib/whatsapp';
import { WHATSAPP_NUMBER } from '@/lib/site';

// hasFeatured: si la API no devolvió destacados, el botón principal va al
// catálogo en vez de a una sección que no está en la página.
export function HeroBanner({ hasFeatured = true }: { hasFeatured?: boolean }) {
  const waUrl = buildGeneralInquiryUrl(WHATSAPP_NUMBER);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-ink-soft">
      <div aria-hidden className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-lynion-500/10 blur-3xl" />

      <div className="relative grid gap-6 md:grid-cols-2 md:gap-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 flex flex-col justify-center px-6 py-12 md:px-14 md:py-14 lg:py-16"
        >
          <h1 className="font-display text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl md:text-[3.25rem] lg:text-[3.75rem]">
            Pelotas originales,
            <br />
            <span className="text-primary">listas para la cancha.</span>
          </h1>

          <p className="mt-5 max-w-md text-base text-white/75">
            Fútbol, futsal, vóley y básquet de Molten, Mikasa, Spalding, Adidas, Nike y Wilson.
            Eliges aquí, confirmas por WhatsApp y te lo enviamos a todo Bolivia.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={hasFeatured ? '#mas-vendidos' : '/productos'}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-ink transition hover:bg-primary-hi"
            >
              {hasFeatured ? 'Ver los más vendidos' : 'Ver catálogo'}
              {hasFeatured && <ArrowDown className="h-4 w-4" aria-hidden />}
            </Link>
            <WhatsAppCTA href={waUrl} variant="outline">
              ¿Dudas? Escríbenos
            </WhatsAppCTA>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          className="relative min-h-[340px] md:min-h-[480px]"
        >
          <Image
            src="/hero/athlete.webp"
            alt="Jugadora de vóley Lynion Sport"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-bottom"
          />

          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-ink-soft via-ink-soft/60 to-transparent md:w-1/4"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ink-soft/70 to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-soft/60 to-transparent"
          />

          <div className="pointer-events-none absolute bottom-6 right-6 z-10 text-right md:bottom-10 md:right-10">
            <p className="font-script text-4xl leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] md:text-5xl">
              Juega
              <br />
              sin límites.
            </p>
            <svg
              className="ml-auto mt-1 h-4 w-32"
              viewBox="0 0 128 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 12 C 30 4, 70 4, 126 10"
                stroke="url(#underline-grad)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <defs>
                <linearGradient id="underline-grad" x1="0" y1="0" x2="128" y2="0">
                  <stop offset="0%" stopColor="#29a8ff" />
                  <stop offset="100%" stopColor="#6b4ae6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
