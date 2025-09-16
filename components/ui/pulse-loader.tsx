"use client";

import { cn } from "@/lib/utils";

interface PulseLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PulseLoader({ className, size = "md" }: PulseLoaderProps) {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2", 
    lg: "w-3 h-3"
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      <div className={cn(
        "bg-current rounded-full animate-bounce [animation-delay:-0.3s]",
        sizeClasses[size]
      )}></div>
      <div className={cn(
        "bg-current rounded-full animate-bounce [animation-delay:-0.15s]",
        sizeClasses[size]
      )}></div>
      <div className={cn(
        "bg-current rounded-full animate-bounce",
        sizeClasses[size]
      )}></div>
    </div>
  );
}