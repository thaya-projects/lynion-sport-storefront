import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-sm text-white/65">
      <ol className="flex flex-wrap items-center gap-x-1.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            // En celular, el último paso (el nombre del producto) se oculta: ya
            // está en el título y ocupaba una línea entera.
            <li
              key={idx}
              className={isLast && items.length > 2 ? 'hidden items-center gap-1.5 sm:flex' : 'flex items-center gap-1.5'}
            >
              {item.href && !isLast ? (
                <Link href={item.href} className="inline-flex min-h-11 items-center transition hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'py-2 text-white/85' : 'py-2'}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className={
                    idx === items.length - 2 && items.length > 2
                      ? 'hidden h-3.5 w-3.5 text-white/40 sm:block'
                      : 'h-3.5 w-3.5 text-white/40'
                  }
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
