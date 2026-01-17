
import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { SaleItem, SalesProvider, SaleFilterParams, PaginatedResult } from '../common/interfaces/sales-provider.interface';

@Injectable()
export class ZaraService implements SalesProvider {
  private readonly logger = new Logger(ZaraService.name);
  private readonly DATA_FILE = 'zara2.json';

  async getSales(params: SaleFilterParams = {}): Promise<PaginatedResult> {
    try {
      this.logger.log(`Reading Zara sales from ${this.DATA_FILE}...`);
      
      const filePath = path.join(__dirname, this.DATA_FILE);
      let fileContent: string;
      try {
           fileContent = await fs.readFile(filePath, 'utf-8');
      } catch (e) {
           this.logger.warn(`File not found at ${filePath}, trying cwd...`);
           fileContent = await fs.readFile(path.join(process.cwd(), this.DATA_FILE), 'utf-8');
      }

      const rawData = JSON.parse(fileContent);

      // 1. Map to Domain Objects
      let items: SaleItem[] = rawData.map(item => {
          // Fix URL pattern
          if (item.availableColors) {
              item.availableColors.forEach(color => {
                  if (color.colorCut && color.colorCut.path && color.colorCut.name) {
                      const path = color.colorCut.path;
                      const name = color.colorCut.name;
                      const timestamp = color.colorCut.timestamp || Date.now();
                      const fixedUrl = `https://static.zara.net${path}/${name}.jpg?ts=${timestamp}&w={width}`;
                      color.colorCut.url = fixedUrl;
                  }
              });
          }

          let imageUrl = '';
          if (item.availableColors && item.availableColors.length > 0 && item.availableColors[0].colorCut?.url) {
              imageUrl = item.availableColors[0].colorCut.url.replace('{width}', '750');
          }

          const getProductType = (item: any): string => {
             const name = (item.name || '').toLowerCase();
             const family = (item.familyName || '').toUpperCase();
             if (name.includes('ג\'ינס') || name.includes('jeans')) return 'ג\'ינס';
             switch (family) {
                 case 'SHIRT': case 'OVERSHIRT': return 'חולצות מכופתרות';
                 case 'T-SHIRT': case 'POLO SHIRT': case 'SWEATER': case 'SWEATSHIRT': case 'CARDIGAN': case 'KNITTED WAISTCOAT': case 'WAISTCOAT': return 'חולצות';
                 case 'TROUSERS': case 'BERMUDA': return 'מכנסיים';
                 case 'BLAZER': case 'WIND-JACKET': case 'ANORAK': case '3/4 COAT': case 'TRENCH RAINCOAT': return 'ג\'קטים ומעילים';
                 case 'SHOES': case 'SPORT SHOES': case 'RUNNING SHOES': case 'MOCCASINS': case 'SANDAL': case 'ANKLE BOOT': return 'נעליים';
                 default: return 'אחר';
             }
          };

          const product: SaleItem = {
            id: item.id.toString(),
            name: item.name,
            description: item.description || item.name,
            price: item.oldPrice || 0,
            salePrice: item.price,
            image: imageUrl,
            link: `https://www.zara.com/il/he/${item.id}.html`,
            discountPercentage: item.discountPercentage,
            gender: 'Men',
            availableColors: item.availableColors,
            productType: getProductType(item),
            variants: item.variants // Load persistent variants
          };
          
          return product;
      });

      // 2. Filter
      if (params.search) {
          const searchLower = params.search.toLowerCase();
          items = items.filter(i => 
              i.name.toLowerCase().includes(searchLower) || 
              i.description.toLowerCase().includes(searchLower)
          );
      }

      // Calculate Facets (Categories) based on search results (before type filtering)
      const allCategories = new Set(items.map(i => i.productType).filter(Boolean));
      // Ensure 'all' is implicit, frontend handles it. We just return available types.
      const facets = {
          productTypes: Array.from(allCategories)
      };

      if (params.productType && params.productType !== 'all') {
          items = items.filter(i => i.productType === params.productType);
      }

      // 3. Sort
      if (params.sortBy) {
          switch (params.sortBy) {
              case 'price_asc':
                  items.sort((a, b) => a.salePrice - b.salePrice);
                  break;
              case 'price_desc':
                  items.sort((a, b) => b.salePrice - a.salePrice);
                  break;
              case 'discount':
                  items.sort((a, b) => {
                      const getDiscount = (p: SaleItem) => {
                          if (p.discountPercentage) {
                              return parseFloat(p.discountPercentage.replace(/[^0-9.]/g, '')) || 0;
                          }
                          return ((p.price - p.salePrice) / p.price) * 100;
                      };
                      return getDiscount(b) - getDiscount(a);
                  });
                  break;
          }
      }

      // 4. Paginate
      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 20;
      const total = items.length;
      const startIndex = (page - 1) * limit;
      const paginatedItems = items.slice(startIndex, startIndex + limit);

      return {
          items: paginatedItems,
          total,
          facets
      };

    } catch (error) {
      this.logger.error('Error reading Zara data file', error);
      return { items: [], total: 0, facets: { productTypes: [] } };
    }
  }
  async getCount(): Promise<number> {
      try {
          const filePath = path.join(__dirname, this.DATA_FILE);
          let fileContent: string;
          try {
              fileContent = await fs.readFile(filePath, 'utf-8');
          } catch (e) {
              fileContent = await fs.readFile(path.join(process.cwd(), this.DATA_FILE), 'utf-8');
          }
          const rawData = JSON.parse(fileContent);
          return rawData.length;
      } catch (error) {
          return 0;
      }
  }
}
