import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Breadcrumbs } from '@/components/breadcrumbs';

// Estructura de las páginas de información (Nosotros, Envíos, Contacto):
// header, ruta, título con bajada y el contenido a un ancho cómodo de lectura.
export function PageShell({
  title,
  lead,
  breadcrumb,
  children,
}: {
  title: string;
  lead: ReactNode;
  breadcrumb: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-8">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: breadcrumb }]} />
        <header className="mt-4 max-w-3xl">
          <h1 className="font-display text-4xl font-black leading-tight text-white md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-white/75">{lead}</p>
        </header>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

// Bloque de texto con título: el ritmo de lectura de las páginas de información.
export function InfoSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="border-t border-white/8 py-10 md:py-12">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
        <h2 id={id ? `${id}-title` : undefined} className="font-display text-2xl font-extrabold text-white">
          {title}
        </h2>
        <div className="max-w-[65ch] space-y-4 text-base leading-relaxed text-white/75">{children}</div>
      </div>
    </section>
  );
}
