"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

export function RateLimitReset() {
  const [isResetting, setIsResetting] = useState(false);
  
  const resetRateLimit = trpc.chat.resetRateLimit.useMutation({
    onSuccess: () => {
      console.log("Rate limit reset successfully");
      setIsResetting(false);
    },
    onError: (error) => {
      console.error("Failed to reset rate limit:", error);
      setIsResetting(false);
    },
  });

  const handleReset = async () => {
    if (process.env.NODE_ENV !== "development") return;
    
    setIsResetting(true);
    resetRateLimit.mutate();
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={handleReset}
        disabled={isResetting}
        className="px-3 py-2 text-xs bg-red-600 text-white rounded shadow-lg hover:bg-red-700 disabled:opacity-50"
        title="Reset rate limit (dev only)"
      >
        {isResetting ? "Resetting..." : "Reset Rate Limit"}
      </button>
    </div>
  );
}