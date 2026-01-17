import React from 'react';
import { IonCard, IonCardContent, IonText } from '@ionic/react';
import styles from './HeroBanner.module.css';

const HeroBanner: React.FC = () => {
    return (
        <IonCard className={styles.card}>
            <IonCardContent className={styles.content}>
                <div className={styles.textContainer}>
                    <IonText color="light">
                        <h1 className={styles.title}>סייל מטורף!</h1>
                        <p className={styles.subtitle}>
                            עד 50% הנחה על כל מותגי האופנה והאלקטרוניקה. אל תפספסו!
                        </p>
                    </IonText>
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default HeroBanner;
