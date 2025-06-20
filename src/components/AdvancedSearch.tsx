

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Palette, Info } from 'lucide-react';
import { findNearestPantones } from '@/utils/pantoneUtils';
import { PantoneColor } from '@/data/pantoneData';

interface AdvancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  colorFamily: string;
  onColorFamilyChange: (family: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onNearestMatch: (colors: Array<PantoneColor & { deltaE: number }>) => void;
}

export const AdvancedSearch = ({
  searchTerm,
  onSearchChange,
  colorFamily,
  onColorFamilyChange,
  sortBy,
  onSortChange,
  onNearestMatch
}: AdvancedSearchProps) => {
  const [hexInput, setHexInput] = useState('');

  const handleFindNearest = () => {
    if (hexInput) {
      const nearest = findNearestPantones(hexInput, 3);
      onNearestMatch(nearest);
    }
  };

  const colorFamilies = [
    'All', 'Reds', 'Yellows', 'Greens', 'Blues', 'Cyans', 'Magentas', 'Neutrals'
  ];

  return (
    <TooltipProvider>
      <div className="space-y-4 sticky top-0 z-50 bg-white dark:bg-gray-900 py-4">
        {/* Main Search */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search Pantone colors by name or number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2.5">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-blue-600 hover:text-blue-700 cursor-help flex-shrink-0 transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-white border-gray-700">
                <p>Filter by color family group</p>
              </TooltipContent>
            </Tooltip>
            <Select value={colorFamily} onValueChange={onColorFamilyChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Color Family" />
              </SelectTrigger>
              <SelectContent>
                {colorFamilies.map(family => (
                  <SelectItem key={family} value={family}>{family}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-blue-600 hover:text-blue-700 cursor-help flex-shrink-0 transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-white border-gray-700">
                <p>Sort results by different criteria</p>
              </TooltipContent>
            </Tooltip>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="lightness">Lightness</SelectItem>
                <SelectItem value="chroma">Chroma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-blue-600 hover:text-blue-700 cursor-help flex-shrink-0 transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-white border-gray-700">
                <p>Find closest Pantone matches for hex color</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex flex-1">
              <Input
                type="text"
                placeholder="Enter hex color (#FF0000)"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                className="h-10 rounded-r-none border-r-0 focus:z-10"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={handleFindNearest} 
                    className="h-10 px-3 rounded-l-none border-l-0"
                  >
                    <Palette className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white border-gray-700">
                  <p>Find nearest Pantone matches</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

