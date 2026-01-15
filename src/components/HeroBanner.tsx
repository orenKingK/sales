import React from 'react';
import { IonCard, IonCardContent, IonText, IonButton } from '@ionic/react';

const HeroBanner: React.FC = () => {
    return (
        <IonCard style={{ 
            marginTop: '10px', 
            marginBottom: '20px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            borderRadius: '20px',
            border: 'none',
            overflow: 'visible'
        }}>
            <IonCardContent style={{ position: 'relative', padding: '24px' }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <IonText color="light">
                        <h1 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: 800 }}>סייל מטורף!</h1>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: '0 0 16px 0' }}>
                            עד 50% הנחה על כל מותגי האופנה והאלקטרוניקה. אל תפספסו!
                        </p>
                    </IonText>
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default HeroBanner;
