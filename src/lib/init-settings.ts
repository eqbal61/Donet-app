import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const initializeSettings = async () => {
  try {
    // 1. Payment Info
    const paymentRef = doc(db, 'settings', 'payment_info');
    const paymentSnap = await getDoc(paymentRef);
    
    if (!paymentSnap.exists()) {
      await setDoc(paymentRef, {
        bkash: "01700000000 (Personal)",
        nagad: "01800000000 (Merchant)",
        rocket: "01900000000 (Personal)"
      });
      console.log("Initialized payment_info settings in Firestore");
    }

    // 2. Header Notices
    const noticeRef = doc(db, 'settings', 'header_notice');
    const noticeSnap = await getDoc(noticeRef);
    
    if (!noticeSnap.exists()) {
      await setDoc(noticeRef, {
        notices: [
          "📢 Upcoming Jummah Prayer at 1:30 PM",
          "🌙 Ramadan Preparation Meeting on Friday",
          "🏗️ Construction Fund needs your support"
        ]
      });
      console.log("Initialized header_notice settings in Firestore");
    }
  } catch (error) {
    console.error("Error initializing settings:", error);
  }
};
