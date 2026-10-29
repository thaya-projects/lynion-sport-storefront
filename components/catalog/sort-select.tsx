'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { ChevronDown } from 'lucide-react';

const options = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'newest', label: 'Nuevos primero' },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const current = params.get('sort') ?? 'featured';

  function change(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params);
    if (e.target.value === 'featured') next.delete('sort');
    else next.set('sort', e.target.value);
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        aria-label="Ordenar productos"
        value={current}
        onChange={change}
        className="min-h-11 appearance-none rounded-full border border-white/15 bg-ink-soft pl-4 pr-10 text-sm font-semibold text-white/90 transition hover:border-white/30 focus:border-primary focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink text-white">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3.5 h-4 w-4 text-white/60"
      />
    </div>
  );
}
