import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonChip, IonLabel } from '@ionic/react';
import { moon, sunny, notificationsOutline } from 'ionicons/icons';
import { useState, useEffect, useMemo } from 'react';
import BrandCard from '../components/BrandCard';
import HeroBanner from '../components/HeroBanner';
import LoadingScreen from '../components/LoadingScreen';
import { getBrands, Brand } from '../services/api';
import styles from './Home.module.css';

const Home: React.FC = () => {
    // Initialize state based on system preference
    const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
    const [selectedCategory, setSelectedCategory] = useState<string>('הכל');
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<string[]>(['הכל']);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBrands = async () => {
             try {
                 setLoading(true);
                 // Artificial delay for smooth loading experience if needed, or just fetch
                 const fetchedBrands = await getBrands();
                 setBrands(fetchedBrands);
                 
                 const uniqueCategories = Array.from(new Set(fetchedBrands.map(b => b.category)));
                 setCategories(['הכל', ...uniqueCategories]);
             } catch (error) {
                 console.error("Failed to load brands", error);
             } finally {
                 setLoading(false);
             }
        };
        loadBrands();
    }, []);

    const filteredBrands = useMemo(() => {
        if (selectedCategory === 'הכל') return brands;
        return brands.filter(b => b.category === selectedCategory);
    }, [selectedCategory, brands]);

    useEffect(() => {
      // Apply theme class whenever isDark changes
      document.documentElement.classList.toggle('ion-palette-dark', isDark);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

  if (loading) {
      return <LoadingScreen />;
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className={styles.toolbar} style={{ 
            '--background': isDark ? '#1f1f1f' : '#ffffff', 
            'boxShadow': isDark ? '0 1px 0 rgba(255,255,255,0.05)' : 'none',
            'borderBottom': isDark ? 'none' : '1px solid #f0f0f0',
        }}>
          <div className={styles.logoContainer}>
             <div className={styles.logoWrapper}>
                <div className={styles.logoIcon}>
                    <span className={styles.logoSymbol}>%</span>
                </div>
                <div>
                    <div className={`${styles.greeting} ${isDark ? styles.dark : ''}`}>ברוכים הבאים 👋</div>
                    <IonTitle className={`${styles.appTitle} ${isDark ? styles.dark : ''}`}>
                        51%
                    </IonTitle>
                </div>
             </div>
             
             <div className={styles.actions}>
                <IonButton 
                    shape="round" 
                    className="ion-no-padding"
                    style={{ 
                        '--background': isDark ? '#333333' : '#f0f0f0',
                        'color': isDark ? '#ffffff' : '#000000',
                        width: '44px', height: '44px', '--border-radius': '12px'
                    }}
                >
                    <IonIcon slot="icon-only" icon={notificationsOutline} />
                </IonButton>

                <IonButton 
                    onClick={toggleTheme} 
                    shape="round" 
                    className="ion-no-padding"
                     style={{ 
                        '--background': isDark ? '#333333' : '#f0f0f0',
                         'color': isDark ? '#fbbf24' : '#555',
                         width: '44px', height: '44px', '--border-radius': '12px'
                    }}
                >
                    <IonIcon slot="icon-only" icon={isDark ? sunny : moon} />
                </IonButton>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding" style={{ '--background': isDark ? '#000000' : '#f8f9fa' }}>
        
        <HeroBanner />

        <div className={styles.categoryScroll}>
            {categories.map(cat => (
                <IonChip 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    // Use 'dark' for high contrast text where supported, or default
                    color={selectedCategory === cat ? 'dark' : undefined} 
                    outline={selectedCategory !== cat}
                    style={{
                        '--background': selectedCategory === cat ? (isDark ? '#000' : '#fff') : 'transparent',
                        '--color': selectedCategory === cat ? (isDark ? '#fff' : '#000') : 'inherit',
                        'border': '1px solid currentColor',
                        'fontWeight': selectedCategory === cat ? 'bold' : 'normal'
                    }}
                    className={selectedCategory === cat && isDark ? 'highlight-chip-dark' : ''}
                >
                    <IonLabel>{cat}</IonLabel>
                </IonChip>
            ))}
        </div>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">מבצעי מותגים</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonGrid>
          <IonRow>
            {filteredBrands.map(brand => (
              <IonCol size="6" sizeMd="4" sizeLg="3" key={brand.id}>
                <BrandCard brand={brand} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
