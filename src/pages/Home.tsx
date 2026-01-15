import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonChip, IonLabel } from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';
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
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>מבצעי מותגים</IonTitle>
           <IonButtons slot="end">
            <IonButton onClick={toggleTheme}>
              <IonIcon slot="icon-only" icon={isDark ? sunny : moon} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        
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
