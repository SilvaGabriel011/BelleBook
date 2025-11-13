import { ErrorCode, ErrorSeverity } from './errorTypes';
import { isWeb } from '../utils/platform';

/**
 * Error Log Entry Interface
 */
interface ErrorLogEntry {
  code: ErrorCode;
  message: string;
  severity: ErrorSeverity;
  timestamp: string;
  stack?: string;
  context?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
}

/**
 * Error Logger Class
 * Logs errors to console and can be extended to log to external services
 */
class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 100;

  /**
   * Log an error
   */
  log(error: Error & { code?: ErrorCode; severity?: ErrorSeverity }, context?: Record<string, unknown>): void {
    const entry: ErrorLogEntry = {
      code: error.code || ErrorCode.UNKNOWN_ERROR,
      message: error.message,
      severity: error.severity || ErrorSeverity.MEDIUM,
      timestamp: new Date().toISOString(),
      stack: error.stack,
      context,
      userAgent: isWeb ? navigator.userAgent : 'Mobile App',
      url: isWeb ? window.location.href : undefined,
    };

    // Add to logs array
    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log to console based on severity
    this.logToConsole(entry);

    // Can extend to send to external logging service
    // this.sendToExternalService(entry);
  }

  /**
   * Log to console with appropriate level
   */
  private logToConsole(entry: ErrorLogEntry): void {
    const prefix = `[${entry.severity}] [${entry.code}]`;
    
    switch (entry.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        console.error(prefix, entry.message, entry);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(prefix, entry.message, entry);
        break;
      case ErrorSeverity.LOW:
        console.info(prefix, entry.message, entry);
        break;
      default:
        console.log(prefix, entry.message, entry);
    }
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by severity
   */
  getLogsBySeverity(severity: ErrorSeverity): ErrorLogEntry[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /**
   * Get logs by code
   */
  getLogsByCode(code: ErrorCode): ErrorLogEntry[] {
    return this.logs.filter(log => log.code === code);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get error statistics
   */
  getStats() {
    const stats = {
      total: this.logs.length,
      bySeverity: {
        [ErrorSeverity.CRITICAL]: 0,
        [ErrorSeverity.HIGH]: 0,
        [ErrorSeverity.MEDIUM]: 0,
        [ErrorSeverity.LOW]: 0,
      },
      byCode: {} as Record<string, number>,
      recent: this.logs.slice(-5),
    };

    this.logs.forEach(log => {
      stats.bySeverity[log.severity]++;
      stats.byCode[log.code] = (stats.byCode[log.code] || 0) + 1;
    });

    return stats;
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Expose to window for debugging (web only)
if (isWeb && typeof window !== 'undefined') {
  (window as any).errorLogger = errorLogger;
}
