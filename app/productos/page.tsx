import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductCard } from '@/components/product-card';
import { CatalogFilters } from '@/components/catalog/catalog-filters';
import { SortSelect } from '@/components/catalog/sort-select';
import { CatalogSearch } from '@/components/catalog/catalog-search';
import {
  filterProducts,
  getAllProducts,
  getBrands,
  getCategories,
  hasProductsOnSale,
} from '@/lib/catalog';
import type { CatalogSort } from '@/lib/catalog-types';
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/site';

const CATALOG_DESCRIPTION =
  'Pelotas, indumentaria y accesorios deportivos de las mejores marcas. Molten, Spalding, Mikasa, Adidas, Nike y Wilson. Envíos a todo Bolivia.';

type SearchParams = Promise<{
  category?: string;
  brand?: string;
  onSale?: string;
  sort?: CatalogSort;
  q?: string;
}>;

// Las combinaciones de filtros no se indexan (noindex, follow) para no
// generar cientos de URLs casi duplicadas; solo el listado base es canónico.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
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

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const [all, categories] = await Promise.all([getAllProducts(), getCategories()]);
  const filtered = filterProducts(all, {
    category: sp.category,
    brand: sp.brand,
    onSale: sp.onSale === '1',
    sort: sp.sort,
    q: sp.q,
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-8">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Catálogo' }]} />

        <header className="mt-6">
          <h1 className="font-display text-3xl font-black text-white md:text-4xl">
            Catálogo
          </h1>
          <p className="mt-1 text-sm text-white/55">
            {filtered.length === 1 ? '1 producto disponible' : `${filtered.length} productos disponibles`}
          </p>
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Suspense>
            <CatalogSearch />
          </Suspense>
          <Suspense>
            <SortSelect />
          </Suspense>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
          <Suspense>
            <CatalogFilters
              categories={categories}
              brands={getBrands(all)}
              showOnSale={hasProductsOnSale(all)}
            />
          </Suspense>

          <div>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/8 bg-ink-soft p-10 text-center">
      <p className="text-sm text-white/60">
        No encontramos productos con esos filtros.
        <br />
        Probá quitar alguno o ajustá la búsqueda.
      </p>
    </div>
  );
}
