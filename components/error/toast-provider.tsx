"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertCircle, CheckCircle, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  showError: (message: string, options?: Partial<Toast>) => void;
  showSuccess: (message: string, options?: Partial<Toast>) => void;
  showWarning: (message: string, options?: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showError = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({
      message,
      type: "error",
      duration: 7000, // Longer duration for errors
      ...options,
    });
  }, [addToast]);

  const showSuccess = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({
      message,
      type: "success",
      duration: 4000,
      ...options,
    });
  }, [addToast]);

  const showWarning = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({
      message,
      type: "warning",
      duration: 6000,
      ...options,
    });
  }, [addToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showError,
        showSuccess,
        showWarning,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800";
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800";
    }
  };

  return (
    <div
      className={`
        relative rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-full duration-300
        ${getBgColor()}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-medium text-foreground mb-1">
              {toast.title}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {toast.message}
          </p>
          {toast.action && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toast.action.onClick}
                className="h-7 text-xs"
              >
                {toast.action.label}
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(toast.id)}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}