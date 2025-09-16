"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { VirtualizedMessageList } from "./virtualized-message-list";

import { Message, MessageFromAPI, convertApiMessageToMessage } from "@/lib/types";
import { trpc } from "@/lib/trpc";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { ChatInterfaceSkeleton } from "@/components/ui/skeleton-loaders";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import { ErrorState, NetworkError, MessageError } from "@/components/error/error-states";
import { RateLimitLoginPrompt } from "./rate-limit-login-prompt";
import { RateLimitBanner } from "./rate-limit-banner";
import { useToast } from "@/components/error/toast-provider";
import { classifyError } from "@/lib/error-utils";
import { announceToScreenReader, generateId, getLiveRegionAttributes } from "@/lib/utils/accessibility";
import { useVirtualization } from "@/lib/hooks/use-virtualization";
import { useSession, signIn } from "next-auth/react";
import {
  getAnonymousSessionMessages,
  addMessageToAnonymousSession,
  isAnonymousSession
} from "@/lib/anonymous-session";

interface ChatInterfaceProps {
  sessionId?: string | null;
  messages?: Message[];
  isLoading?: boolean;
  isInitialLoading?: boolean;
  error?: string | null;
}

export function ChatInterface({
  sessionId,
  messages = [],
  isInitialLoading = false,
  error = null
}: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);
  const [showRateLimitBanner, setShowRateLimitBanner] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [anonymousMessages, setAnonymousMessages] = useState<Message[]>([]);
  const { showError } = useToast();
  const { data: session } = useSession();

  // Load anonymous messages when session changes
  useEffect(() => {
    if (sessionId && isAnonymousSession(sessionId)) {
      const msgs = getAnonymousSessionMessages(sessionId);
      setAnonymousMessages(msgs.map(msg => ({
        ...msg,
        sessionId,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, [sessionId]);

  // Use anonymous messages for anonymous sessions, otherwise use props
  const displayMessages = sessionId && isAnonymousSession(sessionId) ? anonymousMessages : messages;

  // Check rate limit status for anonymous users only
  const { data: rateLimitStatus } = trpc.chat.getRateLimitStatus.useQuery(undefined, {
    enabled: !session && !!sessionId && isAnonymousSession(sessionId || ''), // Only check for anonymous sessions
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Update rate limit display
  useEffect(() => {
    if (!session && rateLimitStatus && sessionId && isAnonymousSession(sessionId)) {
      setRateLimitRemaining(rateLimitStatus.remaining);
      setShowRateLimitBanner(rateLimitStatus.remaining >= 0 && rateLimitStatus.remaining < 3);
      setIsRateLimited(rateLimitStatus.remaining === 0);
    } else {
      // Reset rate limit state when user signs in or using authenticated session
      setRateLimitRemaining(null);
      setShowRateLimitBanner(false);
      setIsRateLimited(false);
    }
  }, [session, rateLimitStatus, sessionId]);

  // Generate unique IDs for ARIA relationships
  const messagesRegionId = generateId('messages-region');
  const inputRegionId = generateId('input-region');
  const statusRegionId = generateId('status-region');

  // Virtualization for large message lists
  const virtualization = useVirtualization({
    itemCount: displayMessages.length,
    itemHeight: 80, // Estimated message height
    containerHeight,
    overscan: 5,
    threshold: 50 // Only virtualize if more than 50 messages
  });

  // Update container height when scroll area changes
  useEffect(() => {
    const updateHeight = () => {
      if (scrollAreaRef.current) {
        const rect = scrollAreaRef.current.getBoundingClientRect();
        setContainerHeight(rect.height);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Get tRPC utils for cache invalidation
  const utils = trpc.useUtils();

  // tRPC mutation for sending messages with optimistic updates
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onMutate: async ({ content, sessionId }) => {
      // Cancel any outgoing refetches
      await utils.chat.getMessages.cancel({ sessionId });

      // Snapshot the previous value
      const previousMessages = utils.chat.getMessages.getData({ sessionId });

      // Optimistically update to the new value (using API format with string timestamp)
      const optimisticUserMessage: MessageFromAPI = {
        id: `temp-${Date.now()}`,
        content,
        role: 'user' as const,
        timestamp: new Date().toISOString(),
        sessionId,
      };

      utils.chat.getMessages.setData({ sessionId }, (old) => [
        ...(old || []),
        optimisticUserMessage,
      ]);

      // Return a context object with the snapshotted value
      return { previousMessages, optimisticUserMessage };
    },
    onSuccess: (data, variables) => {
      // Clear any previous send errors
      setSendError(null);

      // Handle anonymous sessions
      if (isAnonymousSession(variables.sessionId)) {
        // Add messages to anonymous session
        addMessageToAnonymousSession(variables.sessionId, {
          content: data.userMessage.content,
          role: 'user'
        });
        addMessageToAnonymousSession(variables.sessionId, {
          content: data.aiMessage.content,
          role: 'assistant'
        });

        // Update local state
        const updatedMessages = getAnonymousSessionMessages(variables.sessionId);
        setAnonymousMessages(updatedMessages.map(msg => ({
          ...msg,
          sessionId: variables.sessionId,
          timestamp: new Date(msg.timestamp)
        })));
      }

      // Handle rate limit info for anonymous users
      if (data.rateLimitInfo && !session && isAnonymousSession(variables.sessionId)) {
        setRateLimitRemaining(data.rateLimitInfo.remaining);
        setShowRateLimitBanner(true);
      }

      // Announce successful message send to screen readers
      announceToScreenReader("Message sent successfully", "polite");

      // Replace optimistic update with real data for authenticated users
      if (variables.sessionId && !isAnonymousSession(variables.sessionId)) {
        // Just invalidate to refetch fresh data instead of manual cache manipulation
        utils.chat.getMessages.invalidate({ sessionId: variables.sessionId });

        // Also invalidate sessions to update message counts and timestamps
        utils.session.getAllSessions.invalidate();
      }
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (variables.sessionId && context?.previousMessages) {
        utils.chat.getMessages.setData({ sessionId: variables.sessionId }, context.previousMessages);
      }

      // Use error classification utility
      const classified = classifyError(error);

      // Handle rate limit errors specifically for anonymous users only
      if (!session && (error.message.includes('message limit') || error.message.includes('rate limit'))) {
        setRateLimitRemaining(0);
        setShowRateLimitBanner(true);
        setIsRateLimited(true);
        // Don't show the error in the chat, the login prompt will handle it
        return;
      }

      setSendError(classified.userMessage);
      showError(classified.userMessage);

      // Announce error to screen readers
      announceToScreenReader(`Error sending message: ${classified.userMessage}`, "assertive");
    },
    onSettled: (_, __, variables) => {
      // Always refetch after error or success to ensure consistency
      if (variables.sessionId) {
        utils.chat.getMessages.invalidate({ sessionId: variables.sessionId });
      }
    }
  });

  const handleSendMessage = async (content: string) => {
    if (!sessionId) {
      const errorMsg = "No active session. Please create a new chat.";
      setSendError(errorMsg);
      showError(errorMsg);
      throw new Error(errorMsg);
    }

    // Clear previous errors
    setSendError(null);

    try {
      await sendMessageMutation.mutateAsync({
        content,
        sessionId
      });
    } catch (error) {
      // Error is already handled in the mutation's onError callback
      throw error;
    }
  };

  const handleRetryMessage = () => {
    setSendError(null);
    // The retry will be handled by the MessageInput component
  };

  const handleDismissError = () => {
    setSendError(null);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && !virtualization.shouldVirtualize) {
      // For non-virtualized lists, use scrollIntoView
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    } else if (scrollAreaRef.current && virtualization.shouldVirtualize) {
      // For virtualized lists, scroll the container to bottom
      const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [displayMessages, virtualization.shouldVirtualize]);

  // Auto-scroll to bottom when session changes
  useEffect(() => {
    if (sessionId) {
      if (messagesEndRef.current && !virtualization.shouldVirtualize) {
        messagesEndRef.current.scrollIntoView({
          behavior: "auto",
          block: "end"
        });
      } else if (scrollAreaRef.current && virtualization.shouldVirtualize) {
        const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }
  }, [sessionId, virtualization.shouldVirtualize]);

  // Show skeleton loader during initial loading
  if (isInitialLoading) {
    return <ChatInterfaceSkeleton />;
  }

  // Show error state if there's a critical error
  if (error) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          {error.includes("network") || error.includes("fetch") ? (
            <NetworkError onRetry={() => window.location.reload()} />
          ) : (
            <ErrorState
              title="Unable to load chat"
              message={error}
              retryable={true}
              onRetry={() => window.location.reload()}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col theme-transition">
      {/* Live region for status announcements */}
      <div
        id={statusRegionId}
        className="sr-only"
        {...getLiveRegionAttributes('polite', true)}
      >
        {sendMessageMutation.isPending && "AI is processing your message"}
        {sendError && `Error: ${sendError}`}
      </div>

      {/* Rate limit banner for anonymous users */}
      {showRateLimitBanner && !session && sessionId && isAnonymousSession(sessionId) && (
        <RateLimitBanner
          remainingMessages={rateLimitRemaining || 0}
          onSignIn={() => signIn()}
        />
      )}


      {/* Messages area */}
      {virtualization.shouldVirtualize ? (
        <ScrollArea
          className="flex-1 scroll-area"
          ref={scrollAreaRef}
          role="log"
          aria-label="Chat conversation history"
          aria-describedby={statusRegionId}
        >
          <div className="p-4 min-h-full" id={messagesRegionId}>
            {sessionId ? (
              displayMessages.length > 0 ? (
                <>
                  <VirtualizedMessageList
                    messages={displayMessages}
                    containerHeight={containerHeight - 100} // Account for input area
                  />

                  {/* Enhanced typing indicator for AI response */}
                  {sendMessageMutation.isPending && (
                    <div
                      className="flex w-full gap-3 px-4 py-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                      role="status"
                      aria-label="AI is typing a response"
                      aria-live="polite"
                    >
                      {/* AI Avatar */}
                      <div className="flex-shrink-0">
                        <Avatar className="h-8 w-8 border border-border/50">
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            <Bot className="h-4 w-4" aria-hidden="true" />
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Typing indicator bubble */}
                      <div className="bg-card text-card-foreground border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm mr-8 sm:mr-12 transition-all duration-200 hover:shadow-md theme-transition">
                        <TypingIndicator />
                        <span className="sr-only">AI is typing a response</span>
                      </div>
                    </div>
                  )}

                  {/* Send error display */}
                  {sendError && (
                    <MessageError
                      message={sendError}
                      onRetry={handleRetryMessage}
                      onDismiss={handleDismissError}
                    />
                  )}
                </>
              ) : (
                /* Empty state for active session */
                <div
                  className="flex h-full items-center justify-center animate-in fade-in-0 duration-500"
                  role="status"
                  aria-label="Empty chat session"
                >
                  <div className="text-center text-muted-foreground">
                    <h3 className="text-lg font-medium mb-2">
                      Start Your Conversation
                    </h3>
                    <p className="text-sm">
                      Ask me anything about your career goals, job search, or professional development.
                    </p>
                  </div>
                </div>
              )
            ) : (
              /* No session selected state */
              <div
                className="flex h-full items-center justify-center animate-in fade-in-0 duration-500"
                role="status"
                aria-label="No chat session selected"
              >
                <div className="text-center text-muted-foreground">
                  <h3 className="text-lg font-medium mb-2">
                    Welcome to Oration AI Career Counselor
                  </h3>
                  <p className="text-sm">
                    Select a chat session or create a new one to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      ) : (
        <div
          className="flex-1 overflow-y-auto scroll-area"
          ref={scrollAreaRef}
          role="log"
          aria-label="Chat conversation history"
          aria-describedby={statusRegionId}
        >
          <div className="p-4 min-h-full" id={messagesRegionId}>
            {sessionId ? (
              displayMessages.length > 0 ? (
                <>
                  {/* Message list - non-virtualized for small conversations */}
                  <div
                    className="space-y-1"
                    role="group"
                    aria-label={`${displayMessages.length} messages in conversation`}
                  >
                    {displayMessages.map((message, index) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isUser={message.role === 'user'}
                        messageIndex={index + 1}
                        totalMessages={displayMessages.length}
                      />
                    ))}
                  </div>

                  {/* Enhanced typing indicator for AI response */}
                  {sendMessageMutation.isPending && (
                    <div
                      className="flex w-full gap-3 px-4 py-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                      role="status"
                      aria-label="AI is typing a response"
                      aria-live="polite"
                    >
                      {/* AI Avatar */}
                      <div className="flex-shrink-0">
                        <Avatar className="h-8 w-8 border border-border/50">
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            <Bot className="h-4 w-4" aria-hidden="true" />
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Typing indicator bubble */}
                      <div className="bg-card text-card-foreground border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm mr-8 sm:mr-12 transition-all duration-200 hover:shadow-md theme-transition">
                        <TypingIndicator />
                        <span className="sr-only">AI is typing a response</span>
                      </div>
                    </div>
                  )}

                  {/* Send error display */}
                  {sendError && (
                    <MessageError
                      message={sendError}
                      onRetry={handleRetryMessage}
                      onDismiss={handleDismissError}
                    />
                  )}

                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                /* Empty state for active session */
                <div
                  className="flex h-full items-center justify-center animate-in fade-in-0 duration-500"
                  role="status"
                  aria-label="Empty chat session"
                >
                  <div className="text-center text-muted-foreground">
                    <h3 className="text-lg font-medium mb-2">
                      Start Your Conversation
                    </h3>
                    <p className="text-sm">
                      Ask me anything about your career goals, job search, or professional development.
                    </p>
                  </div>
                </div>
              )
            ) : (
              /* No session selected state */
              <div
                className="flex h-full items-center justify-center animate-in fade-in-0 duration-500"
                role="status"
                aria-label="No chat session selected"
              >
                <div className="text-center text-muted-foreground">
                  <h3 className="text-lg font-medium mb-2">
                    Welcome to Oration AI Career Counselor
                  </h3>
                  <p className="text-sm">
                    Select a chat session or create a new one to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message input area or rate limit prompt */}
      {sessionId && (
        <div
          id={inputRegionId}
          role="region"
          aria-label="Message input area"
        >
          {isRateLimited && !session && !!sessionId && isAnonymousSession(sessionId) ? (
            <RateLimitLoginPrompt
              onSignIn={() => signIn()}
              remainingMessages={rateLimitRemaining || 0}
            />
          ) : (
            <MessageInput
              onSend={handleSendMessage}
              disabled={sendMessageMutation.isPending}
              placeholder="Ask me anything about your career..."
              isLoading={sendMessageMutation.isPending}
              aria-describedby={statusRegionId}
            />
          )}
        </div>
      )}
    </div>
  );
}