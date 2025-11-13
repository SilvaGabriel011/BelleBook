# BelleBook Error Handling System

## 🎯 What's Included

A comprehensive error handling system with:

✅ **80+ Error Codes** - Organized by category with unique codes  
✅ **User-Friendly Messages** - Clear messages users can understand  
✅ **Technical Details** - Detailed info for developers  
✅ **Automatic Logging** - All errors logged with context  
✅ **React Error Boundary** - Catches component errors  
✅ **Firebase Integration** - Auto-maps Firebase errors  

## 📁 Files Created

```
src/errors/
├── errorTypes.ts       # Error enums & interfaces
├── errorMapping.ts     # Error code → message mapping
├── errorHandler.ts     # Core error handling
├── errorLogger.ts      # Logging service
├── index.ts           # Central exports
└── README.md          # This file

src/components/
└── ErrorBoundary.tsx   # React error catcher

ERROR_HANDLING_GUIDE.md # Complete documentation
```

## 🚀 Quick Start

### 1. Basic Usage

```typescript
import { errorHandler, ErrorCode, AppError } from '@/errors';

try {
  await riskyOperation();
} catch (error) {
  const appError = errorHandler.handle(error);
  alert(appError.userMessage);
  console.error(appError.code, appError.technicalMessage);
}
```

### 2. Throw Custom Errors

```typescript
import { AppError, ErrorCode } from '@/errors';

throw new AppError(ErrorCode.BOOKING_SLOT_UNAVAILABLE);
```

### 3. Use Error Boundary (Already Added to App.tsx)

```typescript
import { ErrorBoundary } from '@/errors';

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

## 📊 Error Categories

| Category | Code Range | Examples |
|----------|-----------|----------|
| Authentication | 1000-1099 | AUTH_1001, AUTH_1002 |
| Network | 2000-2099 | NET_2001, NET_2002 |
| Database | 3000-3099 | DB_3001, DB_3003 |
| Validation | 4000-4099 | VAL_4001, VAL_4002 |
| Booking | 8000-8099 | BKG_8001, BKG_8003 |
| Payment | 7000-7099 | PAY_7001, PAY_7004 |

## 🔍 View Error Logs

```typescript
import { errorLogger } from '@/errors';

// Get all errors
errorLogger.getLogs()

// Get statistics
errorLogger.getStats()

// Export to JSON
errorLogger.exportLogs()
```

### In Browser Console (Web Only)

```javascript
window.errorLogger.getLogs()
window.errorLogger.getStats()
```

## 📖 Full Documentation

See `ERROR_HANDLING_GUIDE.md` for:
- Complete error code reference (80+ errors)
- Usage examples
- Best practices
- Testing guide
- Firebase error mapping

## 💡 Examples

### Login Error Handling

```typescript
try {
  await signInWithEmailAndPassword(auth, email, password);
} catch (error) {
  const appError = errorHandler.handle(error);
  
  switch (appError.code) {
    case ErrorCode.AUTH_INVALID_CREDENTIALS:
      setError('Wrong email or password');
      break;
    case ErrorCode.AUTH_USER_NOT_FOUND:
      setError('No account found');
      break;
    default:
      setError(appError.userMessage);
  }
}
```

### Booking Error Handling

```typescript
try {
  await createBooking(bookingData);
} catch (error) {
  const appError = errorHandler.handle(error);
  
  if (appError.code === ErrorCode.BOOKING_SLOT_UNAVAILABLE) {
    alert('This time slot is no longer available. Please select another.');
  } else {
    alert(appError.userMessage);
  }
}
```

## 🎨 Error Severity

- **LOW** - Minor issue, app works fine
- **MEDIUM** - Feature impacted but usable  
- **HIGH** - Critical feature broken
- **CRITICAL** - App unusable

## 🔗 Integration Status

✅ ErrorBoundary added to App.tsx  
✅ Firebase error mapping configured  
✅ Error logging active  
✅ Web console debugging enabled  

## 🛠️ Maintenance

### Adding New Error Codes

1. Add to `errorTypes.ts`:
```typescript
export enum ErrorCode {
  YOUR_NEW_ERROR = 'CAT_1234',
}
```

2. Add mapping in `errorMapping.ts`:
```typescript
[ErrorCode.YOUR_NEW_ERROR]: {
  code: ErrorCode.YOUR_NEW_ERROR,
  category: ErrorCategory.YOUR_CATEGORY,
  severity: ErrorSeverity.MEDIUM,
  userMessage: 'User-friendly message',
  technicalMessage: 'Technical details',
  suggestedAction: 'What user should do',
}
```

3. Use it:
```typescript
throw new AppError(ErrorCode.YOUR_NEW_ERROR);
```

## 📞 Support

- Check `ERROR_HANDLING_GUIDE.md` for detailed docs
- View logs: `errorLogger.getLogs()`
- Debug in console: `window.errorLogger` (web only)

---

**Version:** 1.0.0  
**Last Updated:** November 2025
