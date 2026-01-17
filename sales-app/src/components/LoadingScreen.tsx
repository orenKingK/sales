import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  // You can add props here if needed, like 'progress' or 'message'
}

const LoadingScreen: React.FC<LoadingScreenProps> = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className={styles.loadingContainer}>
          <div className={styles.banner}>
             <img src="/logo.png" alt="51%" className={styles.logoImage}  
                  onError={(e) => {
                      // Fallback if image load fails
                      e.currentTarget.style.display = 'none';
                  }}
             />
          </div>
          
          <div className={styles.appName}>51%</div>
          <div className={styles.tagline}>כל המבצעים הכי שווים במקום אחד</div>

          <div className={styles.spinner}></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoadingScreen;
