'use client';

import { motion } from 'motion/react';
import { ProductCard } from '@/components/product-card';
import { SectionHeader } from '@/components/section-header';
import type { CatalogProduct } from '@/lib/catalog-types';

export function FeaturedProducts({ items }: { items: CatalogProduct[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="featured-title" className="mt-14">
      <SectionHeader
        id="featured-title"
        title="Los que más salen."
        linkHref="/productos"
        linkLabel="Ver catálogo"
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </motion.div>
    </section>
  );
}
