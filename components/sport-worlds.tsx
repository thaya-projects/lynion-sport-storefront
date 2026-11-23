'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { SectionHeader } from '@/components/section-header';
import { CATEGORIES } from '@/lib/categories';
import type { CatalogCategory } from '@/lib/catalog-types';

type WorldMeta = { image: string; tint: string };

const DEFAULT_TINT = 'radial-gradient(circle at 50% 55%, rgba(16,165,245,0.18), transparent 65%)';

const worldMeta: Record<string, WorldMeta> = {
  futbol: {
    image: '/products/soccer.webp',
    tint: 'radial-gradient(circle at 50% 55%, rgba(34,197,94,0.22), transparent 65%)',
  },
  futsal: {
    image: '/products/futsal.webp',
    tint: 'radial-gradient(circle at 50% 55%, rgba(16,165,245,0.22), transparent 65%)',
  },
  voley: {
    image: '/products/volleyball.webp',
    tint: 'radial-gradient(circle at 50% 55%, rgba(234,179,8,0.20), transparent 65%)',
  },
  basquet: {
    image: '/products/basketball.webp',
    tint: 'radial-gradient(circle at 50% 55%, rgba(249,115,22,0.22), transparent 65%)',
  },
};

// Las canchas salen de las categorías de Thaya: la foto que se sube allí reemplaza
// la ilustración por defecto, y una categoría nueva aparece sola. Sin API
// (categories null o vacío) se usan las cuatro de siempre.
// counts es null si la API no respondió: se muestran las canchas sin el número.
export function SportWorlds({
  categories,
  counts,
}: {
  categories: CatalogCategory[] | null;
  counts: Record<string, number> | null;
}) {
  const roots = categories?.filter((c) => c.isRoot !== false) ?? [];
  const worlds = roots.length > 0 ? roots : CATEGORIES.map((c) => ({ ...c, imageUrl: null }));

  return (
    <section aria-labelledby="worlds-title" className="mt-14">
      <SectionHeader
        id="worlds-title"
        title="Elige tu cancha."
        linkHref="/productos"
        linkLabel="Ver todo"
      />

      <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {worlds.map((cat, idx) => {
          const meta = worldMeta[cat.slug];
          const image = cat.imageUrl ?? meta?.image ?? null;
          return (
            <motion.div
              key={cat.slug}
              initial={{ y: 12 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/productos?category=${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/8 transition hover:border-primary/50 hover:shadow-[0_12px_32px_-12px_rgba(16,165,245,0.35)]"
                style={{ background: `${meta?.tint ?? DEFAULT_TINT}, linear-gradient(180deg, #15151e 0%, #0a0a12 100%)` }}
              >
                {image ? (
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain p-8 transition duration-500 ease-out group-hover:scale-110 md:p-12"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center pb-10 text-7xl font-extrabold text-white/15 transition duration-500 ease-out group-hover:scale-110"
                  >
                    {cat.name.charAt(0)}
                  </span>
                )}

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/55 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 md:p-4">
                  <div className="min-w-0">
                    <p className="truncate text-base font-extrabold leading-tight text-white md:text-lg">
                      {cat.name}
                    </p>
                    {counts && (
                      <p className="mt-0.5 text-xs font-medium text-white/70">
                        {formatCount(counts[cat.slug] ?? 0)}
                      </p>
                    )}
                  </div>
                  <span
                    aria-hidden
                    className="translate-x-1 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// Una cancha sin productos todavía no dice "0 productos": invita a consultar.
function formatCount(n: number) {
  if (n === 0) return 'Pronto';
  return n === 1 ? '1 producto' : `${n} productos`;
}
