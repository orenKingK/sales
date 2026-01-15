import React, { useState, useMemo } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonIcon
} from '@ionic/react';
import { useParams } from 'react-router';
import { filterOutline } from 'ionicons/icons';
import { DUMMY_BRANDS, Product } from '../data/dummyData';
import ProductModal from '../components/ProductModal';

const BrandDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const brand = DUMMY_BRANDS.find(b => b.id === id);

  const filteredProducts = useMemo(() => {
    if (!brand) return [];
    
    let products = [...brand.products];

    // Filter
    if (searchText) {
        products = products.filter(p => 
            p.name.includes(searchText) || p.description.includes(searchText)
        );
    }

    // Sort
    switch (sortBy) {
        case 'price_asc':
            products.sort((a, b) => a.salePrice - b.salePrice);
            break;
        case 'price_desc':
            products.sort((a, b) => b.salePrice - a.salePrice);
            break;
        case 'discount':
            products.sort((a, b) => (b.price - b.salePrice) - (a.price - a.salePrice));
            break;
        default:
            break;
    }

    return products;
  }, [brand, searchText, sortBy]);

  if (!brand) {
    return <div>מותג לא נמצא</div>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="חזור" />
          </IonButtons>
          <IonTitle>{brand.name}</IonTitle>
        </IonToolbar>
        <IonToolbar color="light">
           <div style={{ display: 'flex', alignItems: 'center', paddingRight: '8px' }}>
                <IonSearchbar 
                    value={searchText} 
                    onIonInput={e => setSearchText(e.detail.value!)} 
                    placeholder="חיפוש..."
                    style={{ direction: 'rtl', flexGrow: 1, paddingBottom: 0 }}
                ></IonSearchbar>
                
                <div style={{ width: '120px', marginLeft: '8px' }}>
                    <IonSelect 
                        value={sortBy} 
                        placeholder="מיון" 
                        interface="popover"
                        onIonChange={e => setSortBy(e.detail.value)}
                        style={{ '--padding-start': '0' }}
                    >
                        <IonSelectOption value="default">רגיל</IonSelectOption>
                        <IonSelectOption value="price_asc">מחיר: נמוך לגבוה</IonSelectOption>
                        <IonSelectOption value="price_desc">מחיר: גבוה לנמוך</IonSelectOption>
                        <IonSelectOption value="discount">ההנחה הגדולה ביותר</IonSelectOption>
                    </IonSelect>
                </div>
           </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow>
            {filteredProducts.map(product => (
              <IonCol size="4" sizeMd="3" sizeLg="2" key={product.id} className="ion-margin-bottom">
                <IonCard 
                    button 
                    onClick={() => setSelectedProduct(product)}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: '2px' }}
                >
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ height: '120px', width: '100%', objectFit: 'cover' }} 
                    />
                     <IonBadge color="danger" style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '0.6rem' }}>
                        מבצע
                     </IonBadge>
                  </div>
                  <IonCardHeader style={{ padding: '8px' }}>
                    <IonCardTitle style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px' }}>
                    <IonText color="medium" style={{ fontSize: '0.7rem', marginBottom: '5px', display: 'none' }}>
                      {product.description}
                    </IonText>
                    <div>
                        <IonText color="medium" style={{ textDecoration: 'line-through', marginLeft: '5px', fontSize: '0.7rem' }}>
                        ₪{product.price.toFixed(0)}
                        </IonText>
                        <IonText color="danger" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                        ₪{product.salePrice.toFixed(0)}
                        </IonText>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <ProductModal 
            isOpen={!!selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            product={selectedProduct} 
        />

      </IonContent>
    </IonPage>
  );
};

export default BrandDetails;
