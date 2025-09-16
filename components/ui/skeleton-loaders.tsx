"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function MessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={cn(
      "flex w-full gap-3 px-4 py-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {/* Avatar skeleton for AI messages */}
      {!isUser && (
        <div className="flex-shrink-0">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      )}

      {/* Message content skeleton */}
      <div className={cn(
        "flex flex-col gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]",
        isUser && "items-end"
      )}>
        <div className={cn(
          "rounded-2xl p-4 space-y-2",
          isUser ? "rounded-br-md ml-8 sm:ml-12" : "rounded-bl-md mr-8 sm:mr-12"
        )}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Avatar skeleton for user messages */}
      {isUser && (
        <div className="flex-shrink-0">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      )}
    </div>
  );
}

export function SessionSkeleton() {
  return (
    <div className="animate-pulse rounded-md bg-sidebar-accent/50 p-3 h-16 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-4 flex-1" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function ChatInterfaceSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* Messages area skeleton */}
      <div className="flex-1 p-4 space-y-4">
        <MessageSkeleton isUser={false} />
        <MessageSkeleton isUser={true} />
        <MessageSkeleton isUser={false} />
        <MessageSkeleton isUser={true} />
      </div>
      
      {/* Input area skeleton */}
      <div className="border-t border-border bg-background p-4">
        <div className="flex gap-2 items-end">
          <Skeleton className="flex-1 h-11 rounded-md" />
          <Skeleton className="h-11 w-11 rounded-md" />
        </div>
      </div>
    </div>
  );
}