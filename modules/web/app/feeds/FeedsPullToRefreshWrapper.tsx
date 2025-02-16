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
  const threshold = 70; // pixels to trigger refresh
  const containerRef = useRef<HTMLDivElement>(null);

  // Use native event listeners with passive: false to override default pull-to-refresh
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStartNative = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        setPullStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMoveNative = (e: TouchEvent) => {
      if (pullStartY !== null) {
        const currentY = e.touches[0].clientY;
        const distance = currentY - pullStartY;
        if (distance > 0) {
          e.preventDefault();
          setPullDistance(distance);
        }
      }
    };

    const handleTouchEndNative = () => {
      if (pullDistance > threshold) {
        onRefresh();
        // Delay resetting the pull state to allow the CSS transition to complete
        setTimeout(() => {
          setPullStartY(null);
          setPullDistance(0);
        }, 200);
      } else {
        setPullStartY(null);
        setPullDistance(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStartNative, {
      passive: false,
    });
    container.addEventListener('touchmove', handleTouchMoveNative, {
      passive: false,
    });
    container.addEventListener('touchend', handleTouchEndNative, {
      passive: false,
    });

    return () => {
      container.removeEventListener('touchstart', handleTouchStartNative);
      container.removeEventListener('touchmove', handleTouchMoveNative);
      container.removeEventListener('touchend', handleTouchEndNative);
    };
  }, [pullStartY, pullDistance, onRefresh]);

  return (
    <div
      ref={containerRef}
      style={{
        touchAction: 'pan-y',
        backgroundColor: '#0f083c',
        minHeight: '100vh',
        overscrollBehaviorY: 'contain',
        transform: `translateY(${pullDistance}px)`,
        transition: pullStartY ? 'none' : 'transform 0.2s ease-out',
      }}>
      {children}
    </div>
  );
};

export default FeedsPullToRefreshWrapper;
