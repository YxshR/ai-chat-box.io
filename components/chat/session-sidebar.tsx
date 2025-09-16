"use client";

import { X, Plus, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect, useId } from "react";
import { SessionSkeleton } from "@/components/ui/skeleton-loaders";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/error/error-states";
import { useToast } from "@/components/error/toast-provider";
import { useKeyboardNavigation } from "@/lib/hooks/use-keyboard-navigation";
import { useFocusManagement } from "@/lib/hooks/use-focus-management";
import { announceToScreenReader } from "@/lib/utils/accessibility";
import { useSession } from "next-auth/react";
import {
    getAnonymousSessions,
    createAnonymousSession,
    deleteAnonymousSession,
    AnonymousSession
} from "@/lib/anonymous-session";

interface SessionSidebarProps {
    onClose: () => void;
    activeSessionId?: string | null;
    onSessionSelect: (sessionId: string) => void;
    onNewChat: () => void;
}

export function SessionSidebar({
    onClose,
    activeSessionId,
    onSessionSelect,
    onNewChat
}: SessionSidebarProps) {
    const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(-1);
    const [anonymousSessions, setAnonymousSessions] = useState<AnonymousSession[]>([]);
    const { showError, showSuccess } = useToast();
    const { data: session } = useSession();

    // Generate stable IDs for ARIA relationships using React's useId hook
    const baseId = useId();
    const sidebarId = `sidebar-${baseId}`;
    const sessionListId = `session-list-${baseId}`;
    const newChatButtonId = `new-chat-btn-${baseId}`;

    // Focus management for keyboard navigation
    const { containerRef } = useFocusManagement({
        autoFocus: false,
        trapFocus: isMobile,
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load anonymous sessions for guest users
    useEffect(() => {
        if (!session) {
            const loadAnonymousSessions = () => {
                setAnonymousSessions(getAnonymousSessions());
            };

            loadAnonymousSessions();

            // Listen for storage changes to sync across tabs
            window.addEventListener('storage', loadAnonymousSessions);

            return () => {
                window.removeEventListener('storage', loadAnonymousSessions);
            };
        }
    }, [session]);

    // Fetch all sessions (only for authenticated users)
    const {
        data: dbSessions = [],
        isLoading,
        error: sessionsError,
        refetch
    } = trpc.session.getAllSessions.useQuery(undefined, {
        enabled: !!session, // Only fetch if user is authenticated
        retry: (failureCount, error) => {
            // Retry up to 3 times for network errors
            if (error.message.includes("network") || error.message.includes("fetch")) {
                return failureCount < 3;
            }
            return false;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // Combine authenticated and anonymous sessions
    const sessions = session ? dbSessions : anonymousSessions;

    // Type the sessions array explicitly (tRPC serializes dates as strings)
    const typedSessions = sessions as Array<{
        id: string;
        title: string;
        createdAt: string | Date;
        updatedAt?: string | Date;
        messageCount: number;
    }>;

    // Get tRPC utils for cache management
    const utils = trpc.useUtils();

    // Create new session mutation with optimistic updates
    const createSessionMutation = trpc.session.createSession.useMutation({
        onMutate: async (newSession) => {
            // Cancel any outgoing refetches
            await utils.session.getAllSessions.cancel();

            // Snapshot the previous value
            const previousSessions = utils.session.getAllSessions.getData();

            // Optimistically update to the new value
            const optimisticSession = {
                id: `temp-${Date.now()}`,
                title: newSession.title || 'New Chat',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messageCount: 0,
            };

            utils.session.getAllSessions.setData(undefined, (old) => [
                optimisticSession,
                ...(old || []),
            ]);

            return { previousSessions, optimisticSession };
        },
        onSuccess: (newSession) => {
            // Invalidate to refetch fresh data
            utils.session.getAllSessions.invalidate();

            onSessionSelect(newSession.id);
            onNewChat();
            showSuccess("New chat session created");
        },
        onError: (error, _variables, context) => {
            // Rollback optimistic update
            if (context?.previousSessions) {
                utils.session.getAllSessions.setData(undefined, context.previousSessions);
            }

            showError("Failed to create new chat session. Please try again.");
        }
    });

    // Delete session mutation with optimistic updates
    const deleteSessionMutation = trpc.session.deleteSession.useMutation({
        onMutate: async ({ sessionId }) => {
            // Cancel any outgoing refetches
            await utils.session.getAllSessions.cancel();

            // Snapshot the previous value
            const previousSessions = utils.session.getAllSessions.getData();

            // Optimistically remove the session
            utils.session.getAllSessions.setData(undefined, (old) =>
                old?.filter((session) => session.id !== sessionId) || []
            );

            return { previousSessions, deletedSessionId: sessionId };
        },
        onSuccess: (_data, variables) => {
            setDeletingSessionId(null);
            showSuccess("Chat session deleted");

            // If the deleted session was active, clear it
            if (activeSessionId === variables.sessionId) {
                onSessionSelect('');
            }
        },
        onError: (error, _variables, context) => {
            // Rollback optimistic update
            if (context?.previousSessions) {
                utils.session.getAllSessions.setData(undefined, context.previousSessions);
            }

            setDeletingSessionId(null);
            showError("Failed to delete chat session. Please try again.");
        }
    });

    const handleNewChat = () => {
        if (session) {
            // Authenticated user - use database
            createSessionMutation.mutate({
                title: 'New Chat'
            });
        } else {
            // Anonymous user - use local storage
            const newSession = createAnonymousSession('New Chat');
            setAnonymousSessions(getAnonymousSessions());
            onSessionSelect(newSession.id);
            onNewChat();
            showSuccess("New chat session created");
        }
        announceToScreenReader("Creating new chat session", "polite");
    };

    const handleSessionSelect = (sessionId: string, sessionTitle?: string) => {
        onSessionSelect(sessionId);
        announceToScreenReader(
            `Selected chat session: ${sessionTitle || 'Untitled'}`,
            "polite"
        );

        // Close sidebar on mobile after selection
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    const handleDeleteSession = (sessionId: string, event: React.MouseEvent, sessionTitle?: string) => {
        event.stopPropagation();
        setDeletingSessionId(sessionId);

        if (session) {
            // Authenticated user - delete from database
            deleteSessionMutation.mutate({ sessionId });
        } else {
            // Anonymous user - delete from local storage
            deleteAnonymousSession(sessionId);
            setAnonymousSessions(getAnonymousSessions());
            setDeletingSessionId(null);
            showSuccess("Chat session deleted");

            // If the deleted session was active, clear it
            if (activeSessionId === sessionId) {
                onSessionSelect('');
            }
        }

        announceToScreenReader(
            `Deleting chat session: ${sessionTitle || 'Untitled'}`,
            "polite"
        );
    };

    // Keyboard navigation for session list
    useKeyboardNavigation({
        onArrowUp: () => {
            if (selectedSessionIndex > 0) {
                setSelectedSessionIndex(selectedSessionIndex - 1);
            }
        },
        onArrowDown: () => {
            if (selectedSessionIndex < typedSessions.length - 1) {
                setSelectedSessionIndex(selectedSessionIndex + 1);
            }
        },
        onEnter: () => {
            if (selectedSessionIndex >= 0 && typedSessions[selectedSessionIndex]) {
                handleSessionSelect(
                    typedSessions[selectedSessionIndex].id,
                    typedSessions[selectedSessionIndex].title
                );
            }
        },
        onEscape: () => {
            if (isMobile) {
                onClose();
            }
        },
        enabled: true,
        preventDefault: false,
    });

    return (
        <div
            ref={containerRef}
            className="flex h-full flex-col bg-sidebar theme-transition"
            id={sidebarId}
            role="navigation"
            aria-label="Chat sessions navigation"
        >
            {/* Sidebar header */}
            <header className="flex items-center justify-between border-b border-sidebar-border p-4 theme-transition">
                <h2
                    className="text-sm font-medium text-sidebar-foreground"
                    id={`${sidebarId}-title`}
                >
                    Chat Sessions
                </h2>
                <Button
                    variant="ghost"
                    size={isMobile ? "touch-icon" : "sm"}
                    className="lg:hidden touch-manipulation focus-visible-enhanced"
                    onClick={onClose}
                    aria-label="Close chat sessions sidebar"
                    aria-describedby={`${sidebarId}-title`}
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </Button>
            </header>

            {/* New chat button */}
            <div className="p-4">
                <Button
                    id={newChatButtonId}
                    className="w-full justify-start gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] touch-manipulation focus-visible-enhanced"
                    variant="outline"
                    size={isMobile ? "touch" : "sm"}
                    onClick={handleNewChat}
                    disabled={createSessionMutation.isPending}
                    aria-label="Create new chat session"
                    aria-describedby={createSessionMutation.isPending ? `${newChatButtonId}-status` : undefined}
                >
                    {createSessionMutation.isPending ? (
                        <LoadingSpinner size="sm" aria-hidden="true" />
                    ) : (
                        <Plus className="h-4 w-4" aria-hidden="true" />
                    )}
                    {createSessionMutation.isPending ? 'Creating...' : 'New Chat'}
                </Button>
                {createSessionMutation.isPending && (
                    <div
                        id={`${newChatButtonId}-status`}
                        className="sr-only"
                        aria-live="polite"
                    >
                        Creating new chat session
                    </div>
                )}
            </div>

            <Separator />

            {/* Sessions list */}
            <ScrollArea className="flex-1 px-2" aria-label="Chat sessions list">
                <div
                    className="space-y-1 p-2"
                    role="list"
                    id={sessionListId}
                    aria-label={`${typedSessions.length} chat sessions available`}
                >
                    {sessionsError ? (
                        <div className="p-2" role="alert">
                            <ErrorState
                                title="Failed to load sessions"
                                message={sessionsError.message}
                                type="error"
                                retryable={true}
                                onRetry={() => refetch()}
                                className="text-xs"
                            />
                        </div>
                    ) : isLoading ? (
                        <div className="space-y-2" aria-label="Loading chat sessions">
                            {/* Enhanced loading skeleton */}
                            {[...Array(3)].map((_, i) => (
                                <SessionSkeleton key={i} />
                            ))}
                        </div>
                    ) : typedSessions.length === 0 ? (
                        <div
                            className="rounded-md p-3 text-sm text-sidebar-foreground/60 text-center"
                            role="status"
                            aria-label="No chat sessions available"
                        >
                            No chat sessions yet.
                            <br />
                            Click "New Chat" to get started!
                        </div>
                    ) : (
                        typedSessions.map((session, index) => (
                            <div
                                key={session.id}
                                className={cn(
                                    "group relative rounded-md cursor-pointer transition-all duration-200 hover:bg-sidebar-accent hover:scale-[1.02] active:scale-[0.98] theme-transition touch-manipulation focus-visible-enhanced",
                                    isMobile ? "p-4 min-h-[44px]" : "p-3",
                                    activeSessionId === session.id && "bg-sidebar-accent border border-sidebar-border shadow-sm",
                                    selectedSessionIndex === index && "ring-2 ring-ring ring-offset-2"
                                )}
                                onClick={() => handleSessionSelect(session.id, session.title)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleSessionSelect(session.id, session.title);
                                    }
                                }}
                                role="listitem"
                                tabIndex={0}
                                aria-label={`Chat session: ${session.title}, ${session.messageCount} messages, created ${formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}`}
                                aria-current={activeSessionId === session.id ? "page" : undefined}
                                aria-describedby={`session-${session.id}-details`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MessageSquare
                                                className="h-3 w-3 text-sidebar-foreground/60 flex-shrink-0"
                                                aria-hidden="true"
                                            />
                                            <h3 className="text-sm font-medium text-sidebar-foreground truncate">
                                                {session.title}
                                            </h3>
                                        </div>
                                        <div
                                            className="flex items-center justify-between text-xs text-sidebar-foreground/60"
                                            id={`session-${session.id}-details`}
                                        >
                                            <span aria-label={`${session.messageCount} messages in this session`}>
                                                {session.messageCount} message{session.messageCount !== 1 ? 's' : ''}
                                            </span>
                                            <span aria-label={`Created ${formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}`}>
                                                {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Delete button */}
                                    <Button
                                        variant="ghost"
                                        size={isMobile ? "touch-icon" : "sm"}
                                        className={cn(
                                            "transition-all duration-200 text-sidebar-foreground/60 hover:text-destructive hover:scale-110 touch-manipulation focus-visible-enhanced",
                                            isMobile ? "opacity-100 min-h-[44px] min-w-[44px]" : "opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                        )}
                                        onClick={(e) => handleDeleteSession(session.id, e, session.title)}
                                        disabled={deletingSessionId === session.id}
                                        aria-label={`Delete chat session: ${session.title}`}
                                        aria-describedby={deletingSessionId === session.id ? `delete-${session.id}-status` : undefined}
                                    >
                                        {deletingSessionId === session.id ? (
                                            <>
                                                <LoadingSpinner size="sm" className="text-destructive" aria-hidden="true" />
                                                <span className="sr-only">Deleting session</span>
                                            </>
                                        ) : (
                                            <Trash2 className="h-3 w-3" aria-hidden="true" />
                                        )}
                                    </Button>

                                    {deletingSessionId === session.id && (
                                        <div
                                            id={`delete-${session.id}-status`}
                                            className="sr-only"
                                            aria-live="polite"
                                        >
                                            Deleting chat session: {session.title}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}