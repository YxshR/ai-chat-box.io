import { useEffect, useState } from 'react';

interface MobileKeyboardOptions {
  adjustViewport?: boolean;
  onKeyboardShow?: () => void;
  onKeyboardHide?: () => void;
}

export function useMobileKeyboard(options: MobileKeyboardOptions = {}) {
  const { adjustViewport = false, onKeyboardShow, onKeyboardHide } = options;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialHeight = window.visualViewport?.height || window.innerHeight;
    setViewportHeight(initialHeight);

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      
      // Consider keyboard open if viewport shrunk by more than 150px
      const keyboardOpen = heightDifference > 150;
      setIsKeyboardOpen(keyboardOpen);
      setIsKeyboardVisible(keyboardOpen);
      setViewportHeight(currentHeight);

      if (keyboardOpen && onKeyboardShow) {
        onKeyboardShow();
      } else if (!keyboardOpen && onKeyboardHide) {
        onKeyboardHide();
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    } else {
      window.addEventListener('resize', handleViewportChange);
      return () => {
        window.removeEventListener('resize', handleViewportChange);
      };
    }
  }, [onKeyboardShow, onKeyboardHide]);

  return {
    isKeyboardOpen,
    isKeyboardVisible,
    viewportHeight,
  };
}