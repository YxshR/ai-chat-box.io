"use client";

import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function TypingIndicator({ className, size = "md" }: TypingIndicatorProps) {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2", 
    lg: "w-2.5 h-2.5"
  };

  const containerClasses = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2"
  };

  return (
    <div 
      className={cn(
        "flex items-center",
        containerClasses[size],
        className
      )}
      role="status"
      aria-label="AI is typing"
    >
      <div 
        className={cn(
          "rounded-full bg-muted-foreground/60 animate-bounce",
          sizeClasses[size]
        )}
        style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
      />
      <div 
        className={cn(
          "rounded-full bg-muted-foreground/60 animate-bounce",
          sizeClasses[size]
        )}
        style={{ animationDelay: "160ms", animationDuration: "1.4s" }}
      />
      <div 
        className={cn(
          "rounded-full bg-muted-foreground/60 animate-bounce",
          sizeClasses[size]
        )}
        style={{ animationDelay: "320ms", animationDuration: "1.4s" }}
      />
      <span className="sr-only">AI is typing a response</span>
    </div>
  );
}