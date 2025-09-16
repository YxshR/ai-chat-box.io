"use client";

import { AlertCircle, RefreshCw, Wifi, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  message: string;
  type?: "error" | "warning" | "info";
  retryable?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  type = "error",
  retryable = false,
  onRetry,
  className = ""
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case "warning":
        return "default" as const;
      case "info":
        return "default" as const;
      default:
        return "destructive" as const;
    }
  };

  return (
    <Alert variant={getVariant()} className={className}>
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex flex-col gap-2">
          <span>{message}</span>
          {retryable && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="w-fit"
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Try Again
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface MessageErrorProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function MessageError({ message, onRetry, onDismiss }: MessageErrorProps) {
  return (
    <div className="mx-4 mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <Alert variant="destructive" className="relative">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="pr-8">
          <div className="flex items-center justify-between">
            <span className="text-sm">{message}</span>
            <div className="flex gap-1 ml-2">
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="h-6 text-xs"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Retry
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="h-6 w-6 p-0 text-xs"
                >
                  ×
                </Button>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface NetworkErrorProps {
  onRetry?: () => void;
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <Card className="m-4">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <Wifi className="h-5 w-5 text-destructive" />
        </div>
        <CardTitle className="text-lg">Connection Problem</CardTitle>
        <CardDescription>
          Unable to connect to the server. Please check your internet connection.
        </CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent className="pt-0">
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

interface ValidationErrorProps {
  message: string;
  field?: string;
  id?: string;
}

export function ValidationError({ message, field, id }: ValidationErrorProps) {
  return (
    <div 
      className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200"
      id={id}
      role="alert"
      aria-live="polite"
    >
      {field && <span className="font-medium">{field}: </span>}
      {message}
    </div>
  );
}

interface RateLimitErrorProps {
  onSignIn?: () => void;
  onDismiss?: () => void;
}

export function RateLimitError({ onSignIn, onDismiss }: RateLimitErrorProps) {
  return (
    <div className="mx-4 mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <Alert variant="default" className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-200">Message limit reached</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          <div className="flex flex-col gap-3 mt-2">
            <span>You've reached the message limit for guests. Sign in to continue chatting without limits!</span>
            <div className="flex gap-2">
              {onSignIn && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onSignIn}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Sign In to Continue
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDismiss}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}