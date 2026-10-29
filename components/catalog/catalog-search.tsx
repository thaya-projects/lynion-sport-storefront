'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useTransition } from 'react';
import { Loader2, Search, X } from 'lucide-react';

export function CatalogSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(params.get('q') ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const urlQ = params.get('q') ?? '';
  // Último ?q que puso este buscador. Si la URL trae otro, el cambio vino de
  // fuera (chip «x», "Limpiar todo") y el campo lo sigue; si no, el efecto de
  // abajo volvería a poner el texto viejo. Los cambios propios se ignoran para
  // no pisar lo que la persona sigue escribiendo.
  const pushedQ = useRef(urlQ);

  useEffect(() => {
    if (urlQ === pushedQ.current) return;
    pushedQ.current = urlQ;
    setValue(urlQ);
  }, [urlQ]);

  // La lupa del header lleva a /productos#buscar: el buscador queda listo
  // para escribir.
  useEffect(() => {
    if (window.location.hash === '#buscar') inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (value.trim()) next.set('q', value.trim());
      else next.delete('q');
      const nextStr = next.toString();
      const currentQ = params.get('q') ?? '';
      if (currentQ === value.trim()) return;
      pushedQ.current = value.trim();
      startTransition(() => {
        router.replace(nextStr ? `${pathname}?${nextStr}` : pathname, { scroll: false });
      });
    }, 350);
    return () => clearTimeout(t);
  }, [value, params, pathname, router]);

  return (
    <div role="search" className="relative w-full sm:max-w-sm">
      <label htmlFor="buscar" className="sr-only">
        Buscar en el catálogo
      </label>
      {pending ? (
        <Loader2
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-white/60"
        />
      ) : (
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
        />
      )}
      <input
        ref={inputRef}
        id="buscar"
        type="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar pelotas, marcas…"
        className="min-h-11 w-full rounded-full border border-white/15 bg-ink-soft pl-10 pr-12 text-base text-white placeholder:text-white/55 focus:border-primary focus:outline-none md:text-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue('');
            inputRef.current?.focus();
          }}
          aria-label="Borrar búsqueda"
          className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
