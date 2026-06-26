/**
 * Portfolio Store
 * Reads from localStorage (admin overrides) first, then falls back to default portfolioData.js
 * This allows the admin panel to update data without touching code.
 */

import {
  developerInfo as defaultInfo,
  skills as defaultSkills,
  projects as defaultProjects,
  experience as defaultExperience,
  stats as defaultStats,
} from '../data/portfolioData';

const STORE_KEY = 'portfolio_admin_data';
const DB_NAME = 'PortfolioDatabase';
const STORE_NAME = 'settings';
const DATA_KEY = 'admin_data';

let db = null;
let globalStore = {};

// Fallback to localStorage data if it exists, to migrate user's existing data
function getLocalStorageStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Initialize IndexedDB
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
    getReq.onsuccess = () => {
      let data = getReq.result;
      if (!data) {
        // If IndexedDB is empty, migrate from localStorage
        const localData = getLocalStorageStore();
        if (Object.keys(localData).length > 0) {
          data = localData;
          // Save to IndexedDB
          const writeTx = db.transaction(STORE_NAME, 'readwrite');
          writeTx.objectStore(STORE_NAME).put(data, DATA_KEY);
        } else {
          data = {};
        }
      }
      globalStore = data;
      window.dispatchEvent(new CustomEvent('portfolio-updated'));
    };
  };
} catch (err) {
  console.error('Failed to init IndexedDB, falling back to localStorage:', err);
  globalStore = getLocalStorageStore();
}

function getStore() {
  return globalStore;
}

export function saveStore(partial) {
  const current = getStore();
  const updated = { ...current, ...partial };
  globalStore = updated; // Update synchronously for instant UI updates

  // Write to IndexedDB asynchronously
  if (db) {
    try {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(updated, DATA_KEY);
    } catch (err) {
      console.error('Failed to save to IndexedDB:', err);
    }
  }

  // Try backup in localStorage
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(updated));
  } catch (err) {
    // Silently ignore quota exceeded since we are using IndexedDB as primary
    console.warn('LocalStorage backup quota exceeded, using IndexedDB as primary store.');
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
  window.dispatchEvent(new CustomEvent('portfolio-updated'));
}

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
