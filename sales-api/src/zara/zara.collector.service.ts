import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

// Target Interface matching zara.json
export interface ZaraProduct {
    id: number;
    name: string;
    price: number; // Sale price
    oldPrice: number; // Original price
    availableColors: any[];
    kind: string;
    availability: string;
    discountPercentage: string;
    familyName: string;
    description?: string;
    variants?: any[];
    gender?: string;
    productType?: string;
}

@Injectable()
export class ZaraCollectorService {
    private readonly logger = new Logger(ZaraCollectorService.name);
    private readonly ZARA_API_URL = 'https://www.zara.com/il/he/category/2584161/products?ajax=true';
    private readonly OUTPUT_FILE = path.join(__dirname, 'zara2.json');

    async collectAndSave(): Promise<ZaraProduct[]> {
        this.logger.log('Starting Zara data collection (Deep Scan Mode)...');
        
        try {
            // 1. Fetch Category List
            const response = await fetch(this.ZARA_API_URL, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Failed to fetch list: ${response.statusText}`);

            const data = await response.json();
            let basicProducts = this.processResponse(data);
            
            // Limit removed to fetch ALL items
            // basicProducts = basicProducts.slice(0, 40);
            this.logger.log(`Found ${basicProducts.length} items. Fetching deep details and store stock...`);

            // 2. Fetch Details & Stores for each product
            const detailedProducts: ZaraProduct[] = [];
            for (const product of basicProducts) {
                try {
                    // Parallel fetch for speed
                    const [details, stores] = await Promise.all([
                        this.fetchProductDetails(product.id),
                        this.fetchStoreStock(product.id)
                    ]);

                    if (details) {
                        const enriched = await this.mergeDetails(product, details, stores);
                        detailedProducts.push(enriched);
                        // Be nice to the API
                        await new Promise(r => setTimeout(r, 200)); 
                    } else {
                        detailedProducts.push(product); // Fallback
                    }
                } catch (e) {
                    this.logger.error(`Failed to enrich product ${product.id}`, e);
                    detailedProducts.push(product);
                }
            }

            if (detailedProducts.length > 0) {
                 await fs.writeFile(this.OUTPUT_FILE, JSON.stringify(detailedProducts, null, 2));
                 this.logger.log(`Successfully saved ${detailedProducts.length} deep-scanned products.`);
            }
            
            return detailedProducts;
        } catch (error) {
            this.logger.error('Error collecting Zara data', error);
            throw error;
        }
    }

    private async fetchProductDetails(id: number): Promise<any> {
        try {
            const url = `https://www.zara.com/il/he/products-details?productIds=${id}&ajax=true`;
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                }
            });
            return res.ok ? (await res.json())?.[0] : null;
        } catch (e) {
            return null;
        }
    }

    private async fetchStoreStock(id: string | number): Promise<any[]> {
        try {
            // TLV Coordinates center
            const lat = 32.0853; 
            const lng = 34.7818;
            const url = `https://www.zara.com/il/he/stores-locator/search-stock?lat=${lat}&lng=${lng}&productIds=${id}`;
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                }
            });
            // Result is array of stores
            return res.ok ? await res.json() : [];
        } catch (e) {
            return [];
        }
    }

    private async mergeDetails(basic: ZaraProduct, detailData: any, styleLevelStores: any[]): Promise<ZaraProduct> {
        const mainColor = detailData.detail?.colors?.find((c: any) => c.productId === basic.id) || detailData.detail?.colors?.[0];
        
        if (!mainColor || !mainColor.sizes) {
            return basic;
        }

        // TARGET PRODUCT SPECIFIC CRAWLING
        const TARGET_ID = 452708227;
        const isTarget = basic.id === TARGET_ID;
        
        if (isTarget) {
            this.logger.log(`Performing granular size crawl for Target Product: ${basic.id}`);
        }

        const variants = [];
        for (const s of mainColor.sizes) {
             const stockStatus = s.availability === 'in_stock' ? 'In Stock' : 
                               (s.availability === 'low_on_stock' ? 'Low Stock' : 'Out of Stock');
            
             let storesForSize = [];

             if (isTarget && s.sku) {
                 // Granular fetch for this size
                 // Delay to prevent blocking
                 await new Promise(r => setTimeout(r, 500));
                 const realSizeStock = await this.fetchStoreStock(s.sku);
                 
                 storesForSize = realSizeStock.map((st: any) => ({
                    storeName: st.name,
                    city: st.city,
                    status: 'In Stock'
                 }));
                 this.logger.log(`> Size ${s.name} (SKU ${s.sku}): Found ${storesForSize.length} stores.`);
             } else {
                 // Fallback to style-level stores
                 storesForSize = styleLevelStores.map((st: any) => ({
                    storeName: st.name,
                    city: st.city,
                    status: 'In Stock'
                 }));
             }

             variants.push({
                size: s.name,
                stockStatus: stockStatus,
                stores: storesForSize
             });
        }

        return {
            ...basic,
            variants
        };
    }

    private processResponse(data: any): ZaraProduct[] {
        const products: ZaraProduct[] = [];
        
        if (!data || !data.productGroups) {
             this.logger.warn('Invalid data structure received from Zara API');
             return [];
        }

        data.productGroups.forEach((group: any) => {
            if (!group.elements) return;
            
            group.elements.forEach((element: any) => {
                if (element.commercialComponents) {
                    element.commercialComponents.forEach((comp: any) => {
                         if (comp.type === 'Product') {
                             try {
                                products.push(this.mapToProduct(comp));
                             } catch (err) {
                                 this.logger.warn(`Failed to map product ${comp.id}: ${err.message}`);
                             }
                         }
                    });
                }
            });
        });

        // Filter out items without price to ensure quality data
        return products.filter(p => p.price > 0);
    }

    private mapToProduct(comp: any): ZaraProduct {
        // Price handling (Zara sends in cents)
        const salePrice = comp.price / 100;
        const oldPrice = comp.oldPrice ? comp.oldPrice / 100 : salePrice;
        
        // Discount calculation
        let discountPercentage = '';
        if (oldPrice > salePrice) {
            discountPercentage = Math.round(((oldPrice - salePrice) / oldPrice) * 100) + '%';
        }

        // Available Colors Construction
        const availableColors = (comp.detail?.colors || []).map((color: any) => {
            const media = color.xmedia?.[0];
            let colorCut = null;
            
            if (media) {
                 colorCut = {
                     datatype: "xmedia",
                     set: media.set,
                     type: media.type,
                     kind: "colorcut",
                     path: media.path,
                     name: media.name,
                     width: media.width,
                     height: media.height,
                     timestamp: media.timestamp,
                     allowedScreens: media.allowedScreens,
                     url: `https://static.zara.net${media.path}.jpg?ts=${media.timestamp}&w={width}`
                 };
            }

            return {
                colorName: color.name,
                hexColor: color.hexCode,
                colorCut: colorCut
            };
        });
        
        // Product Type Classification (Simple logic)
        const getProductType = (name: string, family: string): string => {
             const n = (name || '').toLowerCase();
             const f = (family || '').toUpperCase();
             if (n.includes('ג\'ינס') || n.includes('jeans')) return 'ג\'ינס';
             switch (f) {
                 case 'SHIRT': case 'OVERSHIRT': return 'חולצות מכופתרות';
                 case 'T-SHIRT': case 'POLO SHIRT': case 'SWEATER': case 'SWEATSHIRT': return 'חולצות';
                 case 'TROUSERS': case 'BERMUDA': return 'מכנסיים';
                 case 'BLAZER': case 'WIND-JACKET': case 'ANORAK': return 'ג\'קטים ומעילים';
                 case 'SHOES': case 'SPORT SHOES': return 'נעליים';
                 default: return 'אחר';
             }
        };

        const product: ZaraProduct = {
            id: comp.id,
            name: comp.name,
            price: salePrice,
            oldPrice: oldPrice,
            availableColors: availableColors,
            kind: 'Wear',
            availability: comp.availability === 'in_stock' ? 'in_stock' : 'out_of_stock',
            discountPercentage: discountPercentage,
            familyName: comp.familyName || 'Unknown',
            description: comp.description || comp.name,
            productType: getProductType(comp.name, comp.familyName),
            variants: [],
            gender: 'Men' // Assuming Men's category for now based on URL
        };
        
        return product;
    }
}
