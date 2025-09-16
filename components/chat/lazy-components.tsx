"use client";

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load heavy components with loading fallbacks
export const LazyVirtualizedMessageList = dynamic(
  () => import('./virtualized-message-list').then(mod => ({ default: mod.VirtualizedMessageList })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-sm text-muted-foreground">Loading messages...</span>
      </div>
    ),
    ssr: false // Virtualization doesn't need SSR
  }
);

// Lazy load theme toggle (not critical for initial render)
export const LazyThemeToggle = dynamic(
  () => import('@/components/ui/theme-toggle').then(mod => ({ default: mod.ThemeToggle })),
  {
    loading: () => <div className="w-9 h-9 rounded-md bg-muted animate-pulse" />,
    ssr: false
  }
);

// Lazy load error components (only loaded when needed)
export const LazyErrorBoundary = dynamic(
  () => import('@/components/error/error-boundary').then(mod => ({ default: mod.ErrorBoundary })),
  {
    loading: () => null,
    ssr: true // Error boundaries should work on server
  }
);

// Preload components that are likely to be used
export const preloadChatComponents = () => {
  // Preload virtualized list when user has many messages
  import('./virtualized-message-list');
  
  // Preload theme toggle
  import('@/components/ui/theme-toggle');
};

// Helper to create lazy component with better TypeScript support
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
): T {
  const FallbackComponent = fallback;
  return dynamic(importFn, {
    loading: FallbackComponent ? () => <FallbackComponent /> : undefined,
    ssr: false
  }) as T;
}