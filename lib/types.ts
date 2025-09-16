// Core chat data models
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sessionId: string;
}

// API message format (timestamps are serialized as strings)
export interface MessageFromAPI {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

// Frontend state interfaces
export interface ChatState {
  activeSessionId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  typingIndicator: boolean;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  isMobile: boolean;
}

// Component prop interfaces
export interface ChatLayoutProps {
  children: React.ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

export interface SessionSidebarProps {
  sessions: ChatSession[];
  activeSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  isLoading?: boolean;
}

export interface ChatInterfaceProps {
  sessionId?: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  error?: string;
}

export interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  timestamp: Date;
}

export interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  error?: string | null;
}

// Error handling interfaces
export interface ErrorState {
  type: 'network' | 'validation' | 'server' | 'unknown';
  message: string;
  retryable: boolean;
  action?: () => void;
}

export interface ValidationErrors {
  [field: string]: string;
}

export interface ToastOptions {
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Local storage interfaces
export interface LocalStorageData {
  theme: 'light' | 'dark';
  sidebarPreference: boolean;
  lastActiveSession?: string;
}

// Utility functions for type conversion
export function convertApiMessageToMessage(apiMessage: MessageFromAPI): Message {
  return {
    ...apiMessage,
    timestamp: new Date(apiMessage.timestamp),
  };
}

export function convertApiMessagesToMessages(apiMessages: MessageFromAPI[]): Message[] {
  return apiMessages.map(convertApiMessageToMessage);
}

// Re-export tRPC types for convenience
export type {
  RouterInputs,
  RouterOutputs,
  SendMessageInput,
  SendMessageOutput,
  GetMessagesInput,
  GetMessagesOutput,
  GetAllSessionsOutput,
  CreateSessionInput,
  CreateSessionOutput,
  DeleteSessionInput,
  DeleteSessionOutput,
  SessionFromAPI,
  SessionListFromAPI,
} from './trpc-types';