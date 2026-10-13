import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-white/50">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-white/80' : ''}>{item.label}</span>
              )}
              {!isLast && <ChevronRight className="h-3 w-3 text-white/30" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
