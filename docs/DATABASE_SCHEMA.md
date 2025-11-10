# BelleBook Database Schema

## Overview

BelleBook uses Firebase Firestore as the primary database. This document describes the collections and their structure.

## Collections

### users

Stores user profiles for both customers and service providers.

```typescript
{
  id: string;
  email: string;
  displayName?: string;
  role: 'customer' | 'provider' | 'admin';
  avatarUrl?: string;
  timezone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**

- `email` (unique)
- `role`

---

### service_styles

Catalog of beauty services and styles offered by providers.

```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**

- `categoryId`
- `categoryId + likes` (composite, for sorting by popularity)

---

### appointments

Booking records linking customers, providers, and services.

```typescript
{
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  scheduledAt: Timestamp;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentMethod?: 'pay_now' | 'pay_on_site';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  totalAmount: number;
  discount: number;
  timezone: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**

- `customerId + scheduledAt` (composite)
- `providerId + scheduledAt` (composite)
- `status`

---

### favorites

User favorites for quick access to preferred services.

```typescript
{
  id: string;
  userId: string;
  serviceId: string;
  createdAt: Timestamp;
}
```

**Indexes:**

- `userId + serviceId` (composite, unique)

---

### categories

Service categories for organizing the catalog.

```typescript
{
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  order: number;
}
```

---

### payment_methods

Stored payment methods for users (tokenized via Stripe).

```typescript
{
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: Timestamp;
}
```

---

## Security Rules

See `apps/api/firestore.rules` for detailed security rules.

### Key Principles:

- Users can only read/write their own data
- Providers can manage their services and view their appointments
- Service catalog is publicly readable
- Appointments are only visible to the customer and provider involved
