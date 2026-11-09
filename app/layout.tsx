import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Space_Grotesk, Caveat } from 'next/font/google';
import { CartProvider } from '@/components/cart-provider';
import { LiveRefresh } from '@/components/live-refresh';
import { JsonLd } from '@/components/seo/json-ld';
import { BASE_OPEN_GRAPH, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_PROFILES, WHATSAPP_NUMBER } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lynion Sport Bolivia — Pelotas y equipamiento deportivo',
    template: '%s · Lynion Sport',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
};

const whatsappNumber = WHATSAPP_NUMBER;

const siteJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'es-BO',
    publisher: { '@id': `${SITE_URL}/#organization` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo/lynion-sport.png`,
    sameAs: Object.values(SOCIAL_PROFILES),
    ...(whatsappNumber && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: whatsappNumber,
        contactType: 'customer service',
        areaServed: 'BO',
        availableLanguage: 'es',
      },
    }),
  },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${caveat.variable}`}
    >
      <body>
        <JsonLd data={siteJsonLd} />
        <CartProvider>{children}</CartProvider>
        <LiveRefresh />
      </body>
    </html>
  );
}
