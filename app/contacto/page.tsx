import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { getStoreInfo } from '@/lib/catalog';
import { buildGeneralInquiryUrl } from '@/lib/whatsapp';
import {
  BASE_OPEN_GRAPH,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SOCIAL_PROFILES,
  STORE_HOURS,
  WHATSAPP_NUMBER,
} from '@/lib/site';

const DESCRIPTION = 'Escríbenos por WhatsApp, llámanos o visítanos en Potosí. Horario, dirección y redes de Lynion Sport.';

export const metadata: Metadata = {
  title: 'Contacto',
  description: DESCRIPTION,
  alternates: { canonical: '/contacto' },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: `Contacto · ${SITE_NAME}`,
    description: DESCRIPTION,
    url: '/contacto',
    images: [DEFAULT_OG_IMAGE],
  },
};

const socials = [
  { href: SOCIAL_PROFILES.instagram, label: 'Instagram' },
  { href: SOCIAL_PROFILES.facebook, label: 'Facebook' },
  { href: SOCIAL_PROFILES.tiktok, label: 'TikTok' },
  { href: SOCIAL_PROFILES.youtube, label: 'YouTube' },
];

// "+59163693408" → "+591 6 369 3408"; otros formatos se muestran tal cual.
function displayPhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits.replace(/^(\+591)(\d)(\d{3})(\d{4})$/, '$1 $2 $3 $4');
}

// Teléfono, email y dirección son los de la Empresa en Thaya: si se cambian
// allá, cambian aquí (con la caché de 5 minutos del catálogo).
export default async function ContactPage() {
  const store = await getStoreInfo();
  const place = [store.address, store.city].filter(Boolean).join(', ');
  const mapsUrl = place
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, Bolivia`)}`
    : null;

  return (
    <PageShell
      breadcrumb="Contacto"
      title="Contacto"
      lead="La forma más rápida es WhatsApp: ahí armamos pedidos, respondemos dudas y coordinamos envíos."
    >
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
        <section
          aria-labelledby="wa-title"
          className="rounded-3xl border border-whatsapp/30 bg-whatsapp/[0.06] p-6 md:p-8"
        >
          <h2 id="wa-title" className="font-display text-2xl font-extrabold text-white">
            WhatsApp
          </h2>
          <p className="mt-2 text-2xl font-bold tabular-nums text-white">{displayPhone(WHATSAPP_NUMBER)}</p>
          <p className="mt-2 text-base text-white/75">{STORE_HOURS.label}</p>
          <WhatsAppCTA href={buildGeneralInquiryUrl(WHATSAPP_NUMBER)} className="mt-6 w-full sm:w-auto">
            Escríbenos por WhatsApp
          </WhatsAppCTA>
        </section>

        <dl className="divide-y divide-white/8 border-y border-white/8">
          {store.phone && (
            <ContactRow icon={Phone} label="Teléfono">
              <a href={`tel:${store.phone.replace(/[^\d+]/g, '')}`} className="contact-link">
                {displayPhone(store.phone)}
              </a>
            </ContactRow>
          )}
          {store.email && (
            <ContactRow icon={Mail} label="Email">
              <a href={`mailto:${store.email}`} className="contact-link break-all">
                {store.email}
              </a>
            </ContactRow>
          )}
          {place && (
            <ContactRow icon={MapPin} label="Dirección">
              <span className="block text-white">{place}</span>
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener" className="contact-link mt-1 text-sm">
                  Ver en el mapa
                </a>
              )}
            </ContactRow>
          )}
          <ContactRow icon={Clock} label="Horario">
            <span className="text-white">{STORE_HOURS.label}</span>
          </ContactRow>
        </dl>
      </div>

      <section aria-labelledby="social-title" className="mt-12">
        <h2 id="social-title" className="font-display text-2xl font-extrabold text-white">
          Redes
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {socials.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white transition hover:border-white/35"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-base text-white/75">
          ¿Dudas sobre envíos o cambios? Mira{' '}
          <Link href="/envios#preguntas" className="contact-link">
            las preguntas frecuentes
          </Link>
          .
        </p>
      </section>
    </PageShell>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-5">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div className="min-w-0">
        <dt className="text-sm font-semibold text-white/65">{label}</dt>
        <dd className="mt-1 text-base">{children}</dd>
      </div>
    </div>
  );
}
