
import { useState, useMemo, useCallback } from 'react';
import { PantoneColor } from '@/data/pantoneData';

interface UseLazyColorsProps {
  colors: PantoneColor[];
  initialCount?: number;
  loadMoreCount?: number;
}

export const useLazyColors = ({ 
  colors, 
  initialCount = 64, 
  loadMoreCount = 64 
}: UseLazyColorsProps) => {
  const [displayCount, setDisplayCount] = useState(initialCount);

  const displayedColors = useMemo(() => {
    console.log(`Displaying ${Math.min(displayCount, colors.length)} of ${colors.length} colors`);
    return colors.slice(0, displayCount);
  }, [colors, displayCount]);

  const hasMore = displayCount < colors.length;
  const remainingCount = Math.max(0, colors.length - displayCount);

  const loadMore = useCallback(() => {
    console.log(`Loading more colors. Current: ${displayCount}, Total: ${colors.length}, Will load: ${loadMoreCount}`);
    setDisplayCount(prev => {
      const newCount = Math.min(prev + loadMoreCount, colors.length);
      console.log(`Updated display count from ${prev} to ${newCount}`);
      return newCount;
    });
  }, [displayCount, colors.length, loadMoreCount]);

  const reset = useCallback(() => {
    console.log(`Resetting display count to ${initialCount}`);
    setDisplayCount(initialCount);
  }, [initialCount]);

  return {
    displayedColors,
    hasMore,
    remainingCount,
    loadMore,
    reset,
    totalCount: colors.length,
    displayCount
  };
};
