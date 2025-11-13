import { FirebaseError } from 'firebase/app';
import { ErrorCode, ErrorSeverity } from './errorTypes';
import { ERROR_MAP, FIREBASE_ERROR_MAP } from './errorMapping';
import { errorLogger } from './errorLogger';

/**
 * Custom Application Error Class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly category: string;
  public readonly severity: ErrorSeverity;
  public readonly userMessage: string;
  public readonly technicalMessage: string;
  public readonly suggestedAction?: string;
  public readonly originalError?: Error;
  public readonly timestamp: Date;

  constructor(code: ErrorCode, originalError?: Error, additionalContext?: Record<string, any>) {
    const errorDetails = ERROR_MAP[code] || ERROR_MAP[ErrorCode.UNKNOWN_ERROR];

    super(errorDetails.technicalMessage);

    this.name = 'AppError';
    this.code = code;
    this.category = errorDetails.category;
    this.severity = errorDetails.severity;
    this.userMessage = errorDetails.userMessage;
    this.technicalMessage = errorDetails.technicalMessage;
    this.suggestedAction = errorDetails.suggestedAction;
    this.originalError = originalError;
    this.timestamp = new Date();

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    // Log the error
    errorLogger.log(this, additionalContext);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      category: this.category,
      severity: this.severity,
      userMessage: this.userMessage,
      technicalMessage: this.technicalMessage,
      suggestedAction: this.suggestedAction,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}

/**
 * Error Handler Utility Class
 */
class ErrorHandler {
  /**
   * Handle and convert any error to AppError
   */
  handle(error: any, context?: Record<string, any>): AppError {
    // Already an AppError
    if (error instanceof AppError) {
      return error;
    }

    // Firebase Error
    if (this.isFirebaseError(error)) {
      return this.handleFirebaseError(error, context);
    }

    // Network Error
    if (this.isNetworkError(error)) {
      return this.handleNetworkError(error, context);
    }

    // Validation Error
    if (this.isValidationError(error)) {
      return this.handleValidationError(error, context);
    }

    // Generic Error
    return new AppError(ErrorCode.UNKNOWN_ERROR, error, context);
  }

  /**
   * Handle Firebase specific errors
   */
  private handleFirebaseError(error: FirebaseError, context?: Record<string, any>): AppError {
    const firebaseCode = error.code;
    const mappedCode = FIREBASE_ERROR_MAP[firebaseCode] || ErrorCode.UNKNOWN_ERROR;

    return new AppError(mappedCode, error, {
      ...context,
      firebaseCode,
      firebaseMessage: error.message,
    });
  }

  /**
   * Handle network errors
   */
  private handleNetworkError(error: Error, context?: Record<string, any>): AppError {
    if (!navigator.onLine) {
      return new AppError(ErrorCode.NETWORK_OFFLINE, error, context);
    }

    if (error.message.includes('timeout')) {
      return new AppError(ErrorCode.NETWORK_TIMEOUT, error, context);
    }

    return new AppError(ErrorCode.NETWORK_CONNECTION_FAILED, error, context);
  }

  /**
   * Handle validation errors
   */
  private handleValidationError(error: Error, context?: Record<string, any>): AppError {
    const message = error.message.toLowerCase();

    if (message.includes('email')) {
      return new AppError(ErrorCode.VALIDATION_INVALID_EMAIL, error, context);
    }

    if (message.includes('phone')) {
      return new AppError(ErrorCode.VALIDATION_INVALID_PHONE, error, context);
    }

    if (message.includes('required')) {
      return new AppError(ErrorCode.VALIDATION_REQUIRED_FIELD, error, context);
    }

    return new AppError(ErrorCode.VALIDATION_INVALID_FORMAT, error, context);
  }

  /**
   * Type Guards
   */
  private isFirebaseError(error: any): error is FirebaseError {
    return (
      error instanceof FirebaseError || (error && error.code && error.code.startsWith('auth/'))
    );
  }

  private isNetworkError(error: any): boolean {
    return (
      error.message?.includes('network') ||
      error.message?.includes('fetch') ||
      error.message?.includes('timeout') ||
      error.name === 'NetworkError' ||
      !navigator.onLine
    );
  }

  private isValidationError(error: any): boolean {
    return (
      error.name === 'ValidationError' ||
      error.message?.includes('validation') ||
      error.message?.includes('invalid') ||
      error.message?.includes('required')
    );
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: any): string {
    const appError = this.handle(error);
    return appError.userMessage;
  }

  /**
   * Get technical error details
   */
  getTechnicalDetails(error: any): string {
    const appError = this.handle(error);
    return appError.technicalMessage;
  }

  /**
   * Check if error is critical
   */
  isCritical(error: any): boolean {
    const appError = this.handle(error);
    return appError.severity === ErrorSeverity.CRITICAL;
  }

  /**
   * Get suggested action for error
   */
  getSuggestedAction(error: any): string | undefined {
    const appError = this.handle(error);
    return appError.suggestedAction;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

/**
 * Utility function to wrap async functions with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, any>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw errorHandler.handle(error, {
        ...context,
        function: fn.name,
        arguments: args,
      });
    }
  }) as T;
}

/**
 * Utility function for safe execution with error handling
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  fallbackValue: T,
  context?: Record<string, any>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    errorHandler.handle(error, context);
    return fallbackValue;
  }
}
