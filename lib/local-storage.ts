import { LocalStorageData } from './types';

// Local storage keys
const STORAGE_KEYS = {
  THEME: 'ai-chat-theme',
  SIDEBAR_PREFERENCE: 'ai-chat-sidebar-preference',
  LAST_ACTIVE_SESSION: 'ai-chat-last-active-session',
} as const;

// Default values
const DEFAULT_VALUES: LocalStorageData = {
  theme: 'light',
  sidebarPreference: true,
  lastActiveSession: undefined,
};

/**
 * Safely get a value from localStorage with fallback
 */
function getStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely set a value in localStorage
 */
function setStorageValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
  }
}

/**
 * Theme management utilities
 */
export const themeStorage = {
  get: (): 'light' | 'dark' => {
    return getStorageValue(STORAGE_KEYS.THEME, DEFAULT_VALUES.theme);
  },
  
  set: (theme: 'light' | 'dark'): void => {
    setStorageValue(STORAGE_KEYS.THEME, theme);
  },
  
  toggle: (): 'light' | 'dark' => {
    const currentTheme = themeStorage.get();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    themeStorage.set(newTheme);
    return newTheme;
  },
};

/**
 * Sidebar preference management utilities
 */
export const sidebarStorage = {
  get: (): boolean => {
    return getStorageValue(STORAGE_KEYS.SIDEBAR_PREFERENCE, DEFAULT_VALUES.sidebarPreference);
  },
  
  set: (isOpen: boolean): void => {
    setStorageValue(STORAGE_KEYS.SIDEBAR_PREFERENCE, isOpen);
  },
  
  toggle: (): boolean => {
    const currentState = sidebarStorage.get();
    const newState = !currentState;
    sidebarStorage.set(newState);
    return newState;
  },
};

/**
 * Last active session management utilities
 */
export const sessionStorage = {
  get: (): string | undefined => {
    return getStorageValue(STORAGE_KEYS.LAST_ACTIVE_SESSION, DEFAULT_VALUES.lastActiveSession);
  },
  
  set: (sessionId: string): void => {
    setStorageValue(STORAGE_KEYS.LAST_ACTIVE_SESSION, sessionId);
  },
  
  clear: (): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_SESSION);
    }
  },
};

/**
 * Get all local storage data at once
 */
export const getAllStorageData = (): LocalStorageData => {
  return {
    theme: themeStorage.get(),
    sidebarPreference: sidebarStorage.get(),
    lastActiveSession: sessionStorage.get(),
  };
};

/**
 * Clear all application data from localStorage
 */
export const clearAllStorageData = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  Object.values(STORAGE_KEYS).forEach(key => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  });
};

/**
 * Hook-like utility for reactive storage updates
 * This can be used with React state to sync localStorage changes
 */
export const createStorageListener = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorageChange = (e: StorageEvent) => {
    if (Object.values(STORAGE_KEYS).includes(e.key as any)) {
      callback();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};