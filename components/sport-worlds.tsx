'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { CATEGORIES } from '@/lib/categories';

type WorldMeta = { count: number; image: string; tint: string };

const worldMeta: Record<string, WorldMeta> = {
  futbol: {
    count: 128,
    image: '/products/soccer.png',
    tint: 'radial-gradient(circle at 50% 55%, rgba(34,197,94,0.22), transparent 65%)',
  },
  futsal: {
    count: 74,
    image: '/products/futsal.png',
    tint: 'radial-gradient(circle at 50% 55%, rgba(16,165,245,0.22), transparent 65%)',
  },
  voley: {
    count: 62,
    image: '/products/volleyball.png',
    tint: 'radial-gradient(circle at 50% 55%, rgba(234,179,8,0.20), transparent 65%)',
  },
  basquet: {
    count: 91,
    image: '/products/basketball.png',
    tint: 'radial-gradient(circle at 50% 55%, rgba(249,115,22,0.22), transparent 65%)',
  },
};

export function SportWorlds() {
  return (
    <section aria-labelledby="worlds-title" className="mt-14">
      <SectionHeader
        id="worlds-title"
        title="Elegí tu cancha."
        linkHref="/productos"
        linkLabel="Ver todo"
      />

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
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
                href={`/categorias/${cat.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-ink-soft transition hover:border-primary/40"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden"
                  style={{ background: `${meta.tint}, linear-gradient(180deg, #14141c 0%, #0a0a12 100%)` }}
                >
                  <Image
                    src={meta.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-6 transition duration-500 group-hover:scale-110 group-hover:rotate-3 md:p-10"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">{cat.name}</p>
                    <p className="text-[0.68rem] text-white/45">{meta.count} productos</p>
                  </div>
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition group-hover:border-primary group-hover:bg-primary group-hover:text-ink"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
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
