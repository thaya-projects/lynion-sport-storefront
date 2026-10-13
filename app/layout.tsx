import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Space_Grotesk, Caveat } from 'next/font/google';
import { CartProvider } from '@/components/cart-provider';
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lynionsport.bo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Lynion Sport Bolivia — Pelotas y equipamiento deportivo',
    template: '%s · Lynion Sport',
  },
  description:
    'Tienda oficial Lynion Sport en Bolivia. Pelotas de fútbol, futsal, vóley y básquet de marcas oficiales: Molten, Spalding, Mikasa, Adidas, Nike y Wilson. Envíos desde Potosí a todo el país.',
  openGraph: {
    type: 'website',
    siteName: 'Lynion Sport',
    url: siteUrl,
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${caveat.variable}`}
    >
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
