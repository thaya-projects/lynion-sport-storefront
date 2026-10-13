'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CATEGORIES } from '@/lib/categories';
import { BRANDS } from '@/lib/mocks/products';
import { cn } from '@/lib/utils';

export function CatalogFilters({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);

  const currentCategory = params.get('category');
  const currentBrand = params.get('brand');
  const onSale = params.get('onSale') === '1';

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    if (value === null) next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }

  function clearAll() {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  const hasActive = currentCategory || currentBrand || onSale;

  const body = (
    <div className="space-y-8">
      <FilterSection title="Deporte">
        <FilterRadio
          label="Todos"
          checked={!currentCategory}
          onChange={() => update('category', null)}
        />
        {CATEGORIES.map((c) => (
          <FilterRadio
            key={c.slug}
            label={c.name}
            checked={currentCategory === c.slug}
            onChange={() => update('category', c.slug)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Marca">
        <FilterRadio
          label="Todas"
          checked={!currentBrand}
          onChange={() => update('brand', null)}
        />
        {BRANDS.map((b) => (
          <FilterRadio
            key={b}
            label={b}
            checked={currentBrand === b}
            onChange={() => update('brand', b)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Promociones">
        <label className="flex cursor-pointer items-center gap-3 py-1 text-sm text-white/75 transition hover:text-white">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => update('onSale', e.target.checked ? '1' : null)}
            className="h-4 w-4 shrink-0 rounded border-white/25 bg-transparent accent-primary"
          />
          En oferta
        </label>
      </FilterSection>

      {hasActive && (
        <button
          type="button"
          onClick={clearAll}
          className="w-full rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-primary hover:text-white"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'hidden lg:block sticky top-24 self-start rounded-2xl border border-white/8 bg-ink-soft p-6',
          className,
        )}
        aria-label="Filtros"
      >
        <h3 className="mb-6 text-xs font-black uppercase tracking-[0.24em] text-white/85">
          Filtros
        </h3>
        {body}
      </aside>

      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-soft px-4 py-2 text-xs font-semibold text-white/85 lg:hidden"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filtros
        {hasActive && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" />}
      </button>

      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSheetOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-xs flex-col border-r border-white/10 bg-ink-soft"
              role="dialog"
              aria-label="Filtros"
            >
              <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <h3 className="text-xs font-black uppercase tracking-[0.24em] text-white">
                  Filtros
                </h3>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="rounded-lg p-1.5 text-white/70 hover:text-white"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>
              <div className="flex-1 overflow-y-auto p-5">{body}</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[0.68rem] font-black uppercase tracking-[0.2em] text-white/60">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition',
        checked ? 'bg-primary/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition',
          checked ? 'border-primary bg-primary' : 'border-white/25',
        )}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
      </span>
      {label}
    </button>
  );
}
