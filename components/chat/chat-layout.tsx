"use client";

import { useState, useEffect } from "react";
import { ChatHeader } from "./chat-header";
import { SessionSidebar } from "./session-sidebar";
import { ChatInterface } from "./chat-interface";
import { trpc } from "@/lib/trpc";
import { Message } from "@/lib/types";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { NetworkErrorHandler } from "@/components/error/network-error-handler";
import { ToastProvider } from "@/components/error/toast-provider";
import { useSwipeGesture } from "@/lib/hooks/use-swipe-gesture";
import { useMobileKeyboard } from "@/lib/hooks/use-mobile-keyboard";
// import { useRealTimeUpdates } from "@/lib/hooks/use-real-time-updates";
import { useKeyboardNavigation } from "@/lib/hooks/use-keyboard-navigation";
import { announceToScreenReader } from "@/lib/utils/accessibility";
import { RateLimitReset } from "@/components/dev/rate-limit-reset";

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile keyboard handling
  const { isKeyboardVisible } = useMobileKeyboard({
    adjustViewport: true,
    onKeyboardShow: () => {
      // Close sidebar when keyboard opens on mobile
      if (isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    },
  });

  // Real-time updates management
  // useRealTimeUpdates({
  //   enabled: true,
  //   onUpdate: () => {
  //     // Handle real-time updates here if needed
  //     console.log('Real-time update triggered');
  //   },
  // });

  // Swipe gesture handling for mobile sidebar
  const { touchHandlers } = useSwipeGesture({
    onSwipeRight: () => {
      if (isMobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    },
    onSwipeLeft: () => {
      if (isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    },
    threshold: 50,
    preventScroll: true,
  });

  // Fetch messages for the active session with real-time behavior
  const {
    data: messagesData = [],
    isLoading: messagesLoading,
    isPending: messagesInitialLoading,
    error: messagesError
  } = trpc.chat.getMessages.useQuery(
    { sessionId: activeSessionId! },
    {
      enabled: !!activeSessionId,
      refetchOnWindowFocus: false,
      refetchInterval: activeSessionId ? 30000 : false, // Poll every 30 seconds when active
      retry: (failureCount, error) => {
        // Retry up to 3 times for network errors
        if (error.message.includes("network") || error.message.includes("fetch")) {
          return failureCount < 3;
        }
        // Don't retry for other errors
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );

  // Convert API data to Message format (handle date serialization)
  const messages: Message[] = messagesData ? messagesData.map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp),
  })) : [];

  // Format error message for display
  const errorMessage = messagesError ?
    `Failed to load messages: ${messagesError.message}` :
    null;

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);

    // Announce sidebar state to screen readers
    announceToScreenReader(
      newState ? "Sidebar opened" : "Sidebar closed",
      "polite"
    );
  };

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);

    // Announce session change to screen readers
    announceToScreenReader("Chat session changed", "polite");
  };

  const handleNewChat = () => {
    // Clear current session when creating new chat
    // The actual session creation is handled in SessionSidebar
    setActiveSessionId(null);

    // Announce new chat creation
    announceToScreenReader("New chat session started", "polite");
  };

  // Keyboard navigation for sidebar
  useKeyboardNavigation({
    onEscape: () => {
      if (sidebarOpen && isMobile) {
        setSidebarOpen(false);
        announceToScreenReader("Sidebar closed", "polite");
      }
    },
    enabled: true,
    preventDefault: false,
  });

  return (
    <ToastProvider>
      <NetworkErrorHandler>
        <ErrorBoundary>
          {/* Skip link for keyboard navigation */}
          <a
            href="#main-content"
            className="skip-link sr-only-focusable"
            onFocus={() => announceToScreenReader("Skip to main content link focused", "polite")}
          >
            loading...
          </a>

          <div
            {...touchHandlers}
            className={`flex h-screen bg-background theme-transition ${isKeyboardVisible ? 'keyboard-visible' : ''
              }`}
            role="application"
            aria-label="Oration AI Career Counselor Chat Application"
          >
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
            )}

            {/* Sidebar */}
            <aside
              className={`
                fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r border-sidebar-border theme-transition
                transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none
                ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
              `}
              aria-label="Chat sessions sidebar"
              aria-hidden={!sidebarOpen && isMobile ? "true" : "false"}
              role="complementary"
            >
              <ErrorBoundary>
                <SessionSidebar
                  onClose={() => setSidebarOpen(false)}
                  activeSessionId={activeSessionId}
                  onSessionSelect={handleSessionSelect}
                  onNewChat={handleNewChat}
                />
              </ErrorBoundary>
            </aside>

            {/* Main content */}
            <main
              className="flex flex-1 flex-col overflow-hidden transition-all duration-300 theme-transition"
              id="main-content"
              role="main"
              aria-label="Chat conversation area"
            >
              {/* Header */}
              <ErrorBoundary>
                <ChatHeader
                  onMenuClick={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                />
              </ErrorBoundary>

              {/* Chat interface */}
              <div className="flex-1 overflow-hidden" role="region" aria-label="Chat messages and input">
                <ErrorBoundary>
                  <ChatInterface
                    sessionId={activeSessionId}
                    messages={messages}
                    isLoading={messagesLoading}
                    isInitialLoading={messagesInitialLoading}
                    error={errorMessage}
                  />
                </ErrorBoundary>
              </div>
            </main>
          </div>

          {/* Development tools */}
          <RateLimitReset />
        </ErrorBoundary>
      </NetworkErrorHandler>
    </ToastProvider>
  );
}