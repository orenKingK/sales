
const https = require('https');

const SKU = '452706209'; // Medium Khaki
const LAT = 32.0853;
const LNG = 34.7818;

const endpoints = [
    { name: 'Standard ProductId', url: `https://www.zara.com/il/he/stores-locator/search-stock?lat=${LAT}&lng=${LNG}&productIds=${SKU}` },
    { name: 'Reference', url: `https://www.zara.com/il/he/stores-locator/search-stock?lat=${LAT}&lng=${LNG}&references=${SKU}` },
    { name: 'PartNumber', url: `https://www.zara.com/il/he/stores-locator/search-stock?lat=${LAT}&lng=${LNG}&partNumbers=${SKU}` },
    { name: 'SKU', url: `https://www.zara.com/il/he/stores-locator/search-stock?lat=${LAT}&lng=${LNG}&skus=${SKU}` },
    // Try the "Product Page" approach - checking if there's a different API call usually made
    { name: 'Stock Availability (Legacy)', url: `https://www.zara.com/il/he/stock-availability?skuId=${SKU}&lat=${LAT}&lng=${LNG}` }
];

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Referer': 'https://www.zara.com/'
};

function checkEndpoint(endpoint) {
    return new Promise(resolve => {
        https.get(endpoint.url, { headers }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`[${endpoint.name}] Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        console.log(`[${endpoint.name}] Response:`, JSON.stringify(json).substring(0, 200) + '...');
                        if (json.stores && json.stores.length > 0) {
                            console.log(`[${endpoint.name}] SUCCESS! Found ${json.stores.length} stores.`);
                        }
                    } catch (e) {
                         console.log(`[${endpoint.name}] Response (Not JSON):`, data.substring(0, 100));
                    }
                }
                resolve();
            });
        }).on('error', err => {
            console.log(`[${endpoint.name}] Error: ${err.message}`);
            resolve();
        });
    });
}

async function run() {
    for (const ep of endpoints) {
        await checkEndpoint(ep);
    }
}

run();
