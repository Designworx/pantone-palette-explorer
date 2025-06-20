
import { PantoneColor } from '@/data/pantoneData';
import { ColorSwatch } from '@/components/ColorSwatch';
import { Button } from '@/components/ui/button';

interface ColorGridProps {
  displayedColors: PantoneColor[];
  totalCount: number;
  colorFamily: string;
  searchTerm: string;
  hasMore: boolean;
  remainingCount: number;
  onLoadMore: () => void;
  onColorSelect: (color: PantoneColor) => void;
}

export const ColorGrid = ({
  displayedColors,
  totalCount,
  colorFamily,
  searchTerm,
  hasMore,
  remainingCount,
  onLoadMore,
  onColorSelect
}: ColorGridProps) => {
  if (displayedColors.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            🎨
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No colors found</h3>
        <p className="text-gray-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  const handleLoadMore = () => {
    console.log(`Load More button clicked. Has more: ${hasMore}, Remaining: ${remainingCount}`);
    onLoadMore();
  };

  return (
    <>
      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Showing {displayedColors.length} of {totalCount} colors
          {colorFamily !== 'All' && ` in ${colorFamily}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {displayedColors.map((color, index) => (
          <ColorSwatch
            key={`${color.PANTONENAME}-${color.HEX}-${index}`}
            color={color}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
            className="px-8"
          >
            Load More ({remainingCount} remaining)
          </Button>
        </div>
      )}
    </>
  );
};
