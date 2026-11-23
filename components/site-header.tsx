'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Search } from 'lucide-react';
import { LynionLogo } from '@/components/lynion-logo';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { CartBadge } from '@/components/cart-badge';
import { buildGeneralInquiryUrl } from '@/lib/whatsapp';
import { WHATSAPP_NUMBER } from '@/lib/site';
import { useDialog } from '@/lib/use-dialog';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Catálogo' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/envios', label: 'Envíos' },
  { href: '/contacto', label: 'Contacto' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const waUrl = buildGeneralInquiryUrl(WHATSAPP_NUMBER);
  const menuRef = useDialog<HTMLElement>(open, () => setOpen(false));

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 md:px-8">
          <Link href="/" aria-label="Lynion Sport — inicio" className="shrink-0">
            <LynionLogo priority />
          </Link>

          <nav
            aria-label="Navegación principal"
            className="ml-auto hidden items-center gap-8 lg:flex"
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative py-1 text-sm font-semibold transition',
                    active ? 'text-lynion-500' : 'text-white/80 hover:text-white',
                  )}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-1 h-[2px] bg-lynion-500"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:gap-3 lg:ml-4">
            <Link
              href="/productos#buscar"
              aria-label="Buscar productos"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Link>

            <CartBadge />

            <WhatsAppCTA href={waUrl} size="md" className="hidden md:inline-flex">
              Chatea por WhatsApp
            </WhatsAppCTA>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-white/85 transition hover:border-white/30 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
          >
            <motion.aside
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-ink-soft"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
            >
              <div className="flex items-center justify-between border-b border-white/10 py-3 pl-5 pr-3">
                <LynionLogo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Menú móvil">
                <ul className="space-y-1">
                  {navLinks.map((link, idx) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + idx * 0.04, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-lg px-4 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white/85 transition hover:bg-white/5 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-white/10 p-5">
                <WhatsAppCTA href={waUrl} className="w-full">
                  Chatea por WhatsApp
                </WhatsAppCTA>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
