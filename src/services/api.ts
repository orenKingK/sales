export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice: number;
    image: string;
    gender?: string;
    availableColors?: {
        colorCut: {
            url: string;
        };
    }[];
    productType?: string;
    discountPercentage?: string;
}

export interface Brand {
    id: string;
    name: string;
    logo: string;
    category: string;
    products: Product[];
}

const API_URL = import.meta.env.VITE_API_URL;

export const getBrands = async (): Promise<Brand[]> => {
    const response = await fetch(`${API_URL}/brands`);
    if (!response.ok) {
        throw new Error('Failed to fetch brands');
    }
    return response.json();
}

export const getBrandById = async (id: string): Promise<Brand> => {
    const response = await fetch(`${API_URL}/brands/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch brand');
    }
    return response.json();
}

export interface SaleFilterParams {
    page?: number;
    limit?: number;
    productType?: string;
    search?: string;
    sortBy?: string;
}

export interface PaginatedResult {
    items: Product[];
    total: number;
    facets: {
        productTypes: string[];
    };
}

// For specific endpoints like Zara sales if they differ from standard brand structure
export const getBrandSales = async (brandName: string, params: SaleFilterParams = {}): Promise<PaginatedResult> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.productType && params.productType !== 'all') query.append('productType', params.productType);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const response = await fetch(`${API_URL}/${brandName.toLowerCase()}/sales?${query.toString()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch sales for ${brandName}`);
    }
    return response.json();
}
