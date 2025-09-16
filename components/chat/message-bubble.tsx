"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "@/lib/types";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  messageIndex?: number;
  totalMessages?: number;
}

/**
 * MessageBubble Component
 * 
 * A responsive message bubble component that displays chat messages with distinct styling
 * for user and AI messages. Features include:
 * 
 * - Distinct visual styling for user vs AI messages
 * - Responsive layout that adapts to different screen sizes
 * - Avatar icons for both user and AI messages
 * - Hover effects for better interactivity
 * - Proper text formatting with line breaks and word wrapping
 * - Timestamp display on hover
 * - Consistent spacing and visual hierarchy using shadcn/ui design tokens
 * 
 * Requirements satisfied: 1.1, 5.2, 5.3
 */

export function MessageBubble({ 
  message, 
  isUser, 
  messageIndex, 
  totalMessages 
}: MessageBubbleProps) {
  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(timestamp));
  };

  const messageLabel = `${isUser ? 'You' : 'AI Assistant'} said: ${message.content}. Sent at ${formatTimestamp(message.timestamp)}`;
  const positionLabel = messageIndex && totalMessages 
    ? `Message ${messageIndex} of ${totalMessages}` 
    : undefined;

  return (
    <div
      className={cn(
        "flex w-full gap-3 px-4 py-3 group animate-in fade-in-0 slide-in-from-bottom-2 duration-300 theme-transition",
        isUser ? "justify-end" : "justify-start"
      )}
      role="article"
      aria-label={messageLabel}
      aria-describedby={positionLabel ? `message-${message.id}-position` : undefined}
    >
      {/* Avatar for AI messages (left side) */}
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8 border border-border/50">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <Bot className="h-4 w-4" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Message content */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]",
          isUser && "items-end"
        )}
      >
        {/* Message bubble */}
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm theme-transition focus-visible-enhanced",
            "transition-all duration-200 group-hover:shadow-md group-hover:scale-[1.01]",
            isUser
              ? [
                  "bg-primary text-primary-foreground",
                  "rounded-br-md", // Sharp corner on bottom right for user messages
                  "ml-8 sm:ml-12", // Left margin to prevent overlap with AI messages
                ]
              : [
                  "bg-card text-card-foreground border border-border/50",
                  "rounded-bl-md", // Sharp corner on bottom left for AI messages
                  "mr-8 sm:mr-12", // Right margin to prevent overlap with user messages
                ]
          )}
          tabIndex={0}
          role="region"
          aria-label={`Message from ${isUser ? 'you' : 'AI assistant'}`}
        >
          {/* Message text with proper formatting */}
          <div 
            className="whitespace-pre-wrap break-words font-medium"
            aria-label={`Message content: ${message.content}`}
          >
            {message.content}
          </div>
        </div>

        {/* Timestamp */}
        <div
          className={cn(
            "text-xs text-muted-foreground px-2 opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200",
            isUser ? "text-right" : "text-left"
          )}
          aria-label={`Sent at ${formatTimestamp(message.timestamp)}`}
        >
          {formatTimestamp(message.timestamp)}
        </div>
        
        {/* Screen reader position info */}
        {positionLabel && (
          <div 
            id={`message-${message.id}-position`}
            className="sr-only"
          >
            {positionLabel}
          </div>
        )}
      </div>

      {/* Avatar for user messages (right side) */}
      {isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8 border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}