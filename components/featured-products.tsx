'use client';

import { motion } from 'motion/react';
import { getFeaturedProducts } from '@/lib/mocks/products';
import { ProductCard } from '@/components/product-card';
import { SectionHeader } from '@/components/section-header';

export function FeaturedProducts() {
  const items = getFeaturedProducts();

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
        className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </motion.div>
    </section>
  );
}
