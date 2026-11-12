import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, InfoSection } from '@/components/page-shell';
import { BrandStrip } from '@/components/brand-strip';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { getAllProducts, getCategories, getStoreInfo } from '@/lib/catalog';
import { buildGeneralInquiryUrl } from '@/lib/whatsapp';
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE, SITE_NAME, WHATSAPP_NUMBER } from '@/lib/site';

const DESCRIPTION =
  'Lynion Sport: especialistas en la importación y distribución de balones originales de Molten, Mikasa, Spalding, Adidas, Nike y Wilson. Desde Potosí a todo Bolivia.';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: DESCRIPTION,
  alternates: { canonical: '/nosotros' },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: `Nosotros · ${SITE_NAME}`,
    description: DESCRIPTION,
    url: '/nosotros',
    images: [DEFAULT_OG_IMAGE],
  },
};

// El tamaño del catálogo sale de Thaya; si la API no responde, la frase se omite.
async function catalogSize() {
  const store = await getStoreInfo();
  if (store.productCount !== null && store.categoryCount !== null) {
    return { products: store.productCount, sports: store.categoryCount };
  }
  try {
    const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);
    return { products: products.length, sports: categories.length };
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const [store, size] = await Promise.all([getStoreInfo(), catalogSize()]);
  const city = store.city ?? 'Potosí';

  return (
    <PageShell
      breadcrumb="Nosotros"
      title="Somos Lynion Sport"
      lead={`Especialistas en la importación y distribución de balones originales de las mejores marcas mundiales. Desde ${city}, conectamos a deportistas y clubes de todo Bolivia con equipamiento oficial de alta gama, garantizando calidad, autenticidad y atención personalizada en cada compra.`}
    >
      <div className="mt-10">
        <InfoSection title="Qué vendemos">
          <p>
            Ponemos a tu disposición balones oficiales de fútbol, futsal, vóley y básquetbol. Trabajamos
            directamente con marcas líderes como Molten, Mikasa, Spalding, Adidas, Nike y Wilson,
            asegurando 100% de originalidad.
          </p>
          {size && size.products > 0 && (
            <p>
              Actualmente contamos con{' '}
              <strong className="font-semibold text-white">
                {size.products === 1 ? '1 producto publicado' : `${size.products} productos publicados`}
              </strong>{' '}
              distribuidos en{' '}
              <strong className="font-semibold text-white">
                {size.sports === 1 ? '1 disciplina' : `${size.sports} disciplinas`}
              </strong>
              , con precios e inventario siempre actualizados.
            </p>
          )}
        </InfoSection>

        <InfoSection title="Cómo trabajamos">
          <p>
            Comprar con nosotros es rápido, seguro y sin intermediarios. Explora nuestro catálogo, envíanos
            tu pedido directamente por WhatsApp y un asesor de nuestro equipo te confirmará stock, precio y
            detalles de envío antes de realizar cualquier pago.
          </p>
          <p>
            Despachamos desde {city} hacia cualquier ciudad de Bolivia. Conoce más detalles en nuestra
            sección de{' '}
            <Link href="/envios" className="font-semibold text-primary underline-offset-4 hover:underline">
              Envíos
            </Link>
            .
          </p>
        </InfoSection>
      </div>

      <BrandStrip />

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/productos"
          className="inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-bold text-ink transition hover:bg-primary-hi"
        >
          Ver catálogo
        </Link>
        <WhatsAppCTA href={buildGeneralInquiryUrl(WHATSAPP_NUMBER)} variant="outline">
          Escríbenos
        </WhatsAppCTA>
      </div>
    </PageShell>
  );
}
