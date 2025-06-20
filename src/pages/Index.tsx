
import { useState, useMemo, useEffect } from 'react';
import { PantoneColor } from '@/data/pantoneData';
import { ColorDetails } from '@/components/ColorDetails';
import { PaletteManager } from '@/components/PaletteManager';
import { AppHeader } from '@/components/AppHeader';
import { SearchSection } from '@/components/SearchSection';
import { NearestMatches } from '@/components/NearestMatches';
import { ColorGrid } from '@/components/ColorGrid';
import { BackToTop } from '@/components/BackToTop';
import { searchPantones, setPantoneData } from '@/utils/pantoneUtils';
import { useLazyColors } from '@/hooks/useLazyColors';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Pantone colors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <AppHeader />

        {/* Main Interface */}
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="search">Search & Browse</TabsTrigger>
            <TabsTrigger value="palettes">My Palettes</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            {/* Sticky Search Section */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <SearchSection
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                colorFamily={colorFamily}
                onColorFamilyChange={setColorFamily}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onNearestMatch={handleNearestMatch}
              />
            </div>

            <NearestMatches
              nearestMatches={nearestMatches}
              onColorSelect={handleColorSelect}
            />

            <ColorGrid
              displayedColors={displayedColors}
              totalCount={totalCount}
              colorFamily={colorFamily}
              searchTerm={searchTerm}
              hasMore={hasMore}
              remainingCount={remainingCount}
              onLoadMore={loadMore}
              onColorSelect={handleColorSelect}
            />
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

        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </div>
  );
};

export default Index;
