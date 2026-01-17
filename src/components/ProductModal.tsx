import React from 'react';
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
import { closeOutline, cartOutline } from 'ionicons/icons';
import { Product } from '../services/api';
import styles from './ProductModal.module.css';

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
                 <div className={styles.imageContainer}>
                    <IonImg 
                        src={(product.availableColors && product.availableColors[0]?.colorCut?.url
                            ? product.availableColors[0].colorCut.url.replace('{width}', '750')
                            : product.image) + '.jpg'}
                        alt={product.name} 
                        className={styles.image} 
                    />
                 </div>
                 
                 <div className={styles.headerRow}>
                    <IonText color="dark">
                        <h2 className={styles.title}>{product.name}</h2>
                    </IonText>
                     <div className={styles.priceContainer}>
                        {product.price > product.salePrice && (
                             <span className={styles.originalPrice}>
                                 ₪{product.price.toFixed(0)}
                             </span>
                        )}
                        <span className={styles.salePrice}>
                             ₪{product.salePrice.toFixed(0)}
                        </span>
                     </div>
                 </div>

                 <IonText color="medium">
                     <p className={styles.description}>
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
