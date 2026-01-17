
const https = require('https');

const SKU_S = '452706207'; // Small
const SKU_XXL = '452706212'; // XXL
const LAT = 32.0853;
const LNG = 34.7818;

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json'
};

function getStores(sku) {
    return new Promise(resolve => {
        const url = `https://www.zara.com/il/he/stores-locator/search-stock?lat=${LAT}&lng=${LNG}&productIds=${sku}`;
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        const storeIds = json.stores ? json.stores.map(s => s.id).sort() : [];
                        resolve(storeIds);
                    } catch (e) { resolve([]); }
                } else {
                    resolve([]);
                }
            });
        });
    });
}

async function run() {
    console.log('Fetching S...');
    const storesS = await getStores(SKU_S);
    console.log(`S Stores (${storesS.length}):`, storesS);

    console.log('Fetching XXL...');
    const storesXXL = await getStores(SKU_XXL);
    console.log(`XXL Stores (${storesXXL.length}):`, storesXXL);

    if (JSON.stringify(storesS) === JSON.stringify(storesXXL)) {
        console.log('RESULT: SAME. The API likely ignores the specific SKU and returns style availability.');
    } else {
        console.log('RESULT: DIFFERENT! The API provides size-specific stock.');
    }
}

run();
