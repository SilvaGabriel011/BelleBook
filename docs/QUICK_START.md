# 🚀 BelleBook Quick Start

## ⚠️ IMPORTANT: Firebase Configuration Required

Your app is currently showing a Firebase error because credentials haven't been configured yet.

## 📝 Follow These Steps:

### 1️⃣ Get Firebase Credentials (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Click the **</>** icon to register a web app
4. **Copy the firebaseConfig object**

### 2️⃣ Update Configuration

Open this file:
```
apps/mobile/src/config/firebase.config.ts
```

Replace these values with your actual Firebase credentials:
```typescript
export const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123",
};
```

### 3️⃣ Enable Firebase Services

In Firebase Console:

**Authentication:**
- Go to Authentication → Get Started
- Enable Email/Password

**Firestore:**
- Go to Firestore Database → Create Database
- Start in test mode

**Storage:**
- Go to Storage → Get Started
- Start in test mode

### 4️⃣ Restart the App

```bash
# Stop the current server (Ctrl+C)
npm run web
```

---

## ✅ That's It!

The error should be gone and your app will work.

For detailed instructions, see: `apps/mobile/FIREBASE_SETUP.md`

---

## 🎨 Design Reference

Your app should look like the Espaço Laser examples you provided, with:
- Sobrancelha (Eyebrows)
- Depilação (Hair Removal)
- Unha (Nails)

Design system and features are documented in the project memories.

---

## 📚 Documentation Created

- ✅ **Error Handling System** - Complete with 80+ error codes
- ✅ **Firebase Setup Guide** - Step-by-step instructions
- ✅ **Design Reference** - UI patterns saved in memory
- ✅ **Web-First Configuration** - Responsive design ready

---

## 🛠️ Next Steps After Firebase Setup

1. **Test the app** - Make sure authentication works
2. **Review design system** - Check the UI reference
3. **Start building screens** - Based on the Espaço Laser design
4. **Add services** - Sobrancelha, Depilação, Unha

---

**Need help?** Check `FIREBASE_SETUP.md` for detailed instructions!
