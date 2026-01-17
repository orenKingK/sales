
import * as fs from 'fs';
import * as path from 'path';

// Define interfaces locally to avoid import issues in standalone script
interface StoreAvailability {
  storeName: string;
  city: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface SizeVariant {
  size: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stores: StoreAvailability[];
}

const STORES = [
    { name: 'קניון רמת אביב', city: 'תל אביב' },
    { name: 'דיזנגוף סנטר', city: 'תל אביב' },
    { name: 'קניון עזריאלי', city: 'תל אביב' },
    { name: 'קניון איילון', city: 'רמת גן' },
    { name: 'קניון הזהב', city: 'ראשון לציון' },
    { name: 'קניון עזריאלי ירושלים (מלחה)', city: 'ירושלים' },
    { name: 'גרנד קניון', city: 'חיפה' },
    { name: 'ביג פאשן', city: 'אשדוד' },
    { name: 'מול הים', city: 'אילת' }
];

const DATA_FILE_PATH = path.join(__dirname, 'src/zara/zara2.json');

async function enrichData() {
    console.log(`Reading data from ${DATA_FILE_PATH}...`);
    
    try {
        const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        const items = JSON.parse(rawData);
        console.log(`Found ${items.length} items. Enriching...`);

        const enrichedItems = items.map((item: any) => {
            const sizes = ['S', 'M', 'L', 'XL'];
            
            // Generate variants
            const variants: SizeVariant[] = sizes.map(size => {
                // Random stock status for size
                const sizeStock = Math.random() > 0.2 ? 'In Stock' : (Math.random() > 0.5 ? 'Low Stock' : 'Out of Stock');
                
                // Random stores
                const stores = STORES.map(store => ({
                    storeName: store.name,
                    city: store.city,
                    status: (Math.random() > 0.3 ? 'In Stock' : (Math.random() > 0.5 ? 'Low Stock' : 'Out of Stock')) as any
                })).filter(s => s.status !== 'Out of Stock');

                return {
                    size,
                    stockStatus: sizeStock,
                    stores
                };
            });

            return {
                ...item,
                variants // Attach the new data
            };
        });

        console.log('Writing back to file...');
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(enrichedItems, null, 2));
        console.log('Done!');

    } catch (error) {
        console.error('Error enriching data:', error);
    }
}

enrichData();
