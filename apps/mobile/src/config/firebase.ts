import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { firebaseConfig, useEmulator, emulatorConfig } from './firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators if enabled (for local development)
if (useEmulator && __DEV__) {
  try {
    connectAuthEmulator(auth, `http://${emulatorConfig.auth.host}:${emulatorConfig.auth.port}`);
    connectFirestoreEmulator(db, emulatorConfig.firestore.host, emulatorConfig.firestore.port);
    connectStorageEmulator(storage, emulatorConfig.storage.host, emulatorConfig.storage.port);
    console.log('🔧 Connected to Firebase Emulators');
  } catch (error) {
    console.warn('Failed to connect to emulators:', error);
  }
}

export default app;
