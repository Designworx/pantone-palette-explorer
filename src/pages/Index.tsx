
import { useState, useMemo } from 'react';
import { PantoneData, PantoneColor } from '@/data/pantoneData';
import { ColorSwatch } from '@/components/ColorSwatch';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { ColorDetails } from '@/components/ColorDetails';
import { PaletteManager } from '@/components/PaletteManager';
import { searchPantones } from '@/utils/pantoneUtils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFamily, setColorFamily] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedColor, setSelectedColor] = useState<PantoneColor | null>(null);
  const [nearestMatches, setNearestMatches] = useState<Array<PantoneColor & { deltaE: number }>>([]);
  const [selectedColorDeltaE, setSelectedColorDeltaE] = useState<number | undefined>();

  const filteredColors = useMemo(() => {
    return searchPantones(searchTerm, colorFamily, sortBy);
  }, [searchTerm, colorFamily, sortBy]);

  const handleNearestMatch = (colors: Array<PantoneColor & { deltaE: number }>) => {
    setNearestMatches(colors);
  };

  const handleColorSelect = (color: PantoneColor, deltaE?: number) => {
    setSelectedColor(color);
    setSelectedColorDeltaE(deltaE);
  };

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                Showing {filteredColors.length} of {PantoneData.length} colors
                {colorFamily !== 'All' && ` in ${colorFamily}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* Color Grid */}
            {filteredColors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredColors.map((color, index) => (
                  <ColorSwatch
                    key={index}
                    color={color}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
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
