
import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardTitle, 
  IonRippleEffect
} from '@ionic/react';
import { Brand } from '../services/api';
import { useHistory } from 'react-router-dom';
import styles from './BrandCard.module.css';

interface BrandCardProps {
  brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const history = useHistory();

  return (
    <IonCard 
      button 
      onClick={() => history.push(`/brand/${brand.id}`)}
      className={`ion-activatable ripple-parent ${styles.card}`}
    >
        <IonRippleEffect></IonRippleEffect>
      
      <div className={styles.heroImageArea}>
          <img 
            src={brand.logo} 
            alt={brand.name} 
            className={styles.logo}
          />
          
          <div className={styles.categoryBadge}>
              {brand.category}
          </div>
      </div>

      <IonCardHeader className={styles.cardHeader}>
        <div className={styles.headerContent}>
          <IonCardTitle className={styles.cardTitle}>
              {brand.name}
          </IonCardTitle>
          
          <div className={styles.subtitleContainer}>
             <div className={styles.statusDot}></div>
             <IonCardSubtitle className={styles.cardSubtitle}>
                 <span className={styles.productCount}>{brand.products?.length || 0}</span> מוצרים במבצע
             </IonCardSubtitle>
          </div>
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default BrandCard;
