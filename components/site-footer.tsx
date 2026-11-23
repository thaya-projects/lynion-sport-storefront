import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Music2, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { LynionLogo } from '@/components/lynion-logo';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { CATEGORIES } from '@/lib/categories';
import { buildGeneralInquiryUrl } from '@/lib/whatsapp';
import { CONTACT_EMAIL, SITE_URL, SOCIAL_PROFILES, STORE_HOURS, WHATSAPP_NUMBER } from '@/lib/site';

const atencion = [
  { href: '/envios#como-comprar', label: 'Cómo comprar' },
  { href: '/envios', label: 'Envíos y pagos' },
  { href: '/envios#preguntas', label: 'Preguntas frecuentes' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
];

const socials = [
  { href: SOCIAL_PROFILES.instagram, label: 'Instagram', Icon: Instagram, hoverBg: 'hover:bg-[#E4405F]' },
  { href: SOCIAL_PROFILES.facebook, label: 'Facebook', Icon: Facebook, hoverBg: 'hover:bg-[#1877F2]' },
  { href: SOCIAL_PROFILES.tiktok, label: 'TikTok', Icon: Music2, hoverBg: 'hover:bg-black' },
  { href: SOCIAL_PROFILES.youtube, label: 'YouTube', Icon: Youtube, hoverBg: 'hover:bg-[#FF0000]' },
];

const categoryLinks = CATEGORIES.map((c) => ({ href: `/productos?category=${c.slug}`, label: c.name }));

const whatsAppDisplay = WHATSAPP_NUMBER.replace(/^(\+591)(\d)(\d{3})(\d{4})$/, '$1 $2 $3 $4');
const phoneDisplay = WHATSAPP_NUMBER.replace(/^(\+591)(\d{8})$/, '$1 $2');
const siteDisplay = SITE_URL.replace(/^https?:\/\//, '');

const headingClass = 'text-xs font-black uppercase tracking-[0.2em] text-white/85';

export function SiteFooter() {
  const waUrl = buildGeneralInquiryUrl(WHATSAPP_NUMBER);

  return (
    <footer className="relative mt-16 overflow-hidden bg-ink-soft">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1.2fr] md:gap-10">
          <div>
            <LynionLogo />
            <div className="mt-5 max-w-xs space-y-2 text-sm leading-relaxed text-white/70">
              <p>Distribuidor autorizado en Bolivia.</p>
              <p>Especialistas en importación y exportación de balones originales de las distintas disciplinas.</p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75">
              <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
              Potosí · Bolivia
            </div>
            <ul className="mt-5 space-y-1 text-sm text-white/75">
              <li>
                <a href={`tel:${WHATSAPP_NUMBER}`} className="inline-flex min-h-9 items-center gap-2.5 tabular-nums transition hover:text-primary">
                  <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-9 items-center gap-2.5 break-all transition hover:text-primary">
                  <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href={SITE_URL} className="inline-flex min-h-9 items-center gap-2.5 break-all transition hover:text-primary">
                  <Globe className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {siteDisplay}
                </a>
              </li>
            </ul>
          </div>

          <FooterColumn title="Categorías" items={categoryLinks} />
          <FooterColumn title="Atención al cliente" items={atencion} />

          <div>
            <h2 className={headingClass}>Chatea con nosotros</h2>
            <WhatsAppCTA href={waUrl} size="md" className="mt-4">
              {whatsAppDisplay}
            </WhatsAppCTA>
            <p className="mt-3 text-xs text-white/65">
              {STORE_HOURS.label}
            </p>

            <div className="mt-8">
              <h2 className={headingClass}>Síguenos</h2>
              <div className="mt-4 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={s.label}
                    className={`group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition ${s.hoverBg} hover:border-transparent hover:text-white`}
                  >
                    <s.Icon className="h-4 w-4" aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/60 md:flex-row md:items-center md:justify-between md:px-8">
          <span>
            © {new Date().getFullYear()} Lynion Sport. Todos los derechos reservados.
          </span>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <span>
              Diseño y desarrollo por{' '}
              <a
                href="https://consultorathaya.com"
                target="_blank"
                rel="noopener"
                className="inline-block py-3 font-semibold text-white/85 transition hover:text-primary"
              >
                Consultora Thaya
              </a>
            </span>
            <span className="flex items-center gap-2">
              Hecho en Bolivia
              <Image
                src="/flags/bolivia.png"
                alt="Bandera de Bolivia"
                width={22}
                height={15}
                className="rounded-sm border border-white/10 shadow"
              />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className={headingClass}>{title}</h2>
      <ul className="mt-2 text-sm">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className="inline-flex min-h-11 items-center text-white/70 transition hover:text-primary"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
