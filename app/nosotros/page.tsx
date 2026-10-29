import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, InfoSection } from '@/components/page-shell';
import { BrandStrip } from '@/components/brand-strip';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { getAllProducts, getCategories, getStoreInfo } from '@/lib/catalog';
import { buildGeneralInquiryUrl } from '@/lib/whatsapp';
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE, SITE_NAME, WHATSAPP_NUMBER } from '@/lib/site';

const DESCRIPTION =
  'Lynion Sport es una tienda de pelotas originales en Potosí, distribuidor autorizado de Molten, Mikasa, Spalding, Adidas, Nike y Wilson, con envíos a todo Bolivia.';

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
      lead={`Una tienda de pelotas originales en ${city}. Trabajamos con marcas oficiales y enviamos a todo Bolivia, con atención directa por WhatsApp.`}
    >
      <div className="mt-10">
        <InfoSection title="Qué vendemos">
          <p>
            Pelotas de fútbol, futsal, vóley y básquet. Somos distribuidor autorizado de Molten, Mikasa,
            Spalding, Adidas, Nike y Wilson, así que lo que compras es original.
          </p>
          {size && size.products > 0 && (
            <p>
              Hoy tenemos{' '}
              <strong className="font-semibold text-white">
                {size.products === 1 ? '1 producto publicado' : `${size.products} productos publicados`}
              </strong>{' '}
              en{' '}
              <strong className="font-semibold text-white">
                {size.sports === 1 ? '1 deporte' : `${size.sports} deportes`}
              </strong>
              , con precio y fotos actualizados desde nuestro inventario.
            </p>
          )}
        </InfoSection>

        <InfoSection title="Cómo trabajamos">
          <p>
            Sin cuentas ni pasarelas de pago. Eliges en el catálogo, nos envías el pedido por WhatsApp y
            una persona del equipo te confirma stock, precio y envío antes de que pagues.
          </p>
          <p>
            Despachamos desde {city} a cualquier ciudad del país. Los detalles están en{' '}
            <Link href="/envios" className="font-semibold text-primary underline-offset-4 hover:underline">
              Envíos, pagos y cambios
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
