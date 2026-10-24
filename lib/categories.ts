export type CategorySlug = 'futbol' | 'futsal' | 'voley' | 'basquet';

export type Category = {
  slug: CategorySlug;
  name: string;
};

export const CATEGORIES: readonly Category[] = [
  { slug: 'futbol', name: 'Fútbol' },
  { slug: 'futsal', name: 'Futsal' },
  { slug: 'voley', name: 'Vóley' },
  { slug: 'basquet', name: 'Básquet' },
] as const;

// Tono del fondo de las tarjetas de producto según el deporte.
const CATEGORY_HUES: Record<string, number> = {
  futbol: 145,
  futsal: 45,
  voley: 210,
  basquet: 20,
};

const DEFAULT_HUE = 210;

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoryHue(slug: string | null) {
  return (slug ? CATEGORY_HUES[slug] : undefined) ?? DEFAULT_HUE;
}

// El backend devuelve "Futbol", "Voley"... sin tildes: si la categoría es una
// de las conocidas se muestra con su nombre cuidado, si no, tal cual viene.
export function categoryDisplayName(slug: string, fallback: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? fallback;
}
