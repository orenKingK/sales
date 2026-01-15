import React, { useRef } from 'react';
import { 
    IonModal, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonButtons, 
    IonIcon,
    IonImg,
    IonText,
    IonFooter
} from '@ionic/react';
import { closeOutline, cartOutline, shareSocialOutline } from 'ionicons/icons';
import { Product } from '../data/dummyData';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
    if (!product) return null;

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.75} breakpoints={[0, 0.5, 0.75, 1]}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{product.name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>
                            <IonIcon icon={closeOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                 <div style={{ 
                     borderRadius: '16px', 
                     overflow: 'hidden', 
                     marginBottom: '20px', 
                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                 }}>
                    <IonImg src={product.image} alt={product.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                 </div>
                 
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <IonText color="dark">
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{product.name}</h2>
                    </IonText>
                     <div style={{ textAlign: 'left' }}>
                        <IonText color="medium" style={{ textDecoration: 'line-through', fontSize: '1rem', display: 'block' }}>
                             ₪{product.price.toFixed(0)}
                        </IonText>
                        <IonText color="danger" style={{ fontSize: '1.5rem', fontWeight: '900' }}>
                             ₪{product.salePrice.toFixed(0)}
                        </IonText>
                     </div>
                 </div>

                 <IonText color="medium">
                     <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                         {product.description}
                     </p>
                 </IonText>
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <IonButton expand="block" shape="round" className="ion-margin">
                        <IonIcon slot="start" icon={cartOutline} />
                        הוסף לסל
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonModal>
    );
};

export default ProductModal;
