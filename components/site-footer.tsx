import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Music2, MapPin } from 'lucide-react';
import { LynionLogo } from '@/components/lynion-logo';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { CATEGORIES } from '@/lib/categories';
import { buildGeneralInquiryUrl } from '@/lib/whatsapp';
import { SOCIAL_PROFILES } from '@/lib/site';

const atencion = [
  { href: '/faq', label: 'Preguntas frecuentes' },
  { href: '/politicas', label: 'Políticas de compra' },
  { href: '/cambios', label: 'Cambios y devoluciones' },
  { href: '/terminos', label: 'Términos y condiciones' },
];

const socials = [
  { href: SOCIAL_PROFILES.instagram, label: 'Instagram', Icon: Instagram, hoverBg: 'hover:bg-[#E4405F]' },
  { href: SOCIAL_PROFILES.facebook, label: 'Facebook', Icon: Facebook, hoverBg: 'hover:bg-[#1877F2]' },
  { href: SOCIAL_PROFILES.tiktok, label: 'TikTok', Icon: Music2, hoverBg: 'hover:bg-black' },
  { href: SOCIAL_PROFILES.youtube, label: 'YouTube', Icon: Youtube, hoverBg: 'hover:bg-[#FF0000]' },
];

const categoryLinks = [
  ...CATEGORIES.map((c) => ({ href: `/productos?category=${c.slug}`, label: c.name })),
  { href: '/marcas', label: 'Marcas' },
];

const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+591 6 369 3408';
const whatsAppDisplay = rawWhatsApp.replace(/^(\+591)(\d)(\d{3})(\d{4})$/, '$1 $2 $3 $4');

export function SiteFooter() {
  const waUrl = buildGeneralInquiryUrl(rawWhatsApp);

  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-soft">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div aria-hidden className="absolute -right-40 -top-20 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
      <div aria-hidden className="absolute -left-40 bottom-10 h-72 w-72 rounded-full bg-accent/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1.2fr] md:gap-10">
          <div>
            <LynionLogo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Distribuidor autorizado en Bolivia.
              Pelotas, indumentaria y accesorios de las mejores marcas.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.68rem] font-semibold text-white/70">
              <MapPin className="h-3 w-3 text-primary" />
              Potosí · Bolivia
            </div>
          </div>

          <FooterColumn title="Categorías" items={categoryLinks} />
          <FooterColumn title="Atención al cliente" items={atencion} />

          <div>
            <h4 className="text-[0.7rem] font-black uppercase tracking-[0.24em] text-white/85">
              Chateá con nosotros
            </h4>
            <WhatsAppCTA href={waUrl} size="md" className="mt-4">
              {whatsAppDisplay}
            </WhatsAppCTA>
            <p className="mt-3 text-xs text-white/45">
              Lun a Sáb · 9:00 — 20:00
            </p>

            <div className="mt-8">
              <p className="text-[0.7rem] font-black uppercase tracking-[0.24em] text-white/85">
                Seguinos
              </p>
              <div className="mt-4 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={s.label}
                    className={`group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition ${s.hoverBg} hover:border-transparent hover:text-white`}
                  >
                    <s.Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/40 md:flex-row md:items-center md:justify-between md:px-8">
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
                className="font-semibold text-white/80 transition hover:text-primary"
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
      <h4 className="text-[0.7rem] font-black uppercase tracking-[0.24em] text-white/85">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className="text-white/60 transition hover:text-primary"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
