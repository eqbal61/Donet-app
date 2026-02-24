import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBjkyqUPXZkSEqdmlTAzl1HENPit6-fHw4",
  authDomain: "the-10-minute-service.firebaseapp.com",
  databaseURL: "https://the-10-minute-service-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "the-10-minute-service",
  storageBucket: "the-10-minute-service.firebasestorage.app",
  messagingSenderId: "509121188592",
  appId: "1:509121188592:web:330ed2641eb921cba82835",
  measurementId: "G-BK1R2J3CLN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
