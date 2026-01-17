
const https = require('https');

const SKU_S = '452706207';
const SKU_M = '452706209'; // Medium - EXPECTED TO HAVE STORES
const SKU_XXL = '452706212';
const LAT = 32.0853;
const LNG = 34.7818;

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json'
};

function getStores(sku, name) {
    return new Promise(resolve => {
        const url = `https://www.zara.com/il/he/stores-locator/search-stock?lat=${LAT}&lng=${LNG}&productIds=${sku}`;
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        const count = json.stores ? json.stores.length : 0;
                        console.log(`${name} (SKU ${sku}): Found ${count} stores.`);
                        resolve(count);
                    } catch (e) { 
                        console.log(`${name}: Error parsing JSON`);
                        resolve(0); 
                    }
                } else {
                    console.log(`${name}: HTTP ${res.statusCode}`);
                    resolve(0);
                }
            });
        });
    });
}

async function run() {
    console.log('--- START COMPARISON ---');
    const cS = await getStores(SKU_S, 'Small');
    const cM = await getStores(SKU_M, 'Medium');
    const cXXL = await getStores(SKU_XXL, 'XXL');
    console.log('--- END COMPARISON ---');
    
    if (cS !== cM || cM !== cXXL) {
        console.log('CONFIRMED: Different stock levels for different sizes!');
    } else {
        console.log('UNCERTAIN: All sizes returned same count (or 0).');
    }
}

run();
