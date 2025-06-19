
import { useState, useMemo } from 'react';
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
    return colors.slice(0, displayCount);
  }, [colors, displayCount]);

  const hasMore = displayCount < colors.length;
  const remainingCount = colors.length - displayCount;

  const loadMore = () => {
    console.log(`Loading ${loadMoreCount} more colors. Current: ${displayCount}, Total: ${colors.length}`);
    setDisplayCount(prev => {
      const newCount = Math.min(prev + loadMoreCount, colors.length);
      console.log(`New display count: ${newCount}`);
      return newCount;
    });
  };

  const reset = () => {
    console.log(`Resetting to initial count: ${initialCount}`);
    setDisplayCount(initialCount);
  };

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
