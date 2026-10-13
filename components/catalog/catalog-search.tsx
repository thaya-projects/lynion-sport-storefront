'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { Search, X } from 'lucide-react';

export function CatalogSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(params.get('q') ?? '');

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (value.trim()) next.set('q', value.trim());
      else next.delete('q');
      const nextStr = next.toString();
      const currentQ = params.get('q') ?? '';
      if (currentQ === value.trim()) return;
      startTransition(() => {
        router.replace(`${pathname}?${nextStr}`, { scroll: false });
      });
    }, 350);
    return () => clearTimeout(t);
  }, [value, params, pathname, router]);

  return (
    <div className="relative w-full max-w-sm">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar pelotas, marcas..."
        className="w-full rounded-full border border-white/15 bg-ink-soft py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/35 focus:border-primary focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
