'use client';

import React, {useEffect, useRef, useState} from 'react';

interface FeedsPullToRefreshWrapperProps {
  children: React.ReactNode;
  onRefresh: () => void;
}

const FeedsPullToRefreshWrapper: React.FC<FeedsPullToRefreshWrapperProps> = ({
  children,
  onRefresh,
}) => {
  const [pullStartY, setPullStartY] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const threshold = 70; // pixels to trigger refresh
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Use touch events on the window to detect pull-to-refresh gestures
  useEffect(() => {
    // Function to check if we're at the top of the page
    const isAtTop = () => {
      return window.scrollY <= 0;
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Only initialize pull-to-refresh when at the very top of the page
      if (isAtTop()) {
        setPullStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Only process when we have a valid start point and we're at the top
      if (pullStartY !== null && isAtTop()) {
        const currentY = e.touches[0].clientY;
        const distance = currentY - pullStartY;

        // Only handle pull-down gestures (positive distance)
        if (distance > 0) {
          // Prevent the browser's native pull-to-refresh
          e.preventDefault();

          // Apply resistance factor for more natural feel
          setPullDistance(distance * 0.4);
        } else {
          // User is trying to scroll up/down normally, cancel our pull gesture
          setPullStartY(null);
          setPullDistance(0);
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > threshold && !isRefreshing) {
        // Threshold reached, trigger refresh
        setIsRefreshing(true);
        onRefresh();

        // Reset state after animation completes
        setTimeout(() => {
          setPullStartY(null);
          setPullDistance(0);
          setIsRefreshing(false);
        }, 300);
      } else {
        // Reset without triggering refresh
        setPullStartY(null);
        setPullDistance(0);
      }
    };

    // Add event listeners to the window
    window.addEventListener('touchstart', handleTouchStart, {passive: true});
    window.addEventListener('touchmove', handleTouchMove, {passive: false});
    window.addEventListener('touchend', handleTouchEnd, {passive: true});

    return () => {
      // Clean up listeners
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullStartY, pullDistance, isRefreshing, onRefresh, threshold]);

  // Loading spinner component
  const LoadingSpinner = () => (
    <div
      style={{
        opacity: Math.min(1, pullDistance / threshold),
        width: '24px',
        height: '24px',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        borderTop: '3px solid #fff',
        animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
      }}
    />
  );

  return (
    <div style={{backgroundColor: '#0f083c', minHeight: '100vh'}}>
      {/* Background overlay to ensure consistent dark background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#0f083c',
          zIndex: 900,
          pointerEvents: 'none',
          opacity: pullDistance > 0 ? 1 : 0,
          transition: 'opacity 0.2s ease-out',
        }}
      />

      {/* Pull-to-refresh indicator */}
      <div
        ref={indicatorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: `${pullDistance}px`,
          backgroundColor: '#0f083c',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          transition: pullStartY ? 'none' : 'height 0.2s ease-out',
        }}>
        {pullDistance > 0 && <LoadingSpinner />}
      </div>

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 950,
          marginTop: `${pullDistance}px`,
          transition: pullStartY ? 'none' : 'margin-top 0.2s ease-out',
        }}>
        {children}
      </div>

      {/* Add CSS for spinner animation */}
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FeedsPullToRefreshWrapper;
