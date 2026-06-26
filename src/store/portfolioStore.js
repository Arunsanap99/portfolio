/**
 * Portfolio Store
 * Reads from localStorage (admin overrides) first, then falls back to default portfolioData.js
 * Syncs with Firebase for cross-device data sharing
 */

import {
  developerInfo as defaultInfo,
  skills as defaultSkills,
  projects as defaultProjects,
  experience as defaultExperience,
  stats as defaultStats,
} from '../data/portfolioData';
import { storage, database, ref, get, set, onValue } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const STORE_KEY = 'portfolio_admin_data';
const DB_NAME = 'PortfolioDatabase';
const STORE_NAME = 'settings';
const DATA_KEY = 'admin_data';

let db = null;
let globalStore = {};
let isFirebaseEnabled = false; // Set to false if you don't want to use Firebase

// Fallback to localStorage data if it exists, to migrate user's existing data
function getLocalStorageStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Initialize IndexedDB and Firebase listener
try {
  const dbRequest = indexedDB.open(DB_NAME, 1);
  dbRequest.onupgradeneeded = (e) => {
    const database = e.target.result;
    if (!database.objectStoreNames.contains(STORE_NAME)) {
      database.createObjectStore(STORE_NAME);
    }
  };

  dbRequest.onsuccess = (e) => {
    db = e.target.result;

    // Read current data
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const getReq = store.get(DATA_KEY);
    getReq.onsuccess = async () => {
      let data = getReq.result;
      if (!data) {
        // If IndexedDB is empty, try to load from Firebase first
        if (isFirebaseEnabled) {
          try {
            const dbRef = ref(database, 'portfolioData');
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
              data = snapshot.val();
            }
          } catch (err) {
            console.warn('Failed to load data from Firebase:', err);
          }
        }
        // If still no data, try localStorage
        if (!data || Object.keys(data).length === 0) {
          const localData = getLocalStorageStore();
          if (Object.keys(localData).length > 0) {
            data = localData;
          } else {
            data = {};
          }
        }
      }
      globalStore = data;
      window.dispatchEvent(new CustomEvent('portfolio-updated'));
    };
  };

  // Set up Firebase real-time listener
  if (isFirebaseEnabled) {
    try {
      console.log('Setting up Firebase real-time listener...');
      const dbRef = ref(database, 'portfolioData');
      onValue(dbRef, (snapshot) => {
        console.log('Firebase data changed!');
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          console.log('Firebase data:', firebaseData);
          globalStore = firebaseData;
          
          // Save to IndexedDB
          if (db) {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.put(firebaseData, DATA_KEY);
          }
          
          // Save to localStorage
          try {
            localStorage.setItem(STORE_KEY, JSON.stringify(firebaseData));
          } catch (err) {
            console.warn('LocalStorage backup failed:', err);
          }
          
          window.dispatchEvent(new CustomEvent('portfolio-updated'));
        } else {
          console.log('No data in Firebase yet');
        }
      }, (err) => {
        console.error('Firebase listener error:', err);
      });
    } catch (err) {
      console.warn('Failed to set up Firebase listener:', err);
    }
  }
} catch (err) {
  console.error('Failed to init IndexedDB, falling back to localStorage:', err);
  globalStore = getLocalStorageStore();
}

function getStore() {
  return globalStore;
}

export function saveStore(partial) {
  console.log('saveStore called with partial:', partial);
  const current = getStore();
  const updated = { ...current, ...partial };
  globalStore = updated; // Update synchronously for instant UI updates
  console.log('Updated store:', updated);

  // Write to IndexedDB asynchronously
  if (db) {
    try {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(updated, DATA_KEY);
      console.log('Saved to IndexedDB');
    } catch (err) {
      console.error('Failed to save to IndexedDB:', err);
    }
  }

  // Try backup in localStorage
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(updated));
    console.log('Saved to localStorage');
  } catch (err) {
    console.warn('LocalStorage backup quota exceeded, using IndexedDB as primary store.');
  }

  // Sync to Firebase
  if (isFirebaseEnabled) {
    try {
      const dbRef = ref(database, 'portfolioData');
      console.log('Saving to Firebase at path: portfolioData');
      set(dbRef, updated).then(() => {
        console.log('Successfully saved to Firebase!');
      }).catch((err) => {
        console.error('Error saving to Firebase:', err);
      });
    } catch (err) {
      console.warn('Failed to sync to Firebase:', err);
    }
  }

  window.dispatchEvent(new CustomEvent('portfolio-updated'));
  return true;
}

export function resetStore() {
  globalStore = {};
  if (db) {
    try {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(DATA_KEY);
    } catch (err) {
      console.error('Failed to reset IndexedDB:', err);
    }
  }
  try {
    localStorage.removeItem(STORE_KEY);
  } catch { }
  if (isFirebaseEnabled) {
    try {
      const dbRef = ref(database, 'portfolioData');
      set(dbRef, {});
    } catch (err) {
      console.warn('Failed to reset Firebase:', err);
    }
  }
  window.dispatchEvent(new CustomEvent('portfolio-updated'));
}

export function exportData() {
  const dataStr = JSON.stringify(globalStore, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        globalStore = data;
        if (db) {
          try {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.put(data, DATA_KEY);
          } catch (err) {
            console.error('Failed to save to IndexedDB:', err);
          }
        }
        try {
          localStorage.setItem(STORE_KEY, JSON.stringify(data));
        } catch (err) {
          console.warn('LocalStorage backup failed:', err);
        }
        if (isFirebaseEnabled) {
          try {
            const dbRef = ref(database, 'portfolioData');
            set(dbRef, data);
          } catch (err) {
            console.warn('Failed to sync to Firebase:', err);
          }
        }
        window.dispatchEvent(new CustomEvent('portfolio-updated'));
        resolve();
      } catch (err) {
          }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Upload file to Firebase Storage (or fallback to DataURL)
export async function uploadFile(file, path) {
  if (isFirebaseEnabled) {
    console.log('Starting upload to Firebase Storage, path:', path);
    try {
      const fileRef = storageRef(storage, path);
      console.log('Uploading file...');
      await uploadBytes(fileRef, file);
      console.log('File uploaded, getting download URL...');
      const downloadURL = await getDownloadURL(fileRef);
      console.log('Got download URL:', downloadURL);
      return downloadURL;
    } catch (err) {
      console.error('Failed to upload to Firebase Storage, falling back to local upload:', err);
      // Fallback: return DataURL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  } else {
    // If Firebase is disabled, just return DataURL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Keep the old name for backwards compatibility
export const uploadFileToFirebase = uploadFile;

export function getDeveloperInfo() {
  const store = getStore();
  return store.developerInfo ? {
    ...defaultInfo,
    ...store.developerInfo,
    socials: {
      ...defaultInfo.socials,
      ...store.developerInfo.socials
    },
    emailjs: {
      ...defaultInfo.emailjs,
      ...store.developerInfo.emailjs
    }
  } : defaultInfo;
}

export function getSkills() {
  const store = getStore();
  return store.skills || defaultSkills;
}

export function getProjects() {
  const store = getStore();
  return store.projects || defaultProjects;
}

export function getExperience() {
  const store = getStore();
  return store.experience || defaultExperience;
}

export function getStats() {
  const store = getStore();
  return store.stats || defaultStats;
}

// Admin password (change this to whatever you want)
export const ADMIN_PASSWORD = 'arun@1212';
export const ADMIN_PATH = '/admin-arun-sanap1212';
