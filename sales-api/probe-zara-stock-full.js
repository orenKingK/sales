
const productId = 452708281; 
const lat = 32.0853;
const lng = 34.7818;
const fs = require('fs');

async function probe() {
    const url = `https://www.zara.com/il/he/stores-locator/search-stock?lat=${lat}&lng=${lng}&productIds=${productId}`;
    console.log(`Probing ${url}...`);
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });
        if (res.ok) {
            const data = await res.json();
            fs.writeFileSync('zara_store_stock_sample.json', JSON.stringify(data, null, 2));
            console.log('Saved to zara_store_stock_sample.json');
        } else {
            console.log('Failed', res.status);
        }
    } catch (e) {
        console.log('Error:', e.message);
    }
}

probe();
