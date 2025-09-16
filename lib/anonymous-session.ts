// Anonymous session management for guest users
// Each browser tab/session gets its own isolated chat sessions

const ANONYMOUS_SESSIONS_KEY = 'anonymous_chat_sessions';
const ANONYMOUS_SESSION_ID_KEY = 'anonymous_session_id';

export interface AnonymousSession {
  id: string;
  title: string;
  createdAt: Date;
  messageCount: number;
  messages: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  }>;
}

// Generate a unique session ID for this browser tab
export function getOrCreateAnonymousSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem(ANONYMOUS_SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(ANONYMOUS_SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// Get all sessions for this anonymous user (browser tab)
export function getAnonymousSessions(): AnonymousSession[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const sessions = localStorage.getItem(ANONYMOUS_SESSIONS_KEY);
    if (!sessions) return [];
    
    const allSessions: Record<string, AnonymousSession[]> = JSON.parse(sessions);
    const sessionId = getOrCreateAnonymousSessionId();
    
    return (allSessions[sessionId] || []).map(session => ({
      ...session,
      createdAt: new Date(session.createdAt),
      messages: session.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    return [];
  }
}

// Save sessions for this anonymous user
export function saveAnonymousSessions(sessions: AnonymousSession[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    const sessionId = getOrCreateAnonymousSessionId();
    const allSessions: Record<string, AnonymousSession[]> = JSON.parse(
      localStorage.getItem(ANONYMOUS_SESSIONS_KEY) || '{}'
    );
    
    allSessions[sessionId] = sessions;
    localStorage.setItem(ANONYMOUS_SESSIONS_KEY, JSON.stringify(allSessions));
  } catch (error) {
    // Silent fail for localStorage errors
  }
}

// Create a new anonymous session
export function createAnonymousSession(title: string = 'New Chat'): AnonymousSession {
  const newSession: AnonymousSession = {
    id: `anon_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    createdAt: new Date(),
    messageCount: 0,
    messages: []
  };
  
  const sessions = getAnonymousSessions();
  sessions.unshift(newSession);
  saveAnonymousSessions(sessions);
  
  return newSession;
}

// Add message to anonymous session
export function addMessageToAnonymousSession(
  sessionId: string, 
  message: { content: string; role: 'user' | 'assistant' }
): void {
  const sessions = getAnonymousSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) return;
  
  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    content: message.content,
    role: message.role,
    timestamp: new Date()
  };
  
  sessions[sessionIndex].messages.push(newMessage);
  sessions[sessionIndex].messageCount = sessions[sessionIndex].messages.length;
  
  // Update title if this is the first user message
  if (message.role === 'user' && sessions[sessionIndex].messages.filter(m => m.role === 'user').length === 1) {
    sessions[sessionIndex].title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
  }
  
  saveAnonymousSessions(sessions);
}

// Get messages for anonymous session
export function getAnonymousSessionMessages(sessionId: string) {
  const sessions = getAnonymousSessions();
  const session = sessions.find(s => s.id === sessionId);
  return session?.messages || [];
}

// Delete anonymous session
export function deleteAnonymousSession(sessionId: string): void {
  const sessions = getAnonymousSessions();
  const filteredSessions = sessions.filter(s => s.id !== sessionId);
  saveAnonymousSessions(filteredSessions);
}

// Check if session ID is anonymous
export function isAnonymousSession(sessionId: string): boolean {
  return sessionId.startsWith('anon_session_');
}