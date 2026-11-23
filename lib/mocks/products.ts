export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: 'Molten' | 'Spalding' | 'Mikasa' | 'Adidas' | 'Nike' | 'Wilson';
  category: 'futbol' | 'futsal' | 'voley' | 'basquet';
  price: number;
  originalPrice?: number;
  discountEndsAt?: string;
  imageHue: number;
  imageSrc: string;
  images?: string[];
  badge?: 'MAS_VENDIDO' | 'NUEVO' | 'OFERTA' | 'EN_STOCK';
  featured?: boolean;
  stock?: number;
  description: string;
  specs: Record<string, string>;
  tagline?: string;
};

const SOCCER_IMG = '/products/soccer.jpg';
const FUTSAL_IMG = '/products/futsal.jpg';
const VOLLEY_IMG = '/products/volleyball.jpg';
const BASKET_IMG = '/products/basketball.jpg';

export const products: Product[] = [
  // ─── Fútbol ─────────────────────────────────────────────
  {
    id: 'p-001',
    slug: 'pelota-futbol-mikasa-ft-550b',
    name: 'Pelota de Fútbol Mikasa FT-550B',
    brand: 'Mikasa',
    category: 'futbol',
    price: 272,
    imageHue: 145,
    imageSrc: SOCCER_IMG,
    images: [SOCCER_IMG, '/products/soccer.png'],
    featured: true,
    badge: 'MAS_VENDIDO',
    stock: 24,
    description:
      'Pelota oficial para fútbol campo. Cuero sintético resistente, cosido a máquina con 32 paneles tradicionales. Ideal para entrenamientos y partidos amateur.',
    specs: {
      Material: 'Cuero sintético PU',
      Tamaño: 'N° 5 oficial',
      Peso: '410 - 450g',
      Paneles: '32',
      Uso: 'Cancha de pasto',
    },
  },
  {
    id: 'p-002',
    slug: 'pelota-futbol-molten-f5v-2810',
    name: 'Pelota Fútbol Molten F5V-2810',
    brand: 'Molten',
    category: 'futbol',
    price: 310,
    imageHue: 145,
    imageSrc: SOCCER_IMG,
    stock: 15,
    description:
      'Diseño clásico Molten con doble capa de refuerzo. Mantiene su forma y presión por más tiempo.',
    specs: {
      Material: 'PU premium',
      Tamaño: 'N° 5',
      Peso: '420g',
      Paneles: '32',
      Uso: 'Cancha de pasto',
    },
  },
  {
    id: 'p-003',
    slug: 'pelota-futbol-nike-premier-league',
    name: 'Pelota Fútbol Nike Premier League',
    brand: 'Nike',
    category: 'futbol',
    price: 580,
    imageHue: 145,
    imageSrc: SOCCER_IMG,
    badge: 'NUEVO',
    stock: 3,
    description:
      'Réplica oficial de la Premier League 2026. Visibilidad alta en cancha con diseño cromático contrastante.',
    specs: {
      Material: 'Nike AerowSculpt',
      Tamaño: 'N° 5',
      Peso: '420g',
      Oficial: 'Liga Premier',
      Uso: 'Partidos oficiales',
    },
  },
  {
    id: 'p-004',
    slug: 'pelota-futbol-adidas-tango',
    name: 'Pelota Fútbol Adidas Tango',
    brand: 'Adidas',
    category: 'futbol',
    price: 450,
    imageHue: 145,
    imageSrc: SOCCER_IMG,
    badge: 'EN_STOCK',
    stock: 32,
    description:
      'El modelo icónico Tango reinterpretado. Buena absorción al pateo y tacto superior en control.',
    specs: {
      Material: 'TPU seamless',
      Tamaño: 'N° 5',
      Peso: '430g',
      Diseño: 'Tango clásico',
      Uso: 'Entrenamiento y partidos',
    },
  },

  // ─── Futsal ─────────────────────────────────────────────
  {
    id: 'p-005',
    slug: 'pelota-futsal-molten-f9a',
    name: 'Pelota Futsal Molten F9A',
    brand: 'Molten',
    category: 'futsal',
    price: 369,
    imageHue: 45,
    imageSrc: FUTSAL_IMG,
    images: [FUTSAL_IMG, '/products/futsal.png'],
    featured: true,
    badge: 'NUEVO',
    stock: 18,
    description:
      'Molten F9A, pelota oficial para futsal profesional. Bote bajo controlado para cancha dura.',
    specs: {
      Material: 'Cuero sintético',
      Tamaño: 'N° 4 futsal',
      Peso: '400 - 440g',
      Rebote: 'Reducido',
      Uso: 'Cancha dura / parquet',
    },
  },
  {
    id: 'p-006',
    slug: 'pelota-futsal-mikasa-fs-1500',
    name: 'Pelota Futsal Mikasa FS-1500',
    brand: 'Mikasa',
    category: 'futsal',
    price: 350,
    imageHue: 45,
    imageSrc: FUTSAL_IMG,
    badge: 'MAS_VENDIDO',
    stock: 12,
    description:
      'La preferida de las ligas locales de futsal. Durable y con bote predecible.',
    specs: {
      Material: 'PVC premium',
      Tamaño: 'N° 4',
      Peso: '420g',
      Rebote: 'Reducido',
      Uso: 'Cancha dura',
    },
  },
  {
    id: 'p-007',
    slug: 'pelota-futsal-molten-f9v-3400',
    name: 'Pelota Futsal Molten F9V-3400',
    brand: 'Molten',
    category: 'futsal',
    price: 290,
    imageHue: 45,
    imageSrc: FUTSAL_IMG,
    stock: 20,
    description:
      'Pelota de futsal con tacto suave y rebote controlado. Costura reforzada y acabado antideslizante para canchas duras.',
    specs: {
      Material: 'Microfibra',
      Tamaño: 'N° 4',
      Peso: '430g',
      Paneles: '32',
      Uso: 'Cancha dura',
    },
  },
  {
    id: 'p-008',
    slug: 'pelota-futsal-nike-rolinho',
    name: 'Pelota Futsal Nike Rolinho',
    brand: 'Nike',
    category: 'futsal',
    price: 410,
    imageHue: 45,
    imageSrc: FUTSAL_IMG,
    stock: 6,
    description:
      'Diseño compacto para precisión y toques cortos. Mejor control en espacios reducidos.',
    specs: {
      Material: 'Nike AerowTrac',
      Tamaño: 'N° 4',
      Peso: '415g',
      Rebote: 'Bajo',
      Uso: 'Futsal profesional',
    },
  },

  // ─── Vóley ──────────────────────────────────────────────
  {
    id: 'p-009',
    slug: 'pelota-voley-mikasa-mva200',
    name: 'Pelota Vóley Mikasa MVA200',
    brand: 'Mikasa',
    category: 'voley',
    price: 486,
    originalPrice: 649,
    discountEndsAt: '2026-11-15T23:59:00-04:00',
    imageHue: 210,
    imageSrc: VOLLEY_IMG,
    images: [VOLLEY_IMG, '/products/volleyball.png'],
    featured: true,
    badge: 'OFERTA',
    stock: 9,
    description:
      'Mikasa MVA200 — la pelota oficial de la FIVB. Micro-rugosidad en la superficie para mejor agarre al servicio.',
    specs: {
      Material: 'Microfibra',
      Tamaño: 'N° 5',
      Peso: '260 - 280g',
      Oficial: 'FIVB',
      Uso: 'Vóley indoor profesional',
    },
  },
  {
    id: 'p-010',
    slug: 'pelota-voley-molten-v5m5000',
    name: 'Pelota Vóley Molten V5M5000',
    brand: 'Molten',
    category: 'voley',
    price: 390,
    imageHue: 210,
    imageSrc: VOLLEY_IMG,
    badge: 'EN_STOCK',
    stock: 22,
    description:
      'Diseño de 18 paneles para visibilidad alta. Durable para entrenamientos intensos.',
    specs: {
      Material: 'Cuero sintético',
      Tamaño: 'N° 5',
      Peso: '270g',
      Paneles: '18',
      Uso: 'Entrenamiento y liga',
    },
  },
  {
    id: 'p-011',
    slug: 'pelota-voley-wilson-avp',
    name: 'Pelota Vóley Wilson AVP',
    brand: 'Wilson',
    category: 'voley',
    price: 320,
    imageHue: 210,
    imageSrc: VOLLEY_IMG,
    stock: 0,
    description:
      'Oficial de la AVP (Association of Volleyball Professionals). Pensada también para vóley playa.',
    specs: {
      Material: 'Composite',
      Tamaño: 'N° 5',
      Peso: '280g',
      Oficial: 'AVP',
      Uso: 'Indoor y playa',
    },
  },
  {
    id: 'p-012',
    slug: 'pelota-voley-nike-hyperspike',
    name: 'Pelota Vóley Nike Hyperspike',
    brand: 'Nike',
    category: 'voley',
    price: 420,
    imageHue: 210,
    imageSrc: VOLLEY_IMG,
    badge: 'NUEVO',
    stock: 7,
    description:
      'Nueva línea Nike con tecnología Hyperspike para potencia de remate. Diseño llamativo.',
    specs: {
      Material: 'PU premium',
      Tamaño: 'N° 5',
      Peso: '270g',
      Tecnología: 'Hyperspike',
      Uso: 'Vóley competitivo',
    },
  },

  // ─── Básquet ────────────────────────────────────────────
  {
    id: 'p-013',
    slug: 'basquet-spalding-tf-950',
    name: 'Básquet Spalding TF-950',
    brand: 'Spalding',
    category: 'basquet',
    price: 475,
    originalPrice: 669,
    discountEndsAt: '2026-11-30T23:59:00-04:00',
    imageHue: 20,
    imageSrc: BASKET_IMG,
    images: [BASKET_IMG, '/products/basketball.png'],
    featured: true,
    badge: 'EN_STOCK',
    stock: 18,
    description:
      'Spalding TF-950 — línea Trueflight con cuero sintético premium. Buen tacto y durabilidad.',
    specs: {
      Material: 'Cuero sintético Trueflight',
      Tamaño: 'N° 7 oficial',
      Peso: '600g',
      Uso: 'Cancha indoor / outdoor',
    },
  },
  {
    id: 'p-014',
    slug: 'basketball-molten-gg7x',
    name: 'Pelota de Básquet Molten GG7X',
    brand: 'Molten',
    category: 'basquet',
    price: 580,
    imageHue: 20,
    imageSrc: BASKET_IMG,
    badge: 'MAS_VENDIDO',
    stock: 11,
    description:
      'Molten GG7X — pelota oficial FIBA. Diseño clásico de 12 paneles con alto rendimiento.',
    specs: {
      Material: 'Cuero compuesto',
      Tamaño: 'N° 7',
      Peso: '620g',
      Oficial: 'FIBA',
      Uso: 'Competición indoor',
    },
  },
  {
    id: 'p-015',
    slug: 'basketball-wilson-evolution',
    name: 'Pelota de Básquet Wilson Evolution',
    brand: 'Wilson',
    category: 'basquet',
    price: 390,
    imageHue: 20,
    imageSrc: BASKET_IMG,
    stock: 25,
    description:
      'La icónica Wilson Evolution. Favorita de ligas universitarias NCAA por su tacto único.',
    specs: {
      Material: 'Cuero composite',
      Tamaño: 'N° 7',
      Peso: '600g',
      Oficial: 'NCAA',
      Uso: 'Indoor only',
    },
  },
  {
    id: 'p-016',
    slug: 'basketball-spalding-nba-replica',
    name: 'Pelota de Básquet Spalding NBA Réplica',
    brand: 'Spalding',
    category: 'basquet',
    price: 520,
    imageHue: 20,
    imageSrc: BASKET_IMG,
    badge: 'NUEVO',
    stock: 13,
    description:
      'Réplica oficial del balón NBA. Mismo diseño y texturas que el que usan los profesionales.',
    specs: {
      Material: 'Cuero sintético NBA',
      Tamaño: 'N° 7',
      Peso: '620g',
      Oficial: 'NBA réplica',
      Uso: 'Indoor y outdoor',
    },
  },
];

export const BRANDS = ['Molten', 'Spalding', 'Mikasa', 'Adidas', 'Nike', 'Wilson'] as const;

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Product['category']) {
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

type Filters = {
  category?: Product['category'];
  brand?: Product['brand'];
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  q?: string;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
};

export function filterProducts(filters: Filters = {}) {
  let result = products.slice();

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.brand) {
    result = result.filter((p) => p.brand === filters.brand);
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.onSale) {
    result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    );
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result.sort((a, b) => (a.badge === 'NUEVO' ? -1 : 0) - (b.badge === 'NUEVO' ? -1 : 0));
      break;
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return result;
}
