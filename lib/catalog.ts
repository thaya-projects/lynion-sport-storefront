import { cache } from 'react';
import { getProductBySlug } from '@/lib/mocks/products';

// cache() deduplica la llamada entre generateMetadata y la página dentro del
// mismo request. Al pasar a la API real, solo cambia el cuerpo de esta función.
export const getProduct = cache(async (slug: string) => getProductBySlug(slug));
