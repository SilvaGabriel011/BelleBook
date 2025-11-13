/**
 * Firebase Configuration
 *
 * IMPORTANT: This file contains placeholder values.
 * Replace these with your actual Firebase project credentials.
 *
 * To get your Firebase config:
 * 1. Go to https://console.firebase.google.com/
 * 2. Select your project (or create a new one)
 * 3. Go to Project Settings (gear icon)
 * 4. Scroll down to "Your apps" section
 * 5. Click on the web app (</>) or create one
 * 6. Copy the firebaseConfig object
 */

export const firebaseConfig = {
  // Replace these values with your actual Firebase project config
  apiKey: 'AIzaSyDemoKey-Replace-With-Your-Actual-Key',
  authDomain: 'bellebook-demo.firebaseapp.com',
  projectId: 'bellebook-demo',
  storageBucket: 'bellebook-demo.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890',
};

// For development, you can use Firebase Emulator Suite
export const useEmulator = false;

export const emulatorConfig = {
  auth: {
    host: 'localhost',
    port: 9099,
  },
  firestore: {
    host: 'localhost',
    port: 8080,
  },
  storage: {
    host: 'localhost',
    port: 9199,
  },
};
