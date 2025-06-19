
import { useState, useMemo, useEffect } from 'react';
import { PantoneColor } from '@/data/pantoneData';
import { ColorSwatch } from '@/components/ColorSwatch';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { ColorDetails } from '@/components/ColorDetails';
import { PaletteManager } from '@/components/PaletteManager';
import { searchPantones, setPantoneData } from '@/utils/pantoneUtils';
import { useLazyColors } from '@/hooks/useLazyColors';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IndexProps {
  preloadedData?: PantoneColor[];
}

const Index = ({ preloadedData }: IndexProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFamily, setColorFamily] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedColor, setSelectedColor] = useState<PantoneColor | null>(null);
  const [nearestMatches, setNearestMatches] = useState<Array<PantoneColor & { deltaE: number }>>([]);
  const [selectedColorDeltaE, setSelectedColorDeltaE] = useState<number | undefined>();
  const [dataInitialized, setDataInitialized] = useState(false);

  // Use preloaded data and initialize the utils
  const PantoneData = preloadedData || [];

  // Initialize the pantone utils with preloaded data
  useEffect(() => {
    if (preloadedData && preloadedData.length > 0) {
      console.log(`Initializing Pantone data with ${preloadedData.length} colors`);
      setPantoneData(preloadedData);
      setDataInitialized(true);
    }
  }, [preloadedData]);

  const filteredColors = useMemo(() => {
    if (!dataInitialized) {
      console.log('Data not initialized yet, returning empty array');
      return [];
    }
    console.log(`Searching with term: "${searchTerm}", family: "${colorFamily}", sort: "${sortBy}"`);
    const results = searchPantones(searchTerm, colorFamily, sortBy);
    console.log(`Search returned ${results.length} colors`);
    return results;
  }, [searchTerm, colorFamily, sortBy, dataInitialized]);

  const {
    displayedColors,
    hasMore,
    remainingCount,
    loadMore,
    reset,
    totalCount
  } = useLazyColors({
    colors: filteredColors,
    initialCount: 64,
    loadMoreCount: 64
  });

  // Reset lazy loading when filters change
  useEffect(() => {
    reset();
  }, [searchTerm, colorFamily, sortBy, reset]);

  const handleNearestMatch = (colors: Array<PantoneColor & { deltaE: number }>) => {
    setNearestMatches(colors);
  };

  const handleColorSelect = (color: PantoneColor, deltaE?: number) => {
    setSelectedColor(color);
    setSelectedColorDeltaE(deltaE);
  };

  // Show loading state if data isn't initialized yet
  if (!dataInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Pantone colors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional Pantone Search
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced Pantone Solid Coated color tool with ΔE matching, palette management, and professional export options
          </p>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="search">Search & Browse</TabsTrigger>
            <TabsTrigger value="palettes">My Palettes</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            {/* Search Controls */}
            <div className="max-w-4xl mx-auto mb-8">
              <AdvancedSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                colorFamily={colorFamily}
                onColorFamilyChange={setColorFamily}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onNearestMatch={handleNearestMatch}
              />
            </div>

            {/* Nearest Matches Results */}
            {nearestMatches.length > 0 && (
              <div className="max-w-4xl mx-auto mb-8">
                <h3 className="text-lg font-semibold mb-4">Nearest Pantone Matches</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {nearestMatches.map((color, index) => (
                    <div key={index} className="relative">
                      <ColorSwatch
                        color={color}
                        onClick={() => handleColorSelect(color, color.deltaE)}
                      />
                      <Badge
                        variant={color.deltaE > 5 ? "destructive" : "secondary"}
                        className="absolute top-2 right-2"
                      >
                        ΔE: {color.deltaE.toFixed(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Showing {displayedColors.length} of {totalCount} colors
                {colorFamily !== 'All' && ` in ${colorFamily}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* Color Grid with responsive layout */}
            {displayedColors.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {displayedColors.map((color, index) => (
                    <ColorSwatch
                      key={index}
                      color={color}
                      onClick={() => handleColorSelect(color)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      size="lg"
                      className="px-8"
                    >
                      Load More ({remainingCount} remaining)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    🎨
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No colors found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="palettes">
            <div className="max-w-6xl mx-auto">
              <PaletteManager onColorSelect={handleColorSelect} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Color Details Modal */}
        {selectedColor && (
          <ColorDetails
            color={selectedColor}
            deltaE={selectedColorDeltaE}
            onClose={() => {
              setSelectedColor(null);
              setSelectedColorDeltaE(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
