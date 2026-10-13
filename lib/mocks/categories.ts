export type Category = {
  slug: string;
  name: string;
  gradient: string;
  tagline: string;
};

export const categories: Category[] = [
  {
    slug: 'futbol',
    name: 'Fútbol',
    gradient: 'from-emerald-500/40 via-emerald-700/20 to-transparent',
    tagline: 'Cancha grande',
  },
  {
    slug: 'futsal',
    name: 'Futsal',
    gradient: 'from-amber-400/40 via-orange-600/20 to-transparent',
    tagline: 'Cancha rápida',
  },
  {
    slug: 'voley',
    name: 'Vóley',
    gradient: 'from-fuchsia-500/40 via-pink-600/20 to-transparent',
    tagline: 'Sobre la red',
  },
  {
    slug: 'basquet',
    name: 'Básquet',
    gradient: 'from-orange-500/40 via-red-600/20 to-transparent',
    tagline: 'Sobre el aro',
  },
];
