
export interface StoreAvailability {
  storeName: string;
  city: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface SizeVariant {
  size: string; // S, M, L, XL
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stores: StoreAvailability[];
}

export interface SaleItem {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number;
  image: string;
  link: string;
  discountPercentage: string;
  availableColors?: any[];
  productType?: string;
  variants?: SizeVariant[];
  gender?: string;
}

export interface SaleFilterParams {
  page?: number;
  limit?: number;
  productType?: string;
  search?: string;
  sortBy?: string;
}

export interface PaginatedResult {
  items: SaleItem[];
  total: number;
  facets: {
    productTypes: string[];
  };
}

export interface SalesProvider {
  getSales(params?: SaleFilterParams): Promise<PaginatedResult>;
}
