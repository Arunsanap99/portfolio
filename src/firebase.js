import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getDatabase, ref, get, set, onValue } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_CzF8AVYJTQxQVrXSJf5-fKOk5VacGR8",
  authDomain: "practicalshare.firebaseapp.com",
  projectId: "practicalshare",
  storageBucket: "practicalshare.firebasestorage.app",
  messagingSenderId: "445035892666",
  appId: "1:445035892666:web:3ba42403f56463748f9783",
  measurementId: "G-Z68Q3R0Y2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

export { storage, database, ref, get, set, onValue };
