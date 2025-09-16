"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface NetworkErrorHandlerProps {
  children: React.ReactNode;
}

export function NetworkErrorHandler({ children }: NetworkErrorHandlerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetryConnection = () => {
    // Force a network check by trying to fetch a small resource
    fetch("/favicon.ico", { method: "HEAD", cache: "no-cache" })
      .then(() => {
        setIsOnline(true);
        setShowOfflineAlert(false);
      })
      .catch(() => {
        setIsOnline(false);
        setShowOfflineAlert(true);
      });
  };

  return (
    <>
      {showOfflineAlert && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <WifiOff className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>No internet connection. Some features may not work.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryConnection}
                className="ml-2 h-6 text-xs"
              >
                <Wifi className="mr-1 h-3 w-3" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Connection status indicator */}
      <div className="fixed bottom-4 right-4 z-40">
        {!isOnline && (
          <div className="flex items-center gap-2 rounded-full bg-destructive px-3 py-1 text-xs text-destructive-foreground shadow-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <WifiOff className="h-3 w-3" />
            <span>Offline</span>
          </div>
        )}
      </div>
      
      {children}
    </>
  );
}