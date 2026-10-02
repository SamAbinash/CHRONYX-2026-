/**
 * IndexedDB Helper for CHRONYX 2026
 * Provides robust client-side storage for registration records and large payment screenshots
 * without hitting the ~5MB LocalStorage quota limit.
 */

const DB_NAME = 'chronyx_2026_db';
const DB_VERSION = 1;
const STORE_REGISTRATIONS = 'registrations';
const STORE_SCREENSHOTS = 'payment_screenshots';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_REGISTRATIONS)) {
        db.createObjectStore(STORE_REGISTRATIONS, { keyPath: 'registration_id' });
      }
      if (!db.objectStoreNames.contains(STORE_SCREENSHOTS)) {
        db.createObjectStore(STORE_SCREENSHOTS, { keyPath: 'registration_id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.warn('IndexedDB failed to open, falling back to LocalStorage', request.error);
      resolve(null);
    };
  });
}

export async function idbSaveRegistration(registration) {
  try {
    const db = await openDatabase();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction([STORE_REGISTRATIONS], 'readwrite');
      const store = tx.objectStore(STORE_REGISTRATIONS);
      const req = store.put(registration);

      req.onsuccess = () => resolve(true);
      req.onerror = () => {
        console.warn('idbSaveRegistration failed', req.error);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('idbSaveRegistration error', err);
    return false;
  }
}

export async function idbSaveScreenshot(registrationId, screenshotData) {
  try {
    const db = await openDatabase();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction([STORE_SCREENSHOTS], 'readwrite');
      const store = tx.objectStore(STORE_SCREENSHOTS);
      const req = store.put({
        registration_id: registrationId,
        ...screenshotData,
        saved_at: new Date().toISOString()
      });

      req.onsuccess = () => resolve(true);
      req.onerror = () => {
        console.warn('idbSaveScreenshot failed', req.error);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('idbSaveScreenshot error', err);
    return false;
  }
}

export async function idbGetScreenshot(registrationId) {
  try {
    const db = await openDatabase();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction([STORE_SCREENSHOTS], 'readonly');
      const store = tx.objectStore(STORE_SCREENSHOTS);
      const req = store.get(registrationId);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

export async function idbGetAllRegistrations() {
  try {
    const db = await openDatabase();
    if (!db) return [];

    return new Promise((resolve) => {
      const tx = db.transaction([STORE_REGISTRATIONS], 'readonly');
      const store = tx.objectStore(STORE_REGISTRATIONS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    return [];
  }
}
