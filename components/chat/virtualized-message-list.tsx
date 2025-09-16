'use client';

import { useMemo } from 'react';
import { MessageBubble } from './message-bubble';
import { Message } from '@/lib/types';

interface VirtualizedMessageListProps {
  messages: Message[];
  containerHeight: number;
}

export function VirtualizedMessageList({ messages, containerHeight }: VirtualizedMessageListProps) {
  // For now, we'll implement a simple non-virtualized version
  // In a production app, you'd use react-window or react-virtualized
  const renderedMessages = useMemo(() => {
    return messages.map((message, index) => (
      <MessageBubble
        key={message.id}
        message={message}
        isUser={message.role === 'user'}
        messageIndex={index + 1}
        totalMessages={messages.length}
      />
    ));
  }, [messages]);

  return (
    <div 
      className="space-y-1"
      role="group"
      aria-label={`${messages.length} messages in conversation`}
      style={{ minHeight: containerHeight }}
    >
      {renderedMessages}
    </div>
  );
}