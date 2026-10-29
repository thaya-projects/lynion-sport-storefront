'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useId, useState, useTransition } from 'react';
import { Loader2, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { CatalogCategory } from '@/lib/catalog-types';
import { useDialog } from '@/lib/use-dialog';
import { cn } from '@/lib/utils';

type Props = {
  categories: CatalogCategory[];
  brands: string[];
  showOnSale: boolean;
  // Resultados con los filtros actuales; lo calcula el servidor y llega de
  // nuevo con cada cambio de URL.
  resultCount: number;
  // sidebar: columna fija en escritorio. sheet: botón + panel inferior en
  // celular y tablet.
  mode: 'sidebar' | 'sheet';
};

function resultsLabel(n: number) {
  return n === 1 ? 'Ver 1 producto' : `Ver ${n} productos`;
}

export function CatalogFilters({ categories, brands, showOnSale, resultCount, mode }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useDialog<HTMLElement>(sheetOpen, () => setSheetOpen(false));

  const currentCategory = params.get('category');
  const currentBrand = params.get('brand');
  const onSale = params.get('onSale') === '1';
  const activeCount = [currentCategory, currentBrand, onSale || null].filter(Boolean).length;

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    if (value === null) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function clearAll() {
    // La búsqueda no es un filtro de este panel: se conserva.
    const q = params.get('q');
    startTransition(() => {
      router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false });
    });
  }

  const body = (
    <div className="space-y-7">
      {categories.length > 0 && (
        <FilterGroup title="Deporte">
          <FilterRadio label="Todos" checked={!currentCategory} onSelect={() => update('category', null)} />
          {categories.map((c) => (
            <FilterRadio
              key={c.slug}
              label={c.name}
              checked={currentCategory === c.slug}
              onSelect={() => update('category', c.slug)}
            />
          ))}
        </FilterGroup>
      )}

      {brands.length > 0 && (
        <FilterGroup title="Marca">
          <FilterRadio label="Todas" checked={!currentBrand} onSelect={() => update('brand', null)} />
          {brands.map((b) => (
            <FilterRadio key={b} label={b} checked={currentBrand === b} onSelect={() => update('brand', b)} />
          ))}
        </FilterGroup>
      )}

      {showOnSale && (
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/70">Promociones</h3>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm text-white/80 transition hover:bg-white/5 hover:text-white">
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => update('onSale', e.target.checked ? '1' : null)}
              className="h-4 w-4 shrink-0 rounded border-white/25 bg-transparent accent-primary"
            />
            En oferta
          </label>
        </div>
      )}
    </div>
  );

  if (mode === 'sidebar') {
    return (
      <aside
        className="sticky top-24 hidden self-start rounded-2xl border border-white/8 bg-ink-soft p-6 lg:block"
        aria-labelledby="filters-title"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="filters-title" className="text-xs font-black uppercase tracking-[0.2em] text-white/85">
            Filtros
          </h2>
          {pending && <Loader2 className="h-4 w-4 animate-spin text-white/60" aria-label="Actualizando" />}
        </div>
        {body}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="mt-6 min-h-11 w-full rounded-full border border-white/15 px-4 text-sm font-semibold text-white/80 transition hover:border-primary hover:text-white"
          >
            Limpiar filtros
          </button>
        )}
      </aside>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-ink-soft px-5 text-sm font-semibold text-white/90 sm:flex-none lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden />
        Filtros
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-black tabular-nums text-ink">
            <span className="sr-only">activos: </span>
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSheetOpen(false)}
          >
            <motion.aside
              ref={sheetRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 36 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85dvh] w-full flex-col rounded-t-3xl border-t border-white/10 bg-ink-soft"
              role="dialog"
              aria-modal="true"
              aria-labelledby="filters-sheet-title"
            >
              <header className="flex items-center justify-between border-b border-white/10 py-2 pl-5 pr-2">
                <h2 id="filters-sheet-title" className="text-sm font-black uppercase tracking-[0.18em] text-white">
                  Filtros
                </h2>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-white/70 hover:text-white"
                  aria-label="Cerrar filtros"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>
              <div className="flex-1 overflow-y-auto px-5 py-5">{body}</div>
              <footer className="flex gap-3 border-t border-white/10 px-5 py-4">
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="min-h-12 rounded-full border border-white/15 px-5 text-sm font-semibold text-white/85"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-ink"
                >
                  {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                  {pending ? 'Actualizando…' : resultsLabel(resultCount)}
                </button>
              </footer>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <div>
      <h3 id={id} className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
        {title}
      </h3>
      <div role="radiogroup" aria-labelledby={id} className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

function FilterRadio({
  label,
  checked,
  onSelect,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        'flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-sm transition',
        checked ? 'bg-primary/10 text-white' : 'text-white/75 hover:bg-white/5 hover:text-white',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition',
          checked ? 'border-primary bg-primary' : 'border-white/30',
        )}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
      </span>
      {label}
    </button>
  );
}
