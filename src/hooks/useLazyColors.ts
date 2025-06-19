
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
    setDisplayCount(prev => Math.min(prev + loadMoreCount, colors.length));
  };

  const reset = () => {
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
