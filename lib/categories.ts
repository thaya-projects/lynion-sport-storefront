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
