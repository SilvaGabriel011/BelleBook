import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { errorHandler, AppError } from '../errors/errorHandler';
import { ErrorSeverity } from '../errors/errorTypes';
import { responsiveStyles, fontSize, spacing } from '../utils/responsive';
import { isWeb } from '../utils/platform';

interface Props {
  children: ReactNode;
  fallback?: (error: AppError, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: AppError | null;
}

/**
 * Error Boundary Component
 * Catches React component errors and displays user-friendly error UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const appError = errorHandler.handle(error, {
      componentStack: 'Error Boundary caught error',
    });

    return {
      hasError: true,
      error: appError,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Error Boundary caught:', error, errorInfo);
    
    // Handle the error
    errorHandler.handle(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>⚠️</Text>
            </View>

            <Text style={styles.title}>
              {this.state.error.severity === ErrorSeverity.CRITICAL
                ? 'Critical Error'
                : 'Something Went Wrong'}
            </Text>

            <Text style={styles.userMessage}>
              {this.state.error.userMessage}
            </Text>

            {this.state.error.suggestedAction && (
              <View style={styles.suggestionBox}>
                <Text style={styles.suggestionTitle}>💡 Suggestion:</Text>
                <Text style={styles.suggestion}>
                  {this.state.error.suggestedAction}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[responsiveStyles.button, responsiveStyles.primaryButton]}
              onPress={this.resetError}
            >
              <Text style={[responsiveStyles.buttonText, { color: '#fff' }]}>
                Try Again
              </Text>
            </TouchableOpacity>

            {isWeb && __DEV__ && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugTitle}>Debug Information:</Text>
                <Text style={styles.debugText}>
                  Code: {this.state.error.code}
                </Text>
                <Text style={styles.debugText}>
                  Category: {this.state.error.category}
                </Text>
                <Text style={styles.debugText}>
                  Severity: {this.state.error.severity}
                </Text>
                {this.state.error.stack && (
                  <Text style={styles.debugStack}>
                    {this.state.error.stack}
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing('lg'),
  },
  iconContainer: {
    marginBottom: spacing('lg'),
  },
  icon: {
    fontSize: fontSize('4xl') * 2,
  },
  title: {
    fontSize: fontSize('3xl'),
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: spacing('md'),
    textAlign: 'center',
  },
  userMessage: {
    fontSize: fontSize('lg'),
    color: '#374151',
    marginBottom: spacing('xl'),
    textAlign: 'center',
    paddingHorizontal: spacing('md'),
  },
  suggestionBox: {
    backgroundColor: '#FEF3C7',
    padding: spacing('md'),
    borderRadius: 8,
    marginBottom: spacing('xl'),
    width: '100%',
    maxWidth: 500,
  },
  suggestionTitle: {
    fontSize: fontSize('base'),
    fontWeight: '600',
    color: '#92400E',
    marginBottom: spacing('xs'),
  },
  suggestion: {
    fontSize: fontSize('sm'),
    color: '#78350F',
  },
  debugInfo: {
    marginTop: spacing('xl'),
    padding: spacing('md'),
    backgroundColor: '#1F2937',
    borderRadius: 8,
    width: '100%',
    maxWidth: 600,
  },
  debugTitle: {
    fontSize: fontSize('base'),
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: spacing('sm'),
  },
  debugText: {
    fontSize: fontSize('sm'),
    color: '#D1D5DB',
    marginBottom: 4,
    fontFamily: isWeb ? 'monospace' : undefined,
  },
  debugStack: {
    fontSize: fontSize('xs'),
    color: '#9CA3AF',
    marginTop: spacing('sm'),
    fontFamily: isWeb ? 'monospace' : undefined,
  },
});

export default ErrorBoundary;
