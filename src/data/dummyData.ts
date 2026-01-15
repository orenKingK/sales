
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice: number;
    image: string;
}

export interface Brand {
    id: string;
    name: string;
    logo: string;
    category: string;
    products: Product[];
}

const generateProducts = (brandPrefix: string, category: string): Product[] => {
    const products: Product[] = [];
    const images = {
        'Fashion': [
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            'https://images.unsplash.com/photo-1542272617-08f08630329e?w=800&q=80',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80', // shirt
            'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80', // dress
            'https://images.unsplash.com/photo-1551488852-080175b25299?w=800&q=80', // shoes
            'https://images.unsplash.com/photo-1604176354204-9268737828fa?w=800&q=80', // jacket
        ],
        'Electronics': [
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
            'https://images.unsplash.com/photo-1588872657578-a83a04a3a5f9?w=800&q=80', // headphones
            'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80', // monitor
            'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80', // keyboard
            'https://images.unsplash.com/photo-1593305841991-05c2e439ee60?w=800&q=80', // gaming setup
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80', // ipad
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', // console
        ],
        'Lingerie': [
            'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
            'https://images.unsplash.com/photo-1596472537359-7626dd823157?w=800&q=80',
            'https://images.unsplash.com/photo-1509319117193-518cd388C8e3?w=800&q=80', // Cozy wear
            'https://images.unsplash.com/photo-1571781564883-8a0b0d3e239e?w=800&q=80', // Pajamas
            'https://images.unsplash.com/photo-1616248249518-ea16b29b6343?w=800&q=80',
        ],
        'Cosmetics': [
            'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&q=80', // makeup items
            'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80', // lipstick
            'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80', // skincare
            'https://images.unsplash.com/photo-1580870308373-1cb58de779eb?w=800&q=80', // palette
            'https://images.unsplash.com/photo-1522335789203-abd652321218?w=800&q=80', // perfume
        ],
         'Body': [
            'https://images.unsplash.com/photo-1547887538-e6a0d2f8da3d?w=800&q=80', // body cream
            'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=800&q=80', // soap
            'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=800&q=80', // candles
            'https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=800&q=80', // spa
            'https://images.unsplash.com/photo-1556228720-1927cbdf4650?w=800&q=80', // lotion set
        ]
    };

    const categoryImages = images[category as keyof typeof images] || images['Fashion'];
    const names = {
        'Fashion': ['חולצה', 'מכנס', 'שמלה', 'ז׳קט', 'נעליים', 'כובע', 'חצאית', 'סוודר', 'מעיל', 'צעיף'],
        'Electronics': ['מחשב נייד', 'אוזניות', 'עכבר', 'מקלדת', 'מסך', 'טאבלט', 'רמקול', 'מטען', 'כונן חיצוני', 'מצלמה'],
        'Lingerie': ['פיג׳מה רכה', 'סט הלבשה תחתונה', 'חלוק רחצה', 'גרביים מעוצבות', 'גופיית ספורט', 'טייץ נוח', 'חולצת שינה'],
        'Cosmetics': ['שפתון מאט', 'פלטת צלליות', 'מייקאפ עמיד', 'מסקרה מעבה', 'סומק טבעי', 'שימר זוהר', 'לק מהמם', 'אייליינר'],
        'Body': ['קרם גוף', 'סבון פילינג', 'נר ריחני', 'מפיץ ריח', 'שמן גוף', 'מלח אמבט', 'קרם ידיים', 'בושם לבית']
    };
    const categoryNames = names[category as keyof typeof names] || names['Fashion'];

    for (let i = 1; i <= 50; i++) {
        const basePrice = Math.floor(Math.random() * 400) + 50;
        const discount = Math.floor(Math.random() * 30) + 10;
        const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];
        const randomName = categoryNames[Math.floor(Math.random() * categoryNames.length)];

        products.push({
            id: `${brandPrefix}${i}`,
            name: `${randomName} ${i}`,
            description: `תיאור עבור מוצר ${randomName} מספר ${i} - מוצר איכותי מסדרת ${category}.`,
            price: basePrice,
            salePrice: Math.floor(basePrice * (1 - discount / 100)),
            image: randomImage
        });
    }
    return products;
};

export const DUMMY_BRANDS: Brand[] = [
    {
        id: '1',
        name: 'זארה',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg',
        category: 'אופנה',
        products: generateProducts('z', 'Fashion')
    },
    {
        id: '2',
        name: 'KSP',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjbq-T7rhAK3T8cGlXCvNRp-YKxd-ktlx0hQ&s',
        category: 'אלקטרוניקה',
        products: generateProducts('k', 'Electronics')
    },
    {
        id: '3',
        name: 'H&M',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg',
        category: 'אופנה',
        products: generateProducts('h', 'Fashion')
    },
    {
        id: '4',
        name: 'דלתא',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKN2nRfAXi53AttJJ3zLNUEwsMzMsGFIivsg&s',
        category: 'הלבשה תחתונה',
        products: generateProducts('d', 'Lingerie')
    },
    {
        id: '5',
        name: 'סקארה',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStYGj81Ia4ZSA9nIU7lnYE37KA0fe_TyaUig&s', 
        category: 'קוסמטיקה',
        products: generateProducts('s', 'Cosmetics')
    },
    {
        id: '6',
        name: 'ללין',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP6IAmuCkqabJ2yo_4imMZ5phTBlGjphMjDw&s',
        category: 'טיפוח וגוף',
        products: generateProducts('l', 'Body')
    }
];
