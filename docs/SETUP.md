# BelleBook Setup Guide

## Prerequisites

- Node.js 18+ and npm 9+
- Firebase CLI (`npm install -g firebase-tools`)
- Expo CLI (`npm install -g expo-cli`)
- Git

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SilvaGabriel011/BelleBook.git
cd BelleBook
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces (mobile app and API).

### 3. Environment Configuration

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

- **Firebase Configuration**: Get from Firebase Console
  - `FIREBASE_API_KEY`
  - `FIREBASE_AUTH_DOMAIN`
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_STORAGE_BUCKET`
  - `FIREBASE_MESSAGING_SENDER_ID`
  - `FIREBASE_APP_ID`

- **Stripe Configuration**: Get from Stripe Dashboard
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`

- **Google Calendar API**: Get from Google Cloud Console
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_REDIRECT_URI`

- **Sentry** (optional): Get from Sentry Dashboard
  - `SENTRY_DSN`
  - `SENTRY_AUTH_TOKEN`

### 4. Firebase Setup

#### Login to Firebase

```bash
firebase login
```

#### Initialize Firebase Project

```bash
cd apps/api
firebase use --add
```

Select your Firebase project and give it an alias (e.g., `default`).

#### Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 5. Start Development

#### Start Firebase Emulators (API)

```bash
npm run api
```

This will start:

- Functions emulator on port 5001
- Firestore emulator on port 8080
- Auth emulator on port 9099
- Storage emulator on port 9199
- Emulator UI on port 4000

#### Start Mobile App

In a new terminal:

```bash
npm run mobile
```

This will start the Expo development server. You can then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Development Workflow

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run type-check
```

### Formatting

```bash
npm run format
npm run format:check
```

## Project Structure

```
BelleBook/
├── apps/
│   ├── mobile/          # React Native mobile app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── screens/
│   │   │   ├── navigation/
│   │   │   ├── store/
│   │   │   ├── services/
│   │   │   └── config/
│   │   └── App.tsx
│   └── api/             # Firebase Cloud Functions
│       ├── src/
│       │   ├── functions/
│       │   ├── services/
│       │   ├── middleware/
│       │   └── config/
│       └── firestore.rules
├── docs/                # Documentation
├── scripts/             # Build and utility scripts
├── tests/               # Shared tests
└── package.json         # Root package.json
```

## Troubleshooting

### Firebase Emulators Won't Start

- Make sure ports 5001, 8080, 9099, 9199, and 4000 are not in use
- Try `firebase emulators:start --only functions,firestore,auth,storage`

### Mobile App Won't Connect to API

- Check that Firebase emulators are running
- Update `API_URL` in `.env` to point to emulator (usually `http://localhost:5001`)
- For physical devices, use your computer's IP address instead of `localhost`

### Dependencies Installation Fails

- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Next Steps

1. Review the [Database Schema](./DATABASE_SCHEMA.md)
2. Check the [API Documentation](./API.md)
3. Read the [Contributing Guidelines](../CONTRIBUTING.md)
4. Review the [Implementation Plan](../../BelleBook_Implementation_Plan.md)
