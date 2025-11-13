# Firebase Setup Guide for BelleBook

## 🔥 Getting Your Firebase Credentials

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter project name: **"BelleBook"**
4. Follow the setup wizard

### Step 2: Register Your Web App

1. In your Firebase project, click the **</>** (Web) icon
2. Register app with nickname: **"BelleBook Web"**
3. **Copy the firebaseConfig object** that appears
4. Click **"Continue to console"**

### Step 3: Configure Your App

Open `apps/mobile/src/config/firebase.config.ts` and replace the placeholder values:

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",              // From Firebase Console
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Enable these sign-in methods:
   - ✅ **Email/Password**
   - ✅ **Google** (optional, for social login)

### Step 5: Create Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to your users
5. Click **"Enable"**

### Step 6: Set Up Storage

1. Go to **Storage**
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Click **"Done"**

---

## 🔒 Security Rules (For Production)

### Firestore Rules

Replace test mode rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Services collection
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.customerId || 
         request.auth.uid == resource.data.providerId);
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /users/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Service images
    match /services/{serviceId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🧪 Local Development with Firebase Emulators (Optional)

### Install Firebase Tools

```bash
npm install -g firebase-tools
```

### Login to Firebase

```bash
firebase login
```

### Initialize Emulators

```bash
cd apps/mobile
firebase init emulators
```

Select:
- ✅ Authentication Emulator
- ✅ Firestore Emulator
- ✅ Storage Emulator

### Start Emulators

```bash
firebase emulators:start
```

### Enable Emulators in App

In `firebase.config.ts`, set:

```typescript
export const useEmulator = true;
```

---

## ✅ Verify Setup

1. **Restart the Expo server**:
   ```bash
   npm run web
   ```

2. **Check for errors** in the console

3. **Test authentication** by trying to sign up

4. **Verify Firestore** by checking the Firebase Console

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- ✅ **Fixed!** Make sure you updated `firebase.config.ts` with real credentials

### Error: "Firebase: Error (auth/project-not-found)"
- Check that `projectId` is correct
- Verify project exists in Firebase Console

### Error: "Firebase: Error (auth/network-request-failed)"
- Check your internet connection
- Verify Firebase project is active
- Check if Firebase services are down: [status.firebase.google.com](https://status.firebase.google.com)

### Error: "Missing permissions"
- Update Firestore security rules (see above)
- Make sure you're authenticated before accessing data

---

## 📱 Mobile App Configuration

For iOS/Android, you'll need additional setup:

### iOS
1. Download `GoogleService-Info.plist` from Firebase Console
2. Add to your iOS project

### Android
1. Download `google-services.json` from Firebase Console
2. Add to `android/app/` directory

---

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Status](https://status.firebase.google.com/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## 📝 Current Status

- ✅ Firebase config file created
- ✅ Config imported in app
- ⏳ **TODO: Add your Firebase credentials**
- ⏳ TODO: Enable Authentication
- ⏳ TODO: Create Firestore database
- ⏳ TODO: Set up Storage

---

**Need Help?** Check the Firebase Console or refer to the official documentation.
