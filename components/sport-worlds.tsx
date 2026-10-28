'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { SectionHeader } from '@/components/section-header';
import { CATEGORIES } from '@/lib/categories';

type WorldMeta = { image: string; tint: string };

const worldMeta: Record<string, WorldMeta> = {
  futbol: {
    image: '/products/soccer.png',
    tint: 'radial-gradient(circle at 50% 55%, rgba(34,197,94,0.22), transparent 65%)',
  },
  futsal: {
    image: '/products/futsal.png',
    tint: 'radial-gradient(circle at 50% 55%, rgba(16,165,245,0.22), transparent 65%)',
  },
  voley: {
    image: '/products/volleyball.png',
    tint: 'radial-gradient(circle at 50% 55%, rgba(234,179,8,0.20), transparent 65%)',
  },
  basquet: {
    image: '/products/basketball.png',
    tint: 'radial-gradient(circle at 50% 55%, rgba(249,115,22,0.22), transparent 65%)',
  },
};

export function SportWorlds({ counts }: { counts: Record<string, number> }) {
  return (
    <section aria-labelledby="worlds-title" className="mt-14">
      <SectionHeader
        id="worlds-title"
        title="Elegí tu cancha."
        linkHref="/productos"
        linkLabel="Ver todo"
      />

      <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {CATEGORIES.map((cat, idx) => {
          const meta = worldMeta[cat.slug];
          return (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: idx * 0.06, ease: 'easeOut' }}
            >
              <Link
                href={`/productos?category=${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/8 transition hover:border-primary/50 hover:shadow-[0_12px_32px_-12px_rgba(16,165,245,0.35)]"
                style={{ background: `${meta.tint}, linear-gradient(180deg, #15151e 0%, #0a0a12 100%)` }}
              >
                <Image
                  src={meta.image}
                  alt={`Pelota de ${cat.name.toLowerCase()}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-8 transition duration-500 ease-out group-hover:scale-110 md:p-12"
                />

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/55 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 md:p-4">
                  <div className="min-w-0">
                    <p className="truncate text-base font-extrabold leading-tight text-white md:text-lg">
                      {cat.name}
                    </p>
                    <p className="mt-0.5 text-[0.68rem] font-medium text-white/60 md:text-xs">
                      {formatCount(counts[cat.slug] ?? 0)}
                    </p>
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

function formatCount(n: number) {
  return n === 1 ? '1 producto' : `${n} productos`;
}
