import { ErrorCode, ErrorDetails, ErrorCategory, ErrorSeverity } from './errorTypes';

/**
 * Complete Error Mapping Dictionary
 * Maps error codes to user-friendly messages and technical details
 */
export const ERROR_MAP: Record<ErrorCode, ErrorDetails> = {
  // Authentication Errors
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: {
    code: ErrorCode.AUTH_INVALID_CREDENTIALS,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Invalid email or password. Please try again.',
    technicalMessage: 'Authentication failed: Invalid credentials',
    suggestedAction: 'Check your email and password and try again.',
  },
  [ErrorCode.AUTH_USER_NOT_FOUND]: {
    code: ErrorCode.AUTH_USER_NOT_FOUND,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'No account found with this email.',
    technicalMessage: 'User not found in database',
    suggestedAction: 'Please sign up for a new account.',
  },
  [ErrorCode.AUTH_EMAIL_ALREADY_EXISTS]: {
    code: ErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'An account with this email already exists.',
    technicalMessage: 'Email already registered',
    suggestedAction: 'Use a different email or try logging in.',
  },
  [ErrorCode.AUTH_WEAK_PASSWORD]: {
    code: ErrorCode.AUTH_WEAK_PASSWORD,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Password is too weak. Use a stronger password.',
    technicalMessage: 'Password does not meet security requirements',
    suggestedAction: 'Use 8+ characters with letters, numbers, and symbols.',
  },
  [ErrorCode.AUTH_TOKEN_EXPIRED]: {
    code: ErrorCode.AUTH_TOKEN_EXPIRED,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Your session has expired. Please log in again.',
    technicalMessage: 'JWT token expired',
    suggestedAction: 'Log in again to continue.',
  },
  [ErrorCode.AUTH_UNAUTHORIZED]: {
    code: ErrorCode.AUTH_UNAUTHORIZED,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'You need to be logged in to access this.',
    technicalMessage: 'Unauthorized access attempt',
    suggestedAction: 'Please log in to your account.',
  },
  [ErrorCode.AUTH_ACCOUNT_DISABLED]: {
    code: ErrorCode.AUTH_ACCOUNT_DISABLED,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Your account has been disabled.',
    technicalMessage: 'User account is disabled',
    suggestedAction: 'Contact support for assistance.',
  },
  [ErrorCode.AUTH_TOO_MANY_REQUESTS]: {
    code: ErrorCode.AUTH_TOO_MANY_REQUESTS,
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Too many login attempts. Try again later.',
    technicalMessage: 'Rate limit exceeded for authentication',
    suggestedAction: 'Wait a few minutes before trying again.',
  },

  // Authorization Errors
  [ErrorCode.AUTHZ_INSUFFICIENT_PERMISSIONS]: {
    code: ErrorCode.AUTHZ_INSUFFICIENT_PERMISSIONS,
    category: ErrorCategory.AUTHORIZATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: "You don't have permission to perform this action.",
    technicalMessage: 'User lacks required permissions',
    suggestedAction: 'Contact an administrator for access.',
  },
  [ErrorCode.AUTHZ_FORBIDDEN_RESOURCE]: {
    code: ErrorCode.AUTHZ_FORBIDDEN_RESOURCE,
    category: ErrorCategory.AUTHORIZATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Access to this resource is forbidden.',
    technicalMessage: 'Resource access denied',
    suggestedAction: 'You may not have access to this content.',
  },

  // Network Errors
  [ErrorCode.NETWORK_OFFLINE]: {
    code: ErrorCode.NETWORK_OFFLINE,
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    userMessage: 'No internet connection. Check your network.',
    technicalMessage: 'Device is offline',
    suggestedAction: 'Connect to WiFi or mobile data.',
  },
  [ErrorCode.NETWORK_TIMEOUT]: {
    code: ErrorCode.NETWORK_TIMEOUT,
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Request timed out. Please try again.',
    technicalMessage: 'Network request timeout',
    suggestedAction: 'Check your connection and retry.',
  },
  [ErrorCode.NETWORK_CONNECTION_FAILED]: {
    code: ErrorCode.NETWORK_CONNECTION_FAILED,
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Failed to connect to server.',
    technicalMessage: 'Network connection failed',
    suggestedAction: 'Check your internet connection.',
  },

  // Database Errors
  [ErrorCode.DB_CONNECTION_FAILED]: {
    code: ErrorCode.DB_CONNECTION_FAILED,
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.CRITICAL,
    userMessage: 'Unable to connect to database.',
    technicalMessage: 'Database connection failed',
    suggestedAction: 'The service may be temporarily unavailable.',
  },
  [ErrorCode.DB_QUERY_FAILED]: {
    code: ErrorCode.DB_QUERY_FAILED,
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Failed to retrieve data. Try again.',
    technicalMessage: 'Database query failed',
    suggestedAction: 'Refresh the page or try again.',
  },
  [ErrorCode.DB_DOCUMENT_NOT_FOUND]: {
    code: ErrorCode.DB_DOCUMENT_NOT_FOUND,
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'The requested item was not found.',
    technicalMessage: 'Document does not exist',
    suggestedAction: 'The item may have been deleted.',
  },
  [ErrorCode.DB_PERMISSION_DENIED]: {
    code: ErrorCode.DB_PERMISSION_DENIED,
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Permission denied to access this data.',
    technicalMessage: 'Firestore security rules denied access',
    suggestedAction: 'You may not have access to this content.',
  },
  [ErrorCode.DB_TRANSACTION_FAILED]: {
    code: ErrorCode.DB_TRANSACTION_FAILED,
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Operation failed. Please try again.',
    technicalMessage: 'Database transaction failed',
    suggestedAction: 'Retry the operation.',
  },

  // Validation Errors
  [ErrorCode.VALIDATION_REQUIRED_FIELD]: {
    code: ErrorCode.VALIDATION_REQUIRED_FIELD,
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Please fill in all required fields.',
    technicalMessage: 'Required field validation failed',
    suggestedAction: 'Complete all required fields.',
  },
  [ErrorCode.VALIDATION_INVALID_EMAIL]: {
    code: ErrorCode.VALIDATION_INVALID_EMAIL,
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Please enter a valid email address.',
    technicalMessage: 'Email format validation failed',
    suggestedAction: 'Use format: example@email.com',
  },
  [ErrorCode.VALIDATION_INVALID_PHONE]: {
    code: ErrorCode.VALIDATION_INVALID_PHONE,
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Please enter a valid phone number.',
    technicalMessage: 'Phone number format validation failed',
    suggestedAction: 'Include country code and phone number.',
  },
  [ErrorCode.VALIDATION_INVALID_DATE]: {
    code: ErrorCode.VALIDATION_INVALID_DATE,
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Please enter a valid date.',
    technicalMessage: 'Date format validation failed',
    suggestedAction: 'Select a date from the calendar.',
  },
  [ErrorCode.VALIDATION_INVALID_FORMAT]: {
    code: ErrorCode.VALIDATION_INVALID_FORMAT,
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Invalid format. Check your input.',
    technicalMessage: 'Format validation failed',
    suggestedAction: 'Follow the required format.',
  },

  // Not Found Errors
  [ErrorCode.NOT_FOUND_USER]: {
    code: ErrorCode.NOT_FOUND_USER,
    category: ErrorCategory.NOT_FOUND,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'User not found.',
    technicalMessage: 'User document not found',
    suggestedAction: 'The user may have been deleted.',
  },
  [ErrorCode.NOT_FOUND_SERVICE]: {
    code: ErrorCode.NOT_FOUND_SERVICE,
    category: ErrorCategory.NOT_FOUND,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Service not found.',
    technicalMessage: 'Service document not found',
    suggestedAction: 'This service may no longer be available.',
  },
  [ErrorCode.NOT_FOUND_BOOKING]: {
    code: ErrorCode.NOT_FOUND_BOOKING,
    category: ErrorCategory.NOT_FOUND,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Booking not found.',
    technicalMessage: 'Booking document not found',
    suggestedAction: 'The booking may have been cancelled.',
  },
  [ErrorCode.NOT_FOUND_PAGE]: {
    code: ErrorCode.NOT_FOUND_PAGE,
    category: ErrorCategory.NOT_FOUND,
    severity: ErrorSeverity.LOW,
    userMessage: 'Page not found.',
    technicalMessage: '404 - Page does not exist',
    suggestedAction: 'Return to the home page.',
  },

  // Server Errors
  [ErrorCode.SERVER_INTERNAL_ERROR]: {
    code: ErrorCode.SERVER_INTERNAL_ERROR,
    category: ErrorCategory.SERVER,
    severity: ErrorSeverity.CRITICAL,
    userMessage: 'Something went wrong. Try again later.',
    technicalMessage: '500 - Internal server error',
    suggestedAction: 'Our team has been notified.',
  },
  [ErrorCode.SERVER_SERVICE_UNAVAILABLE]: {
    code: ErrorCode.SERVER_SERVICE_UNAVAILABLE,
    category: ErrorCategory.SERVER,
    severity: ErrorSeverity.CRITICAL,
    userMessage: 'Service temporarily unavailable.',
    technicalMessage: '503 - Service unavailable',
    suggestedAction: 'Try again in a few minutes.',
  },
  [ErrorCode.SERVER_RATE_LIMIT]: {
    code: ErrorCode.SERVER_RATE_LIMIT,
    category: ErrorCategory.SERVER,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Too many requests. Slow down.',
    technicalMessage: 'Rate limit exceeded',
    suggestedAction: 'Wait a moment before trying again.',
  },

  // Payment Errors
  [ErrorCode.PAYMENT_DECLINED]: {
    code: ErrorCode.PAYMENT_DECLINED,
    category: ErrorCategory.PAYMENT,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Payment was declined.',
    technicalMessage: 'Payment gateway declined transaction',
    suggestedAction: 'Try a different payment method.',
  },
  [ErrorCode.PAYMENT_PROCESSING_ERROR]: {
    code: ErrorCode.PAYMENT_PROCESSING_ERROR,
    category: ErrorCategory.PAYMENT,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Error processing payment.',
    technicalMessage: 'Payment processing failed',
    suggestedAction: 'Try again or contact support.',
  },
  [ErrorCode.PAYMENT_CANCELLED]: {
    code: ErrorCode.PAYMENT_CANCELLED,
    category: ErrorCategory.PAYMENT,
    severity: ErrorSeverity.LOW,
    userMessage: 'Payment was cancelled.',
    technicalMessage: 'User cancelled payment',
    suggestedAction: 'You can try again when ready.',
  },

  // Booking Errors
  [ErrorCode.BOOKING_SLOT_UNAVAILABLE]: {
    code: ErrorCode.BOOKING_SLOT_UNAVAILABLE,
    category: ErrorCategory.BOOKING,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'This time slot is no longer available.',
    technicalMessage: 'Booking slot already taken',
    suggestedAction: 'Select a different time.',
  },
  [ErrorCode.BOOKING_PAST_DATE]: {
    code: ErrorCode.BOOKING_PAST_DATE,
    category: ErrorCategory.BOOKING,
    severity: ErrorSeverity.LOW,
    userMessage: 'Cannot book for past dates.',
    technicalMessage: 'Booking date is in the past',
    suggestedAction: 'Select a future date.',
  },
  [ErrorCode.BOOKING_CANCELLATION_FAILED]: {
    code: ErrorCode.BOOKING_CANCELLATION_FAILED,
    category: ErrorCategory.BOOKING,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Failed to cancel booking.',
    technicalMessage: 'Booking cancellation failed',
    suggestedAction: 'Try again or contact support.',
  },

  // File Upload Errors
  [ErrorCode.FILE_TOO_LARGE]: {
    code: ErrorCode.FILE_TOO_LARGE,
    category: ErrorCategory.FILE_UPLOAD,
    severity: ErrorSeverity.LOW,
    userMessage: 'File is too large.',
    technicalMessage: 'File size exceeds maximum',
    suggestedAction: 'Use a smaller file (max 5MB).',
  },
  [ErrorCode.FILE_INVALID_TYPE]: {
    code: ErrorCode.FILE_INVALID_TYPE,
    category: ErrorCategory.FILE_UPLOAD,
    severity: ErrorSeverity.LOW,
    userMessage: 'Invalid file type.',
    technicalMessage: 'File type not allowed',
    suggestedAction: 'Use JPG, PNG, or GIF format.',
  },
  [ErrorCode.FILE_UPLOAD_FAILED]: {
    code: ErrorCode.FILE_UPLOAD_FAILED,
    category: ErrorCategory.FILE_UPLOAD,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Failed to upload file.',
    technicalMessage: 'File upload failed',
    suggestedAction: 'Check your connection and try again.',
  },

  // Unknown
  [ErrorCode.UNKNOWN_ERROR]: {
    code: ErrorCode.UNKNOWN_ERROR,
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'An unexpected error occurred.',
    technicalMessage: 'Unknown error',
    suggestedAction: 'Try again or contact support.',
  },
};

/**
 * Firebase Error Code Mapping
 * Maps Firebase error codes to our internal error codes
 */
export const FIREBASE_ERROR_MAP: Record<string, ErrorCode> = {
  'auth/invalid-email': ErrorCode.VALIDATION_INVALID_EMAIL,
  'auth/user-disabled': ErrorCode.AUTH_ACCOUNT_DISABLED,
  'auth/user-not-found': ErrorCode.AUTH_USER_NOT_FOUND,
  'auth/wrong-password': ErrorCode.AUTH_INVALID_CREDENTIALS,
  'auth/email-already-in-use': ErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
  'auth/weak-password': ErrorCode.AUTH_WEAK_PASSWORD,
  'auth/operation-not-allowed': ErrorCode.AUTHZ_FORBIDDEN_RESOURCE,
  'auth/invalid-credential': ErrorCode.AUTH_INVALID_CREDENTIALS,
  'auth/user-token-expired': ErrorCode.AUTH_TOKEN_EXPIRED,
  'auth/too-many-requests': ErrorCode.AUTH_TOO_MANY_REQUESTS,
  'auth/network-request-failed': ErrorCode.NETWORK_CONNECTION_FAILED,
  'permission-denied': ErrorCode.DB_PERMISSION_DENIED,
  unavailable: ErrorCode.SERVER_SERVICE_UNAVAILABLE,
  'deadline-exceeded': ErrorCode.NETWORK_TIMEOUT,
  'not-found': ErrorCode.DB_DOCUMENT_NOT_FOUND,
  'resource-exhausted': ErrorCode.SERVER_RATE_LIMIT,
  aborted: ErrorCode.DB_TRANSACTION_FAILED,
};
