import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getDatabase, ref, get, set, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_CzF8AVYJTQxQVrXSJf5-fKOk5VacGR8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "practicalshare.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "practicalshare",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "practicalshare.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "445035892666",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:445035892666:web:3ba42403f56463748f9783",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Z68Q3R0Y2Z",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://practicalshare-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

export { storage, database, ref, get, set, onValue };
