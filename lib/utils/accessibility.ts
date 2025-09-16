// Accessibility utility functions

let idCounter = 0;

/**
 * Generate a unique ID for accessibility purposes
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Announce a message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove the element after a short delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Get attributes for live regions
 */
export function getLiveRegionAttributes(priority: 'polite' | 'assertive' = 'polite', atomic: boolean = false) {
  return {
    'aria-live': priority,
    'aria-atomic': atomic,
  };
}

/**
 * Get validation attributes for form elements
 */
export function getValidationAttributes(isValid: boolean, errorMessage?: string) {
  return {
    'aria-invalid': !isValid,
    'aria-describedby': errorMessage ? generateId('error') : undefined,
  };
}

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Focus an element and scroll it into view
   */
  focusElement(element: HTMLElement | null): void {
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  /**
   * Focus the first focusable element within a container
   */
  focusFirstElement(container: HTMLElement): void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    this.focusElement(firstElement);
  },

  /**
   * Trap focus within a container (useful for modals)
   */
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
};