import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonChip, IonLabel } from '@ionic/react';
import { moon, sunny, notificationsOutline } from 'ionicons/icons';
import { useState, useEffect, useMemo } from 'react';
import BrandCard from '../components/BrandCard';
import HeroBanner from '../components/HeroBanner';
import { DUMMY_BRANDS } from '../data/dummyData';
import './Home.css';

const Home: React.FC = () => {
    // Initialize state based on system preference
    const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
    const [selectedCategory, setSelectedCategory] = useState<string>('הכל');

    const categories = ['הכל', ...Array.from(new Set(DUMMY_BRANDS.map(b => b.category)))];

    const filteredBrands = useMemo(() => {
        if (selectedCategory === 'הכל') return DUMMY_BRANDS;
        return DUMMY_BRANDS.filter(b => b.category === selectedCategory);
    }, [selectedCategory]);

    useEffect(() => {
      // Apply initial theme class
      document.documentElement.classList.toggle('ion-palette-dark', isDark);
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle('ion-palette-dark', newIsDark);
    };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ 
            '--background': isDark ? '#1f1f1f' : '#ffffff', 
            'padding': '8px 16px',
            'boxShadow': isDark ? '0 1px 0 rgba(255,255,255,0.05)' : 'none',
            'borderBottom': isDark ? 'none' : '1px solid #f0f0f0',
            'zIndex': 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(255, 107, 107, 0.3)'
                }}>
                    <span style={{ color: 'white', fontWeight: '900', fontSize: '20px' }}>%</span>
                </div>
                <div>
                    <div style={{ fontSize: '0.8rem', color: isDark ? '#999' : '#666', fontWeight: 500 }}>ברוכים הבאים 👋</div>
                    <IonTitle style={{ padding: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', color: isDark ? '#fff' : '#000' }}>
                        Sales<span style={{ color: '#FF6B6B' }}>App</span>
                    </IonTitle>
                </div>
             </div>
             
             <div style={{ display: 'flex', gap: '8px' }}>
                <IonButton 
                    shape="round" 
                    className="ion-no-padding"
                    style={{ 
                        '--background': isDark ? '#333333' : '#f0f0f0',
                        'width': '44px',
                        'height': '44px',
                        '--border-radius': '12px',
                        'color': isDark ? '#ffffff' : '#000000'
                    }}
                >
                    <IonIcon slot="icon-only" icon={notificationsOutline} style={{ color: isDark ? '#ffffff' : '#000000' }} />
                </IonButton>

                <IonButton 
                    onClick={toggleTheme} 
                    shape="round" 
                    className="ion-no-padding"
                    style={{ 
                         '--background': isDark ? '#333333' : '#f0f0f0',
                        'width': '44px',
                        'height': '44px',
                        '--border-radius': '12px',
                         'color': isDark ? '#fbbf24' : '#555'
                    }}
                >
                    <IonIcon slot="icon-only" icon={isDark ? sunny : moon} style={{ color: isDark ? '#fbbf24' : '#000000' }} />
                </IonButton>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding" style={{ '--background': isDark ? '#000000' : '#f8f9fa' }}>
        
        <HeroBanner />

        <div className="category-scroll">
            {categories.map(cat => (
                <IonChip 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    color={selectedCategory === cat ? 'primary' : 'medium'}
                    outline={selectedCategory !== cat}
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
