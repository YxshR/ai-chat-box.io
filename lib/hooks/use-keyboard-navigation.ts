import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onTab?: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onTab,
    enabled = true,
    preventDefault = true,
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    switch (event.key) {
      case 'ArrowUp':
        if (preventDefault) event.preventDefault();
        onArrowUp?.();
        break;
      case 'ArrowDown':
        if (preventDefault) event.preventDefault();
        onArrowDown?.();
        break;
      case 'ArrowLeft':
        if (preventDefault) event.preventDefault();
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        if (preventDefault) event.preventDefault();
        onArrowRight?.();
        break;
      case 'Enter':
        if (preventDefault) event.preventDefault();
        onEnter?.();
        break;
      case 'Escape':
        if (preventDefault) event.preventDefault();
        onEscape?.();
        break;
      case 'Tab':
        if (preventDefault) event.preventDefault();
        onTab?.();
        break;
    }
  }, [enabled, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onEnter, onEscape, onTab]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  return {
    handleKeyDown,
  };
}