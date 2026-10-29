import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductCard } from '@/components/product-card';
import { CatalogFilters } from '@/components/catalog/catalog-filters';
import { SortSelect } from '@/components/catalog/sort-select';
import { CatalogSearch } from '@/components/catalog/catalog-search';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import {
  filterProducts,
  getAllProducts,
  getBrands,
  getCategories,
  hasProductsOnSale,
} from '@/lib/catalog';
import type { CatalogCategory, CatalogProduct, CatalogSort } from '@/lib/catalog-types';
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE, SITE_NAME, WHATSAPP_NUMBER } from '@/lib/site';
import { buildGeneralInquiryUrl, buildWhatsappUrl } from '@/lib/whatsapp';

const CATALOG_DESCRIPTION =
  'Pelotas de fútbol, futsal, vóley y básquet de marcas oficiales: Molten, Spalding, Mikasa, Adidas, Nike y Wilson. Envíos desde Potosí a todo Bolivia.';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type Params = {
  category?: string;
  brand?: string;
  onSale?: string;
  sort?: CatalogSort;
  q?: string;
};

const SORTS: CatalogSort[] = ['featured', 'price-asc', 'price-desc', 'newest'];

// La URL la puede escribir cualquiera: ?q=a&q=b llega como arreglo y un sort
// desconocido se ignora, en vez de romper la página.
function readParams(raw: Awaited<SearchParams>): Params {
  const first = (key: string) => {
    const value = raw[key];
    const text = Array.isArray(value) ? value[0] : value;
    return text?.trim() || undefined;
  };
  const sort = first('sort');
  return {
    category: first('category'),
    brand: first('brand'),
    onSale: first('onSale'),
    sort: SORTS.includes(sort as CatalogSort) ? (sort as CatalogSort) : undefined,
    q: first('q'),
  };
}

// Las combinaciones de filtros no se indexan (noindex, follow) para no
// generar cientos de URLs casi duplicadas; solo el listado base es canónico.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = readParams(await searchParams);
  const hasFilters = Object.values(sp).some((v) => v !== undefined && v !== '');
  return {
    title: 'Catálogo',
    description: CATALOG_DESCRIPTION,
    openGraph: {
      ...BASE_OPEN_GRAPH,
      title: `Catálogo · ${SITE_NAME}`,
      description: CATALOG_DESCRIPTION,
      url: '/productos',
      images: [DEFAULT_OG_IMAGE],
    },
    ...(hasFilters
      ? { robots: { index: false, follow: true } }
      : { alternates: { canonical: '/productos' } }),
  };
}


function resultsLabel(n: number) {
  return n === 1 ? '1 producto' : `${n} productos`;
}

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = readParams(await searchParams);

  // Si la API de Thaya no responde, la página no se cae: avisa y ofrece
  // seguir por WhatsApp.
  let all: CatalogProduct[];
  let categories: CatalogCategory[];
  try {
    [all, categories] = await Promise.all([getAllProducts(), getCategories()]);
  } catch (error) {
    console.error('Catálogo: no se pudo leer la API', error);
    return (
      <CatalogShell>
        <CatalogUnavailable />
      </CatalogShell>
    );
  }

  const filtered = filterProducts(all, {
    category: sp.category,
    brand: sp.brand,
    onSale: sp.onSale === '1',
    sort: sp.sort,
    q: sp.q,
  });
  const filterProps = {
    categories,
    brands: getBrands(all),
    showOnSale: hasProductsOnSale(all),
    resultCount: filtered.length,
  };
  // Sin categorías, marcas ni ofertas cargadas en Thaya no hay nada que
  // filtrar: el panel no se muestra y los productos usan todo el ancho.
  const hasFilters =
    filterProps.categories.length > 0 || filterProps.brands.length > 0 || filterProps.showOnSale;

  return (
    <CatalogShell>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Suspense>
          <CatalogSearch />
        </Suspense>
        <div className="flex gap-3 sm:ml-auto">
          {hasFilters && (
            <Suspense>
              <CatalogFilters {...filterProps} mode="sheet" />
            </Suspense>
          )}
          <Suspense>
            <SortSelect />
          </Suspense>
        </div>
      </div>

      <div className={hasFilters ? 'mt-6 grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8' : 'mt-6'}>
        {hasFilters && (
          <Suspense>
            <CatalogFilters {...filterProps} mode="sidebar" />
          </Suspense>
        )}

        <section aria-labelledby="results-title">
          <h2 id="results-title" className="sr-only">
            Productos
          </h2>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p aria-live="polite" className="mr-2 text-sm text-white/70">
              {resultsLabel(filtered.length)}
            </p>
            <ActiveFilters sp={sp} categories={categories} />
          </div>
          {filtered.length === 0 ? (
            <EmptyState query={sp.q} />
          ) : (
            <div className={hasFilters ? 'grid grid-cols-2 gap-3 lg:grid-cols-3' : 'grid grid-cols-2 gap-3 lg:grid-cols-4'}>
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </CatalogShell>
  );
}

function CatalogShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-8">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Catálogo' }]} />
        <h1 className="mt-4 font-display text-3xl font-black text-white md:text-4xl">Catálogo</h1>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

// Un chip por filtro activo; tocarlo lo quita. Un filtro desconocido
// (?category=xyz) también aparece, así se entiende por qué no hay resultados.
function ActiveFilters({ sp, categories }: { sp: Params; categories: CatalogCategory[] }) {
  const chips: { key: keyof Params; label: string }[] = [];
  if (sp.q) chips.push({ key: 'q', label: `«${sp.q}»` });
  if (sp.category) {
    const name = categories.find((c) => c.slug === sp.category)?.name ?? sp.category;
    chips.push({ key: 'category', label: name });
  }
  if (sp.brand) chips.push({ key: 'brand', label: sp.brand });
  if (sp.onSale === '1') chips.push({ key: 'onSale', label: 'En oferta' });
  if (chips.length === 0) return null;

  function hrefWithout(key: keyof Params) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (k !== key && typeof v === 'string' && v) next.set(k, v);
    }
    const qs = next.toString();
    return qs ? `/productos?${qs}` : '/productos';
  }

  return (
    <>
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={hrefWithout(chip.key)}
          scroll={false}
          aria-label={`Quitar filtro ${chip.label}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 pl-4 pr-3 text-sm text-white transition hover:border-primary"
        >
          {chip.label}
          <X className="h-3.5 w-3.5 text-white/70" aria-hidden />
        </Link>
      ))}
      {chips.length > 1 && (
        <Link
          href="/productos"
          scroll={false}
          className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-primary hover:text-primary-hi"
        >
          Limpiar todo
        </Link>
      )}
    </>
  );
}

function EmptyState({ query }: { query?: string }) {
  const lookingFor = query
    ? `Hola Lynion Sport, estoy buscando: ${query}. ¿Lo tienen o pueden conseguirlo?`
    : 'Hola Lynion Sport, no encontré lo que busco en el catálogo. ¿Me ayudan?';
  return (
    <div className="rounded-2xl border border-white/8 bg-ink-soft px-6 py-12 text-center">
      <h2 className="font-display text-xl font-bold text-white">
        {query ? `No encontramos «${query}»` : 'No hay productos con estos filtros'}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-white/70">
        Prueba con otra palabra o quita algún filtro. Si no lo tenemos publicado, escríbenos: puede
        que lo consigamos.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/productos"
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-ink transition hover:bg-primary-hi"
        >
          Ver todo el catálogo
        </Link>
        <WhatsAppCTA href={buildWhatsappUrl(WHATSAPP_NUMBER, lookingFor)} size="md" variant="outline">
          ¿Lo buscas? Escríbenos
        </WhatsAppCTA>
      </div>
    </div>
  );
}

function CatalogUnavailable() {
  return (
    <div className="mt-6 rounded-2xl border border-white/8 bg-ink-soft px-6 py-12 text-center">
      <h2 className="font-display text-xl font-bold text-white">El catálogo no está disponible ahora</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-white/70">
        No pudimos traer los productos. Vuelve a intentarlo en unos minutos, o pídenos lo que buscas
        por WhatsApp.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/productos"
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-ink transition hover:bg-primary-hi"
        >
          Reintentar
        </Link>
        <WhatsAppCTA href={buildGeneralInquiryUrl(WHATSAPP_NUMBER)} size="md" variant="outline">
          Pedir por WhatsApp
        </WhatsAppCTA>
      </div>
    </div>
  );
}
