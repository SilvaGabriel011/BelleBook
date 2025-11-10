# BelleBook

> Beauty Services Booking Platform

BelleBook is a mobile-first platform that connects beauty service customers with professional service providers, enabling seamless booking, payment processing, and calendar synchronization.

## 🌟 Features

- **Service Catalog**: Browse categorized beauty services with images, pricing, and ratings
- **Smart Booking**: Real-time provider availability with timezone support
- **Flexible Payments**: Pay now (10% discount) or pay on-site via Stripe
- **Calendar Sync**: Automatic Google Calendar integration for providers and customers
- **User Profiles**: Manage bookings, payment methods, and preferences
- **Favorites**: Save preferred services for quick access

## 🏗️ Architecture

### Tech Stack

**Mobile App**
- React Native with Expo
- TypeScript
- Redux for state management
- React Navigation

**Backend**
- Firebase Cloud Functions
- Firestore (NoSQL database)
- Firebase Authentication (JWT)
- Firebase Cloud Storage

**Integrations**
- Stripe for payments
- Google Calendar API
- Sentry for monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Firebase CLI
- Expo CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/SilvaGabriel011/BelleBook.git
cd BelleBook

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Start Firebase emulators
npm run api

# In another terminal, start mobile app
npm run mobile
```

For detailed setup instructions, see [SETUP.md](./docs/SETUP.md).

## 📁 Project Structure

```
BelleBook/
├── apps/
│   ├── mobile/          # React Native mobile app
│   └── api/             # Firebase Cloud Functions
├── docs/                # Documentation
├── scripts/             # Build scripts
├── tests/               # Shared tests
└── package.json         # Monorepo root
```

## 🧪 Development

```bash
# Run linting
npm run lint

# Run tests
npm test

# Type checking
npm run type-check

# Format code
npm run format
```

## 📚 Documentation

- [Setup Guide](./docs/SETUP.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Implementation Plan](../BelleBook_Implementation_Plan.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🗺️ Roadmap

### Milestone 1: Setup ✅
- [x] Repository structure
- [x] Development environment
- [x] CI/CD pipeline
- [x] Database schema

### Milestone 2: Authentication (In Progress)
- [ ] User signup/login
- [ ] Passwordless authentication
- [ ] Session management
- [ ] Profile basics

### Milestone 3: Catalog
- [ ] Service browsing
- [ ] Categories
- [ ] Favorites
- [ ] Search and filters

### Milestone 4: Booking
- [ ] Provider selection
- [ ] Date/time picker
- [ ] Booking confirmation
- [ ] Payment integration

### Milestone 5: Integrations
- [ ] Google Calendar sync
- [ ] Stripe payments
- [ ] Webhooks

### Milestone 6: User Management
- [ ] Booking history
- [ ] Cancel/reschedule
- [ ] Payment methods
- [ ] Notifications

### Milestone 7: Documentation
- [ ] API documentation
- [ ] OpenAPI spec
- [ ] Deployment guides

### Milestone 8: Production
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Monitoring
- [ ] Launch

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

- **Product Owner**: Gabriel Silva (@SilvaGabriel011)
- **Development**: BelleBook Team

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: pedrogabriieell@gmail.com

---

Built with ❤️ by the BelleBook Team
