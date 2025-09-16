/**
 * Utility functions for error handling and classification
 */

export type ErrorType = 'network' | 'validation' | 'server' | 'timeout' | 'rate_limit' | 'unauthorized' | 'unknown';

export interface ClassifiedError {
  type: ErrorType;
  message: string;
  retryable: boolean;
  userMessage: string;
}

/**
 * Classifies an error and returns appropriate user-facing information
 */
export function classifyError(error: unknown): ClassifiedError {
  let message = 'An unexpected error occurred';
  let type: ErrorType = 'unknown';
  let retryable = false;
  let userMessage = 'Something went wrong. Please try again.';

  if (error instanceof Error) {
    message = error.message;
    
    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('NetworkError')) {
      type = 'network';
      retryable = true;
      userMessage = 'Network error. Please check your connection and try again.';
    }
    // Timeout errors
    else if (message.includes('timeout') || message.includes('TIMEOUT')) {
      type = 'timeout';
      retryable = true;
      userMessage = 'Request timed out. Please try again.';
    }
    // Rate limiting
    else if (message.includes('rate limit') || message.includes('RATE_LIMIT') || message.includes('429')) {
      type = 'rate_limit';
      retryable = false; // Don't auto-retry, user needs to sign in
      if (message.includes('Please sign in to continue')) {
        userMessage = 'You\'ve reached the message limit for guests. Please sign in to continue chatting without limits.';
      } else {
        userMessage = 'Too many requests. Please wait a moment and try again.';
      }
    }
    // Authentication/Authorization
    else if (message.includes('unauthorized') || message.includes('UNAUTHORIZED') || message.includes('401')) {
      type = 'unauthorized';
      retryable = false;
      userMessage = 'Session expired. Please refresh the page and try again.';
    }
    // Server errors
    else if (message.includes('server') || message.includes('500') || message.includes('502') || message.includes('503')) {
      type = 'server';
      retryable = true;
      userMessage = 'Server error. Please try again in a moment.';
    }
    // Validation errors
    else if (message.includes('validation') || message.includes('invalid') || message.includes('400')) {
      type = 'validation';
      retryable = false;
      userMessage = 'Invalid input. Please check your data and try again.';
    }
  }

  return {
    type,
    message,
    retryable,
    userMessage
  };
}

/**
 * Determines if an error should trigger a retry
 */
export function shouldRetry(error: unknown, attemptCount: number, maxRetries: number = 3): boolean {
  if (attemptCount >= maxRetries) {
    return false;
  }

  const classified = classifyError(error);
  return classified.retryable;
}

/**
 * Calculates retry delay with exponential backoff
 */
export function getRetryDelay(attemptIndex: number, baseDelay: number = 1000, maxDelay: number = 30000): number {
  const delay = baseDelay * Math.pow(2, attemptIndex);
  return Math.min(delay, maxDelay);
}

/**
 * Creates a user-friendly error message from an error object
 */
export function getErrorMessage(error: unknown): string {
  const classified = classifyError(error);
  return classified.userMessage;
}