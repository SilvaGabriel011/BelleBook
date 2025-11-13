/**
 * BelleBook Error Handling System
 * 
 * Central export for all error handling functionality
 */

// Error Types & Codes
export {
  ErrorCode,
  ErrorCategory,
  ErrorSeverity,
  type ErrorDetails,
} from './errorTypes';

// Error Mapping
export { ERROR_MAP, FIREBASE_ERROR_MAP } from './errorMapping';

// Error Handler
export {
  errorHandler,
  AppError,
  withErrorHandling,
  safeExecute,
} from './errorHandler';

// Error Logger
export { errorLogger } from './errorLogger';

// Error Boundary Component (for React)
export { default as ErrorBoundary } from '../components/ErrorBoundary';
