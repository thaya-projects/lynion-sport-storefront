'use client';

import { motion } from 'motion/react';
import { ProductCard } from '@/components/product-card';
import { SectionHeader } from '@/components/section-header';
import type { CatalogProduct } from '@/lib/catalog-types';

type Props = {
  items: CatalogProduct[];
  // Por defecto, "Los más vendidos"; la portada reusa la fila para las ofertas.
  id?: string;
  title?: string;
  linkHref?: string;
  linkLabel?: string;
};

export function FeaturedProducts({
  items,
  id = 'mas-vendidos',
  title = 'Los más vendidos.',
  linkHref = '/productos',
  linkLabel = 'Ver catálogo',
}: Props) {
  if (items.length === 0) return null;

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-14">
      <SectionHeader id={`${id}-title`} title={title} linkHref={linkHref} linkLabel={linkLabel} />

      <motion.div
        initial={{ y: 12 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </motion.div>
    </section>
  );
}
