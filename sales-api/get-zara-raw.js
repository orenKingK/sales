
const https = require('https');

const productId = '452708227';
const url = `https://www.zara.com/il/he/products-details?productIds=${productId}&ajax=true`;

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json'
};

https.get(url, { headers }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const product = json[0];
            console.log('Product ID:', product.id);
            console.log('Bundle Name:', product.name);
            
            // Extract SKUs/Variants
            if (product.detail && product.detail.colors) {
                product.detail.colors.forEach(color => {
                    console.log('Color:', color.name);
                    color.sizes.forEach(size => {
                        console.log(`Size: ${size.name}, SKU: ${size.sku}, PartNumber: ${size.partNumber || 'N/A'}, ID: ${size.id}, GlobalItemId: ${size.globalItemId}`);
                    });
                });
            }

        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw Data:', data);
        }
    });
}).on('error', err => {
    console.error('Error:', err.message);
});
