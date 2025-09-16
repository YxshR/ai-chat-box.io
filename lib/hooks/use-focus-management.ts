import { useEffect, useRef } from 'react';

interface FocusManagementOptions {
  autoFocus?: boolean;
  restoreFocus?: boolean;
  trapFocus?: boolean;
}

export function useFocusManagement(options: FocusManagementOptions = {}) {
  const { autoFocus = false, restoreFocus = false, trapFocus = false } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (autoFocus && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    if (restoreFocus) {
      previousActiveElement.current = document.activeElement;
    }

    return () => {
      if (restoreFocus && previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus?.();
      }
    };
  }, [autoFocus, restoreFocus]);

  const focusFirst = () => {
    if (!containerRef.current) return;
    
    const firstFocusable = containerRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (firstFocusable) {
      firstFocusable.focus();
    }
  };

  const focusLast = () => {
    if (!containerRef.current) return;
    
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    if (lastFocusable) {
      lastFocusable.focus();
    }
  };

  return {
    containerRef,
    focusFirst,
    focusLast,
  };
}