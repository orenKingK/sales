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
  IonIcon,
  IonButton
} from '@ionic/react';
import { useParams } from 'react-router';
import { filterOutline, chevronForwardOutline, funnelOutline } from 'ionicons/icons';
import { IonPopover } from '@ionic/react';
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
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'rgba(255, 255, 255, 0.95)', '--backdrop-filter': 'blur(10px)', '--min-height': '60px' }}>
          <IonButtons slot="start">
            <IonBackButton 
                defaultHref="/home" 
                text="" 
                icon={chevronForwardOutline}
                style={{ 
                    color: '#333', 
                    background: 'rgba(0,0,0,0.05)', 
                    borderRadius: '50%', 
                    width: '40px', 
                    height: '40px',
                    marginLeft: '8px' 
                }} 
            />
          </IonButtons>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={brand.logo} alt={brand.name} style={{ height: '32px', maxWidth: '80px', objectFit: 'contain' }} />
              <div style={{ paddingRight: '8px', borderRight: '1px solid #eee' }}>
                 <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333' }}>{brand.name}</div>
                 <div style={{ fontSize: '0.7rem', color: '#666' }}>{brand.products.length} מבצעים</div>
              </div>
          </div>
        </IonToolbar>
        
        <IonToolbar style={{ '--background': '#fff', '--min-height': 'auto', 'padding': '0 8px 8px 8px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IonSearchbar 
                    value={searchText} 
                    onIonInput={e => setSearchText(e.detail.value!)} 
                    placeholder="מה בא לך לחפש?"
                    style={{ 
                        direction: 'rtl', 
                        flexGrow: 1, 
                        padding: 0, 
                        '--background': '#f4f4f4', 
                        '--border-radius': '12px',
                        '--placeholder-color': '#888',
                        '--icon-color': '#555' 
                    }}
                ></IonSearchbar>
                
                <IonButton 
                    id="trigger-sort-popover"
                    fill="clear" 
                    style={{ 
                        '--color': '#333', 
                        background: '#f4f4f4', 
                        borderRadius: '12px', 
                        height: '42px', 
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        margin: 0
                    }}
                >
                    <IonIcon icon={funnelOutline} slot="icon-only" />
                </IonButton>
                
                <IonPopover trigger="trigger-sort-popover" dismissOnSelect={true}>
                    <IonContent class="ion-padding">
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                                { val: 'default', label: 'מומלץ' },
                                { val: 'price_asc', label: 'מחיר: נמוך לגבוה' },
                                { val: 'price_desc', label: 'מחיר: גבוה לנמוך' },
                                { val: 'discount', label: 'ההנחה הכי שווה' }
                            ].map(opt => (
                                <div 
                                    key={opt.val}
                                    onClick={() => { setSortBy(opt.val); document.querySelector('ion-popover')?.dismiss(); }}
                                    style={{ 
                                        padding: '12px', 
                                        background: sortBy === opt.val ? '#f0f9ff' : 'transparent',
                                        color: sortBy === opt.val ? '#007aff' : '#333',
                                        borderRadius: '8px',
                                        fontWeight: sortBy === opt.val ? 700 : 400
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                         </div>
                    </IonContent>
                </IonPopover>
           </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': '#f8f9fa' }}>
        <IonGrid>
          <IonRow>
            {filteredProducts.map(product => (
              <IonCol size="6" sizeMd="4" sizeLg="3" key={product.id} className="ion-margin-bottom">
                <IonCard 
                    button 
                    onClick={() => setSelectedProduct(product)}
                    style={{ 
                        height: '100%', 
                        margin: '4px', 
                        borderRadius: '12px',
                        background: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                        border: '1px solid rgba(0,0,0,0.03)',
                        overflow: 'hidden'
                    }}
                >
                  <div style={{ position: 'relative', paddingTop: '133%' /* 3:4 Aspect Ratio */ }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover' 
                      }} 
                    />
                     <div style={{ 
                         position: 'absolute', 
                         top: '8px', 
                         left: '8px', 
                         background: '#FF3B30', 
                         color: 'white', 
                         fontSize: '0.7rem', 
                         fontWeight: 700,
                         padding: '4px 8px',
                         borderRadius: '4px',
                         boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                     }}>
                        SALE
                     </div>
                  </div>
                  
                  <div style={{ padding: '12px' }}>
                    <div style={{ 
                        fontSize: '0.85rem', 
                        color: '#1c1c1e', 
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '4px'
                    }}>
                        {product.name}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FF3B30' }}>
                            ₪{product.salePrice.toFixed(0)}
                        </div>
                        <div style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: '#8e8e93' }}>
                            ₪{product.price.toFixed(0)}
                        </div>
                    </div>
                  </div>
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
