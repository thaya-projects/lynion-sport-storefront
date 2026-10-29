import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { PageShell, InfoSection } from '@/components/page-shell';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { buildWhatsappUrl } from '@/lib/whatsapp';
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE, SITE_NAME, STORE_HOURS, WHATSAPP_NUMBER } from '@/lib/site';

const DESCRIPTION =
  'Cómo comprar en Lynion Sport: envíos desde Potosí a todo Bolivia, pago coordinado por WhatsApp y cambios hasta 15 días.';

export const metadata: Metadata = {
  title: 'Envíos, pagos y cambios',
  description: DESCRIPTION,
  alternates: { canonical: '/envios' },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: `Envíos, pagos y cambios · ${SITE_NAME}`,
    description: DESCRIPTION,
    url: '/envios',
    images: [DEFAULT_OG_IMAGE],
  },
};

const steps = [
  { title: 'Eliges tus productos', body: 'Los agregas al carrito desde el catálogo.' },
  { title: 'Confirmas el pedido', body: 'Dejas tu nombre, teléfono y ciudad, y lo envías por WhatsApp.' },
  { title: 'Te confirmamos todo', body: 'Revisamos stock, precio final y el costo de envío a tu ciudad.' },
  { title: 'Pagas y lo recibes', body: 'Coordinamos el pago y la entrega contigo, directo por WhatsApp.' },
];

// Solo preguntas cuya respuesta ya está en el sitio. Las que dependen de cada
// envío (costo, plazo) se confirman por WhatsApp.
const faqs = [
  {
    q: '¿Necesito crear una cuenta?',
    a: 'No. Armas el carrito, dejas tus datos y el pedido llega por WhatsApp.',
  },
  {
    q: '¿Cuánto cuesta el envío?',
    a: 'Depende de la ciudad de destino. Te decimos el monto exacto antes de que pagues.',
  },
  {
    q: '¿Cuánto tarda en llegar?',
    a: 'Depende del destino. Te confirmamos el plazo cuando coordinamos el envío.',
  },
  {
    q: '¿Los productos son originales?',
    a: 'Sí. Somos distribuidor autorizado de las marcas que vendemos.',
  },
  {
    q: '¿En qué horario atienden?',
    a: `${STORE_HOURS.label}. Si escribes fuera de ese horario, te respondemos apenas abrimos.`,
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function ShippingPage() {
  const shippingQuestion = buildWhatsappUrl(
    WHATSAPP_NUMBER,
    'Hola Lynion Sport, quiero saber cuánto cuesta el envío a mi ciudad.',
  );

  return (
    <PageShell
      breadcrumb="Envíos, pagos y cambios"
      title="Envíos, pagos y cambios"
      lead="Despachamos desde Potosí a todo Bolivia. Todo se coordina por WhatsApp con una persona del equipo, antes de que pagues."
    >
      <JsonLd data={faqJsonLd} />

      <div className="mt-10">
        <InfoSection id="como-comprar" title="Cómo funciona un pedido">
          <ol className="space-y-5">
            {steps.map((step, idx) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/50 text-sm font-black tabular-nums text-primary"
                >
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="mt-0.5">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </InfoSection>

        <InfoSection id="envios" title="Envíos">
          <p>
            Enviamos desde nuestra tienda en Potosí a cualquier ciudad de Bolivia. El costo depende del
            destino: cuando nos envías el pedido te confirmamos el monto y el plazo, y recién ahí decides.
          </p>
          <p>En Potosí coordinamos la entrega directamente contigo.</p>
          <WhatsAppCTA href={shippingQuestion} size="md" variant="outline">
            Consultar el envío a mi ciudad
          </WhatsAppCTA>
        </InfoSection>

        <InfoSection id="pagos" title="Pagos">
          <p>
            En el sitio no se cobra nada. Al confirmar tu pedido por WhatsApp te indicamos las formas de
            pago disponibles y el total con envío incluido.
          </p>
        </InfoSection>

        <InfoSection id="cambios" title="Cambios">
          <p>
            Tienes hasta <strong className="font-semibold text-white">15 días</strong> para pedir un cambio.
            Escríbenos por WhatsApp con tu número de pedido (empieza con LS-) y te explicamos cómo hacerlo.
          </p>
        </InfoSection>

        <InfoSection id="preguntas" title="Preguntas frecuentes">
          <div className="divide-y divide-white/8">
            {faqs.map((f) => (
              <details key={f.q} className="group py-1">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus aria-hidden className="h-5 w-5 shrink-0 text-primary transition group-open:rotate-45" />
                </summary>
                <p className="pb-4">{f.a}</p>
              </details>
            ))}
          </div>
        </InfoSection>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-white/8 pt-10">
        <Link
          href="/productos"
          className="inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-bold text-ink transition hover:bg-primary-hi"
        >
          Ver catálogo
        </Link>
        <Link
          href="/contacto"
          className="inline-flex min-h-12 items-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:border-white/35"
        >
          Otras formas de contacto
        </Link>
      </div>
    </PageShell>
  );
}
