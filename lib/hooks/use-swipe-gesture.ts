import { useRef, useState } from 'react';
import { TouchEvent } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  preventScroll?: boolean;
}

export function useSwipeGesture(options: SwipeGestureOptions = {}) {
  const { onSwipeLeft, onSwipeRight, threshold = 50, preventScroll = false } = options;
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].screenX;
    setIsSwiping(true);
    
    if (preventScroll) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
    setIsSwiping(false);
    
    if (preventScroll) {
      e.preventDefault();
    }
  };

  const handleSwipe = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(swipeDistance) < threshold) return;

    if (swipeDistance > 0) {
      onSwipeLeft?.();
    } else {
      onSwipeRight?.();
    }
  };

  return {
    isSwiping,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  };
}