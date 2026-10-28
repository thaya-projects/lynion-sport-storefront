// Forma común del catálogo, venga de los mocks o de la API pública del
// backend. Los campos opcionales son los que la API todavía no devuelve: la UI
// solo los muestra cuando existen.
export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  originalPrice?: number;
  imageSrc: string | null;
  category: string | null;
  categoryName: string | null;
  imageHue: number;
  brand?: string;
  badge?: 'MAS_VENDIDO' | 'NUEVO' | 'OFERTA' | 'EN_STOCK';
  featured?: boolean;
  stock?: number;
  description?: string;
  specs?: Record<string, string>;
  sku?: string;
  updatedAt?: string;
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
