
import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardTitle, 
  IonCardContent, 
  IonBadge,
  IonRippleEffect
} from '@ionic/react';
import { Brand } from '../data/dummyData';
import { useHistory } from 'react-router-dom';

interface BrandCardProps {
  brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const history = useHistory();

  return (
    <IonCard 
      button 
      onClick={() => history.push(`/brand/${brand.id}`)}
      className="ion-activatable ripple-parent"
      style={{ height: '100%' }}
    >
        <IonRippleEffect></IonRippleEffect>
      <img src={brand.logo} alt={brand.name} style={{ height: '150px', width: '100%', objectFit: 'contain', padding: '20px', backgroundColor: '#f9f9f9' }} />
      <IonCardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <IonCardTitle>{brand.name}</IonCardTitle>
          <IonBadge color="secondary">{brand.category}</IonBadge>
        </div>
        <IonCardSubtitle style={{ marginTop: '10px' }}>
             <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: 'var(--ion-color-primary)' }}>
                 {brand.products.length}
             </span> פריטים במבצע
        </IonCardSubtitle>
      </IonCardHeader>
      
      <IonCardContent>
          לחץ לצפייה בכל המבצעים
      </IonCardContent>
    </IonCard>
  );
};

export default BrandCard;
