
import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonButton,
  IonLabel,
  IonPopover,
  IonSegment,
  IonSegmentButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/react';
import { useParams } from 'react-router';
import { funnelOutline, chevronForwardOutline } from 'ionicons/icons';
import ProductModal from '../components/ProductModal';
import LoadingScreen from '../components/LoadingScreen';
import { getBrandById, getBrandSales, Brand, Product } from '../services/api';
import styles from './BrandDetails.module.css';

const BrandDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const isFetching = useRef(false);
  
  // Filter States
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Data States
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [infiniteDisabled, setInfiniteDisabled] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Initial Brand Fetch
  useEffect(() => {
      const fetchBrandInfo = async () => {
          try {
              const brandData = await getBrandById(id);
              setBrand(brandData);
          } catch (error) {
              console.error("Error fetching brand:", error);
          }
      };
      if (id) fetchBrandInfo();
  }, [id]);

  // Main Data Fetcher
  const fetchData = async (reset: boolean = false) => {
      if (!brand) return;
      if (isFetching.current) return;

      try {
          isFetching.current = true;
          if (reset) {
              setLoading(true);
              setInfiniteDisabled(true); // Disable infinite scroll during reset to prevent double firing
          }
          
          const currentPage = reset ? 1 : page;
          const limit = 20;

          if (brand.id === '1') { // Zara logic
              const result = await getBrandSales('zara', {
                  page: currentPage,
                  limit,
                  productType: selectedType,
                  search: searchText,
                  sortBy
              });

              if (reset) {
                  setProducts(result.items);
                  setCategories(['all', ...result.facets.productTypes]);
              } else {
                  setProducts(prev => [...prev, ...result.items]);
              }

              setTotalItems(result.total);
              
              // Only enable infinite scroll if we have more pages
              // And wait a moment to ensure DOM updated
              const hasMore = result.items.length === limit;
              setTimeout(() => {
                  setInfiniteDisabled(!hasMore);
              }, 100);
              
              setPage(currentPage + 1);

          } else {
              setProducts(brand.products);
              setTotalItems(brand.products.length);
              setInfiniteDisabled(true);
          }

      } catch (error) {
          console.error("Error fetching sales:", error);
      } finally {
          setLoading(false);
          isFetching.current = false;
      }
  };

  // Trigger fetch when filters change
  useEffect(() => {
     if (brand) {
         // Reset scroll position immediately
         contentRef.current?.scrollToTop(0);
         fetchData(true);
     }
  }, [brand, searchText, sortBy, selectedType]);

  // Handle Infinite Scroll
  const loadMore = async (ev: any) => {
      await fetchData(false);
      ev.target.complete();
  };

  if (loading && products.length === 0) {
      return <LoadingScreen />;
  }

  if (!brand) {
    return <div>מותג לא נמצא</div>;
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className={styles.toolbarTitle}>
          <IonButtons slot="start">
            <IonBackButton 
                defaultHref="/home" 
                text="" 
                icon={chevronForwardOutline}
                className={styles.backButton}
            />
          </IonButtons>
          
          <div className={styles.brandHeader}>
              <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
              <div className={styles.brandInfo}>
                 <div className={styles.brandName}>{brand.name}</div>
                 <div className={styles.brandCount}>{totalItems} מבצעים</div>
              </div>
          </div>
        </IonToolbar>
        
        <IonToolbar className={styles.filterToolbar}>
           <div className={styles.controlsContainer}>
                {/* Dynamic Product Type Segment */}
                {categories.length > 1 && (
                    <IonSegment 
                        scrollable={true}
                        value={selectedType}
                        onIonChange={e => setSelectedType(e.detail.value! as string)}
                        className={styles.segment}
                    >
                        {categories.map(cat => (
                            <IonSegmentButton key={cat} value={cat}>
                                <IonLabel>{cat === 'all' ? 'הכל' : cat}</IonLabel>
                            </IonSegmentButton>
                        ))}
                    </IonSegment>
                )}

                <div className={styles.searchSortRow}>
                    <IonSearchbar 
                        mode="ios"
                        value={searchText} 
                        onIonInput={e => setSearchText(e.detail.value!)} 
                        placeholder="חיפוש..."
                        className={styles.searchbar}
                        showClearButton="focus"
                        debounce={500}
                    ></IonSearchbar>
                    
                    <IonButton 
                        id="trigger-sort-popover"
                        fill="clear"
                        className={styles.sortButton}
                    >
                         <IonIcon icon={funnelOutline} />
                    </IonButton>
                    
                    <IonPopover trigger="trigger-sort-popover" dismissOnSelect={true}>
                        <IonContent class="ion-padding">
                             <div className={styles.popoverContainer}>
                                {[
                                    { val: 'default', label: 'מומלץ' },
                                    { val: 'price_asc', label: 'מחיר: נמוך לגבוה' },
                                    { val: 'price_desc', label: 'מחיר: גבוה לנמוך' },
                                    { val: 'discount', label: 'ההנחה הכי שווה' }
                                ].map(opt => (
                                    <div 
                                        key={opt.val}
                                        onClick={() => { setSortBy(opt.val); document.querySelector('ion-popover')?.dismiss(); }}
                                        className={`${styles.popoverOption} ${sortBy === opt.val ? styles.popoverOptionSelected : styles.popoverOptionDefault}`}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                             </div>
                        </IonContent>
                    </IonPopover>
               </div>
           </div>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} fullscreen className={`ion-padding ${styles.pageContent}`}>
        <IonGrid>
          <IonRow>
            {products.map(product => (
              <IonCol size="6" sizeMd="4" sizeLg="3" key={product.id} className={styles.productCol}>
                <IonCard 
                    button 
                    onClick={() => setSelectedProduct(product)}
                    className={styles.productCard}
                >
                  <div className={styles.productImageContainer}>
                    <img 
                      src={(product.availableColors && product.availableColors[0]?.colorCut?.url 
                          ? product.availableColors[0].colorCut.url.replace('{width}', '750')
                          : product.image) + '.jpg'}
                      alt={product.name} 
                      className={styles.productImage}
                    />
                     {product.price > product.salePrice && (
                       <div className={styles.discountBadge}>
                          {product.discountPercentage 
                              ? `-${product.discountPercentage.replace('%', '')}%` 
                              : `-${Math.round(((product.price - product.salePrice) / product.price) * 100)}%`
                          }
                       </div>
                     )}
                     {product.gender && (
                         <div className={styles.genderBadge}>
                             {product.gender === 'Men' ? 'גברים' : 'נשים'}
                         </div>
                     )}
                  </div>
                  
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>
                        {product.name}
                    </div>
                    
                    <div className={styles.priceRow}>
                        <div className={product.price > product.salePrice ? styles.salePrice : styles.normalPrice}>
                            ₪{product.salePrice.toFixed(2)}
                        </div>
                        {product.price > product.salePrice && (
                            <div className={styles.originalPrice}>
                                ₪{product.price.toFixed(2)}
                            </div>
                        )}
                    </div>
                  </div>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonInfiniteScroll
            onIonInfinite={loadMore}
            threshold="100px"
            disabled={infiniteDisabled}
        >
            <IonInfiniteScrollContent
                loadingSpinner="bubbles"
                loadingText="טוען עוד מוצרים..."
            />
        </IonInfiniteScroll>

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
