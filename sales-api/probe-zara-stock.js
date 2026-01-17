
const productId = 452708281; // Known valid ID
const lat = 32.0853;
const lng = 34.7818;

const endpoints = [
    `https://www.zara.com/il/he/itxrest/2/catalog/store/stock/physical?lat=${lat}&lng=${lng}&productIds=${productId}`,
    `https://www.zara.com/il/he/stores-locator/search-stock?lat=${lat}&lng=${lng}&productIds=${productId}`,
    `https://www.zara.com/il/he/stock-sharing/stores-availability/v2/?lat=${lat}&lng=${lng}&productIds=${productId}`,
    `https://www.zara.com/il/he/products/${productId}/availability?lat=${lat}&lng=${lng}`
];

async function probe() {
    for (const url of endpoints) {
        console.log(`Probing ${url}...`);
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json'
                }
            });
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                const text = await res.text();
                console.log('Body:', text.substring(0, 200));
            }
        } catch (e) {
            console.log('Error:', e.message);
        }
    }
}

probe();
