'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run performance monitoring in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Navigation timing:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            firstPaint: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
          });
        }
        
        if (entry.entryType === 'paint') {
          console.log(`${entry.name}: ${entry.startTime}ms`);
        }
      });
    });

    // Observe navigation and paint events
    observer.observe({ entryTypes: ['navigation', 'paint'] });

    // Monitor memory usage if available (throttled to avoid spam)
    let lastMemoryLog = 0;
    const logMemoryUsage = () => {
      const now = Date.now();
      if (now - lastMemoryLog > 5000 && 'memory' in performance) { // Log every 5 seconds max
        const memoryInfo = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memoryInfo.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memoryInfo.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memoryInfo.jsHeapSizeLimit / 1048576) + ' MB',
        });
        lastMemoryLog = now;
      }
    };

    // Log memory usage once on load
    logMemoryUsage();

    return () => {
      observer.disconnect();
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}