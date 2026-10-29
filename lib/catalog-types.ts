// Forma común del catálogo, venga de los mocks o de la API pública del
// backend. Los campos opcionales son los que la API todavía no devuelve: la UI
// solo los muestra cuando existen.
export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  originalPrice?: number;
  // imageSrc es la foto principal (images[0]); images, la galería completa.
  imageSrc: string | null;
  images: string[];
  category: string | null;
  categoryName: string | null;
  imageHue: number;
  brand?: string;
  badge?: 'MAS_VENDIDO' | 'NUEVO' | 'OFERTA' | 'EN_STOCK';
  featured?: boolean;
  stock?: number;
  // Fin de la oferta vigente (ISO), si Thaya le puso fecha de fin.
  discountEndsAt?: string;
  createdAt?: string;
  description?: string;
  specs?: Record<string, string>;
  sku?: string;
  updatedAt?: string;
};

// Datos de la tienda que se cargan en Thaya (Empresa). Sin API, solo lo que
// el sitio ya conoce.
export type StoreInfo = {
  name: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  address: string | null;
  productCount: number | null;
  categoryCount: number | null;
};

export type CatalogCategory = {
  slug: string;
  name: string;
};

export type CatalogSort = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export type CatalogFilters = {
  category?: string;
  brand?: string;
  onSale?: boolean;
  q?: string;
  sort?: CatalogSort;
};
