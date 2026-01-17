import React from 'react';
import { IonText } from '@ionic/react';
import styles from './HeroBanner.module.css';

interface HeroBannerProps {
    isDark: boolean;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ isDark }) => {
    // Dynamic Styles
    const backgroundStyle = isDark 
        ? 'linear-gradient(135deg, #2a0845 0%, #6441A5 100%)' // Deep Midnight Purple
        : 'linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%)'; // Light Lavender
        
    const textColor = isDark ? '#ffffff' : '#000000';
    
    // Dynamic Content
    const title = isDark ? "מבצעי לילה בלעדיים 🌙" : "סייל מטורף! ☀️";
    const subtitle = isDark 
        ? "המחירים יורדים כשהשמש שוקעת. אל תפספסו את ההזדמנות."
        : "עד 50% הנחה על כל מותגי האופנה והאלקטרוניקה. להתחלה חדשה!";

    return (
        <div className={styles.card} style={{
            background: backgroundStyle, // Inline to override Ionic
            color: textColor,
            boxShadow: isDark ? '0 4px 15px rgba(100, 65, 165, 0.4)' : '0 4px 12px rgba(118, 75, 162, 0.15)'
        }}>
            <div className={styles.content}>
                <div className={styles.textContainer}>
                    <IonText style={{ color: textColor }}>
                        <h1 className={styles.title}>{title}</h1>
                        <p className={styles.subtitle}>
                            {subtitle}
                        </p>
                    </IonText>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
