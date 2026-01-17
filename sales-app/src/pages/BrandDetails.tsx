
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
  IonInfiniteScrollContent,
  IonModal,
  IonProgressBar
} from '@ionic/react';
import { useParams } from 'react-router';
import { funnelOutline, chevronForwardOutline, searchOutline, closeOutline, arrowUpOutline, arrowDownOutline, pricetagOutline, starOutline } from 'ionicons/icons';
import ProductModal from '../components/ProductModal';
import LoadingScreen from '../components/LoadingScreen';
import { getBrandById, getBrandSales, Brand, Product } from '../services/api';
import styles from './BrandDetails.module.css';

const BrandDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const isFetching = useRef(false);
  const infiniteScrollRef = useRef(false); // Strict guard for pagination
  
  // Filter States
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showSortModal, setShowSortModal] = useState(false);

  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  // Debounce Search Text
  useEffect(() => {
      const timer = setTimeout(() => {
          setDebouncedSearchText(searchText);
      }, 500);
      return () => clearTimeout(timer);
  }, [searchText]);

  // Helper for Sort Labels
  const getSortDetails = (sortVal: string) => {
      switch(sortVal) {
          case 'price_asc': return { label: 'מחיר: נמוך לגבוה', icon: arrowUpOutline };
          case 'price_desc': return { label: 'מחיר: גבוה לנמוך', icon: arrowDownOutline };
          case 'discount': return { label: 'הנחה טובה ביותר', icon: pricetagOutline };
          default: return { label: 'מומלץ', icon: starOutline };
      }
  };
  
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
                  search: debouncedSearchText,
                  sortBy
              });

              if (reset) {
                  setProducts(result.items);
                  if (categories.length === 0) {
                      setCategories(['all', ...result.facets.productTypes]);
                  }
              } else {
                  setProducts(prev => [...prev, ...result.items]);
              }

              setTotalItems(result.total);
              
              // Only enable infinite scroll if we have more pages
              // And wait a moment to ensure DOM updated
              const hasMore = result.items.length === limit;
              if (!hasMore) {
                  setInfiniteDisabled(true);
                  infiniteScrollRef.current = false;
              } else {
                  // Small delay to prevent immediate trigger if content is short
                  setTimeout(() => {
                      setInfiniteDisabled(false);
                      infiniteScrollRef.current = true;
                  }, 500); 
              }
              
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
         setInfiniteDisabled(true); // Disable immediately to prevent scroll triggers
         infiniteScrollRef.current = false; // Strict guard
         // Reset scroll position immediately
         contentRef.current?.scrollToTop(0);
         fetchData(true);
     }
  }, [brand, debouncedSearchText, sortBy, selectedType]);

  // Handle Infinite Scroll
  const loadMore = async (ev: any) => {
      // Strict guard: If specific blocked, do not trigger
      if (!infiniteScrollRef.current) {
          ev.target.complete();
          return;
      }
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
           <div className={styles.controlsRow}>
                {/* 1. Search & Sort Row (Always visible) */}
                <div className={styles.primaryControls}>
                    <div className={styles.searchContainer}>
                        <div className={styles.searchInputWrapper}>
                            <IonIcon icon={searchOutline} className={styles.searchIcon} />
                            <input 
                                type="text" 
                                className={styles.searchInput} 
                                placeholder="חיפוש מוצרים..." 
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            {searchText && (
                                <IonIcon 
                                    icon={closeOutline} 
                                    onClick={() => setSearchText('')} 
                                    style={{ fontSize: '1.4rem', color: '#666' }} 
                                />
                            )}
                        </div>
                    </div>

                    <div className={styles.sortContainer}>
                        <div className={styles.sortButton} onClick={() => setShowSortModal(true)}>
                            <IonIcon 
                                icon={sortBy === 'default' ? funnelOutline : getSortDetails(sortBy).icon} 
                                style={{ fontSize: '1.5rem' }}
                            />
                            <span className={styles.sortButtonText}>
                                {sortBy === 'default' ? 'מיון' : getSortDetails(sortBy).label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Filters Row (Scrollable) */}
                <div className={styles.filtersContainer}>
                    {categories.length > 0 && categories.map(cat => (
                        <div 
                            key={cat} 
                            className={`${styles.filterPill} ${selectedType === cat ? styles.active : ''}`}
                            onClick={() => setSelectedType(cat)}
                        >
                            {cat === 'all' ? 'הכל' : cat}
                        </div>
                    ))}
                </div>
           </div>
        </IonToolbar>
      </IonHeader>

      {loading && products.length > 0 && <IonProgressBar type="indeterminate" color="primary" />}

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

        <IonModal 
            isOpen={showSortModal} 
            onDidDismiss={() => setShowSortModal(false)}
            initialBreakpoint={0.4}
            breakpoints={[0, 0.4]}
            className={styles.bottomSheetContent}
        >
            <IonContent>
                    <div className="ion-padding">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                        <h3 style={{margin: 0, fontWeight: 700}}>מיון לפי</h3>
                        <IonIcon icon={closeOutline} onClick={() => setShowSortModal(false)} style={{fontSize: '1.5rem'}} />
                    </div>
                    
                    <div className={styles.popoverContainer}>
                    {[
                        { val: 'default', label: 'מומלץ', icon: starOutline },
                        { val: 'price_asc', label: 'מחיר: נמוך לגבוה', icon: arrowUpOutline },
                        { val: 'price_desc', label: 'מחיר: גבוה לנמוך', icon: arrowDownOutline },
                        { val: 'discount', label: 'הנחה טובה ביותר', icon: pricetagOutline }
                    ].map(opt => (
                        <div 
                            key={opt.val}
                            onClick={() => { setSortBy(opt.val); setShowSortModal(false); }}
                            className={`${styles.popoverOption} ${sortBy === opt.val ? styles.popoverOptionSelected : styles.popoverOptionDefault}`}
                            style={{display: 'flex', alignItems: 'center', gap: '12px'}}
                        >
                            <IonIcon icon={opt.icon} />
                            {opt.label}
                            {sortBy === opt.val && <IonIcon icon={searchOutline} style={{marginLeft: 'auto'}} />} 
                        </div>
                    ))}
                    </div>
                    </div>
            </IonContent>
        </IonModal>

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
