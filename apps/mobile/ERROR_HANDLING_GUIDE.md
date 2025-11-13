# BelleBook Error Handling Guide

## 📋 Overview

This guide explains the comprehensive error handling system implemented in BelleBook. The system provides:

- **Structured Error Codes** - Every error has a unique code for tracking
- **User-Friendly Messages** - Clear, actionable messages for users
- **Technical Details** - Detailed information for developers
- **Error Logging** - Automatic logging with context
- **Error Boundaries** - React component error catching
- **Firebase Integration** - Automatic mapping of Firebase errors

---

## 🏗️ Architecture

```
src/errors/
├── errorTypes.ts      # Error enums and interfaces
├── errorMapping.ts    # Error code to message mapping
├── errorHandler.ts    # Core error handling logic
├── errorLogger.ts     # Error logging service
└── index.ts          # Central exports

src/components/
└── ErrorBoundary.tsx  # React Error Boundary component
```

---

## 🔢 Error Code Structure

Errors are organized by category with numeric ranges:

| Category | Range | Example |
|----------|-------|---------|
| Authentication | 1000-1099 | AUTH_1001 |
| Authorization | 1100-1199 | AUTHZ_1101 |
| Network | 2000-2099 | NET_2001 |
| Database | 3000-3099 | DB_3001 |
| Validation | 4000-4099 | VAL_4001 |
| Not Found | 5000-5099 | NF_5001 |
| Server | 6000-6099 | SRV_6001 |
| Payment | 7000-7099 | PAY_7001 |
| Booking | 8000-8099 | BKG_8001 |
| File Upload | 9000-9099 | FILE_9001 |

---

## 📚 Complete Error Reference

### Authentication Errors (1000-1099)

| Code | User Message | When It Occurs |
|------|--------------|----------------|
| `AUTH_1001` | Invalid email or password | Wrong credentials during login |
| `AUTH_1002` | No account found | User doesn't exist |
| `AUTH_1003` | Email already exists | Signup with existing email |
| `AUTH_1004` | Password too weak | Password doesn't meet requirements |
| `AUTH_1005` | Session expired | JWT token expired |
| `AUTH_1006` | Login required | Unauthorized access attempt |
| `AUTH_1008` | Account disabled | User account was disabled |
| `AUTH_1009` | Too many attempts | Rate limit exceeded |

### Network Errors (2000-2099)

| Code | User Message | When It Occurs |
|------|--------------|----------------|
| `NET_2001` | No internet connection | Device is offline |
| `NET_2002` | Request timed out | Network timeout |
| `NET_2003` | Failed to connect | Connection failed |

### Database Errors (3000-3099)

| Code | User Message | When It Occurs |
|------|--------------|----------------|
| `DB_3001` | Cannot connect to database | Firestore connection failed |
| `DB_3002` | Failed to retrieve data | Query execution failed |
| `DB_3003` | Item not found | Document doesn't exist |
| `DB_3004` | Permission denied | Security rules denied access |
| `DB_3006` | Operation failed | Transaction failed |

### Validation Errors (4000-4099)

| Code | User Message | When It Occurs |
|------|--------------|----------------|
| `VAL_4001` | Fill in required fields | Missing required data |
| `VAL_4002` | Invalid email address | Email format invalid |
| `VAL_4003` | Invalid phone number | Phone format invalid |
| `VAL_4004` | Invalid date | Date format invalid |
| `VAL_4007` | Invalid format | General format error |

### Booking Errors (8000-8099)

| Code | User Message | When It Occurs |
|------|--------------|----------------|
| `BKG_8001` | Time slot unavailable | Slot already booked |
| `BKG_8003` | Cannot book past dates | Date is in the past |
| `BKG_8004` | Cancellation failed | Cannot cancel booking |

---

## 💻 Usage Examples

### 1. Basic Error Handling

```typescript
import { errorHandler, AppError, ErrorCode } from '@/errors';

try {
  await someOperation();
} catch (error) {
  const appError = errorHandler.handle(error);
  
  // Show user-friendly message
  alert(appError.userMessage);
  
  // Log technical details
  console.error(appError.technicalMessage);
}
```

### 2. Creating Custom Errors

```typescript
import { AppError, ErrorCode } from '@/errors';

// Throw a specific error
throw new AppError(ErrorCode.BOOKING_SLOT_UNAVAILABLE);

// With additional context
throw new AppError(
  ErrorCode.AUTH_INVALID_CREDENTIALS,
  originalError,
  { userId: '123', attemptNumber: 3 }
);
```

### 3. Using Error Boundary

```typescript
import { ErrorBoundary } from '@/errors';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}

// With custom fallback
function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <CustomErrorScreen error={error} onReset={reset} />
      )}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### 4. Wrapping Async Functions

```typescript
import { withErrorHandling } from '@/errors';

const fetchUserData = withErrorHandling(
  async (userId: string) => {
    const response = await api.getUser(userId);
    return response.data;
  },
  { operation: 'fetchUserData' }
);

// Use it
try {
  const user = await fetchUserData('123');
} catch (error) {
  // Error is automatically wrapped in AppError
  console.error(error.code, error.userMessage);
}
```

### 5. Safe Execution with Fallback

```typescript
import { safeExecute } from '@/errors';

const userData = await safeExecute(
  () => fetchUserData(),
  null, // fallback value
  { userId: '123' }
);

// userData will be null if error occurs
```

### 6. Firebase Error Handling

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { errorHandler } from '@/errors';

try {
  await signInWithEmailAndPassword(auth, email, password);
} catch (error) {
  const appError = errorHandler.handle(error);
  
  // Firebase errors are automatically mapped
  // auth/wrong-password becomes AUTH_INVALID_CREDENTIALS
  alert(appError.userMessage);
}
```

---

## 🔍 Error Logging

### Accessing Logs

```typescript
import { errorLogger } from '@/errors';

// Get all logs
const logs = errorLogger.getLogs();

// Get logs by severity
const criticalLogs = errorLogger.getLogsBySeverity(ErrorSeverity.CRITICAL);

// Get logs by code
const authLogs = errorLogger.getLogsByCode(ErrorCode.AUTH_INVALID_CREDENTIALS);

// Get statistics
const stats = errorLogger.getStats();
console.log(stats);
// {
//   total: 42,
//   bySeverity: { CRITICAL: 2, HIGH: 8, MEDIUM: 20, LOW: 12 },
//   byCode: { 'AUTH_1001': 5, 'NET_2001': 3, ... },
//   recent: [...]
// }

// Export logs
const jsonLogs = errorLogger.exportLogs();
```

### Debug in Browser Console

```javascript
// In browser console (web only)
window.errorLogger.getLogs()
window.errorLogger.getStats()
window.errorLogger.clearLogs()
```

---

## 🎨 Error Severity Levels

| Level | Description | Example Use Case |
|-------|-------------|------------------|
| **LOW** | Minor issue, app fully functional | Invalid format in optional field |
| **MEDIUM** | Feature impacted, app still usable | Login failed, retry possible |
| **HIGH** | Critical feature broken | Payment processing failed |
| **CRITICAL** | App unusable | Database connection lost |

---

## 🔄 Firebase Error Mapping

Firebase errors are automatically mapped to our error codes:

| Firebase Error | Maps To | Our Code |
|----------------|---------|----------|
| `auth/invalid-email` | Validation | `VAL_4002` |
| `auth/user-not-found` | Authentication | `AUTH_1002` |
| `auth/wrong-password` | Authentication | `AUTH_1001` |
| `auth/email-already-in-use` | Authentication | `AUTH_1003` |
| `auth/weak-password` | Authentication | `AUTH_1004` |
| `auth/too-many-requests` | Authentication | `AUTH_1009` |
| `permission-denied` | Database | `DB_3004` |
| `unavailable` | Server | `SRV_6002` |

---

## 🛠️ Best Practices

### 1. Always Handle Errors

```typescript
// ❌ Bad
async function fetchData() {
  const data = await api.getData();
  return data;
}

// ✅ Good
async function fetchData() {
  try {
    const data = await api.getData();
    return data;
  } catch (error) {
    throw errorHandler.handle(error, { operation: 'fetchData' });
  }
}
```

### 2. Provide Context

```typescript
// ❌ Bad
throw errorHandler.handle(error);

// ✅ Good
throw errorHandler.handle(error, {
  userId: currentUser.id,
  operation: 'createBooking',
  bookingId: booking.id,
  timestamp: new Date().toISOString(),
});
```

### 3. Use Appropriate Error Codes

```typescript
// ❌ Bad
throw new AppError(ErrorCode.UNKNOWN_ERROR);

// ✅ Good
throw new AppError(ErrorCode.BOOKING_SLOT_UNAVAILABLE);
```

### 4. Show User-Friendly Messages

```typescript
// ❌ Bad
alert(error.stack);

// ✅ Good
alert(error.userMessage);
if (error.suggestedAction) {
  console.log('Suggestion:', error.suggestedAction);
}
```

### 5. Log Technical Details

```typescript
// ❌ Bad
console.log('Error happened');

// ✅ Good
console.error('Error:', {
  code: error.code,
  category: error.category,
  severity: error.severity,
  technicalMessage: error.technicalMessage,
  stack: error.stack,
});
```

---

## 🧪 Testing Error Handling

### Test Error Scenarios

```typescript
import { AppError, ErrorCode } from '@/errors';

describe('Error Handling', () => {
  it('should handle authentication errors', () => {
    const error = new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS);
    expect(error.userMessage).toBe('Invalid email or password. Please try again.');
    expect(error.severity).toBe(ErrorSeverity.MEDIUM);
  });

  it('should map Firebase errors', () => {
    const firebaseError = new Error();
    (firebaseError as any).code = 'auth/user-not-found';
    
    const appError = errorHandler.handle(firebaseError);
    expect(appError.code).toBe(ErrorCode.AUTH_USER_NOT_FOUND);
  });
});
```

---

## 📊 Monitoring & Analytics

### Track Error Patterns

```typescript
import { errorLogger } from '@/errors';

// Get error frequency
setInterval(() => {
  const stats = errorLogger.getStats();
  
  // Send to analytics
  analytics.track('error_stats', {
    total: stats.total,
    critical: stats.bySeverity.CRITICAL,
    high: stats.bySeverity.HIGH,
  });
}, 60000); // Every minute
```

### Alert on Critical Errors

```typescript
import { errorHandler, ErrorSeverity } from '@/errors';

// Global error handler
window.addEventListener('error', (event) => {
  const appError = errorHandler.handle(event.error);
  
  if (appError.severity === ErrorSeverity.CRITICAL) {
    // Alert admin
    alertAdmin(appError);
  }
});
```

---

## 🚀 Quick Reference

### Import What You Need

```typescript
// Types and enums
import { ErrorCode, ErrorCategory, ErrorSeverity } from '@/errors';

// Error handling
import { errorHandler, AppError } from '@/errors';

// Error logging
import { errorLogger } from '@/errors';

// React component
import { ErrorBoundary } from '@/errors';

// Utilities
import { withErrorHandling, safeExecute } from '@/errors';
```

---

## 📞 Support

For questions or issues with the error handling system:
- Check the error code in this guide
- Review error logs: `errorLogger.getLogs()`
- Check browser console for detailed stack traces
- Contact the development team with error codes and context

---

**Last Updated:** November 2025  
**Version:** 1.0.0
