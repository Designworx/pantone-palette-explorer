
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { PantoneData } from '@/data/pantoneData';
import { ColorSwatch } from '@/components/ColorSwatch';
import { CompactColorSwatch } from '@/components/CompactColorSwatch';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('detailed');

  const filteredColors = useMemo(() => {
    if (!searchTerm) return PantoneData;
    
    return PantoneData.filter(color =>
      color.PANTONENAME.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pantone Color Search
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search through our comprehensive collection of Pantone colors with hex values
          </p>
        </div>

        {/* Search Bar and View Selector */}
        <div className="max-w-md mx-auto mb-8 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search Pantone colors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
            />
          </div>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-40 h-12 border-2 border-gray-200">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="detailed">Detailed</SelectItem>
              <SelectItem value="compact">Colors Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Showing {filteredColors.length} of {PantoneData.length} colors
          </p>
        </div>

        {/* Color Grid */}
        {filteredColors.length > 0 ? (
          <div className={
            viewMode === 'compact' 
              ? "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          }>
            {filteredColors.map((color, index) => (
              viewMode === 'compact' ? (
                <CompactColorSwatch key={index} color={color} />
              ) : (
                <ColorSwatch key={index} color={color} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No colors found</h3>
            <p className="text-gray-500">Try adjusting your search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
