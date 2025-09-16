import { useMemo } from 'react';

interface UseVirtualizationProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  threshold?: number;
}

interface VirtualizationResult {
  shouldVirtualize: boolean;
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
}

/**
 * Hook for determining if virtualization should be used and calculating visible range
 */
export function useVirtualization({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5,
  threshold = 50
}: UseVirtualizationProps): VirtualizationResult {
  return useMemo(() => {
    const shouldVirtualize = itemCount > threshold;
    
    if (!shouldVirtualize) {
      return {
        shouldVirtualize: false,
        startIndex: 0,
        endIndex: itemCount - 1,
        totalHeight: itemCount * itemHeight,
        offsetY: 0
      };
    }

    // Calculate visible range
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, 0 - overscan); // For now, start from beginning
    const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + overscan * 2);
    
    return {
      shouldVirtualize: true,
      startIndex,
      endIndex,
      totalHeight: itemCount * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [itemCount, itemHeight, containerHeight, overscan, threshold]);
}