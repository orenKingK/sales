
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
      style={{ 
          height: '100%', 
          margin: 0,
          background: 'var(--ion-card-background, #fff)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.04)'
      }}
    >
        <IonRippleEffect></IonRippleEffect>
      
      {/* Hero Image Area */}
      <div style={{ 
          height: '140px', 
          width: '100%', 
          position: 'relative',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
      }}>
          <img 
            src={brand.logo} 
            alt={brand.name} 
            style={{ 
                maxHeight: '100%', 
                maxWidth: '100%', 
                objectFit: 'contain',
                filter: 'grayscale(0%)' // Ensure logos pop
            }} 
          />
          
          <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 107, 107, 0.1)',
              color: '#FF6B6B',
              padding: '4px 8px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700
          }}>
              {brand.category}
          </div>
      </div>

      <IonCardHeader style={{ padding: '16px', paddingTop: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <IonCardTitle style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ion-text-color)' }}>
              {brand.name}
          </IonCardTitle>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
             <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2DD36F' }}></div>
             <IonCardSubtitle style={{ 
                 textTransform: 'none', 
                 fontSize: '0.9rem', 
                 color: 'var(--ion-color-medium)',
                 fontWeight: 500
             }}>
                 <span style={{ color: 'var(--ion-text-color)', fontWeight: 700 }}>{brand.products.length}</span> מוצרים במבצע
             </IonCardSubtitle>
          </div>
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default BrandCard;
