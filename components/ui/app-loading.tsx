"use client";

import { LoadingSpinner } from "./loading-spinner";

export function AppLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Loading Oration AI Career Counselor
          </h2>
          <p className="text-sm text-muted-foreground">
            Preparing your personalized career guidance experience...
          </p>
        </div>
      </div>
    </div>
  );
}