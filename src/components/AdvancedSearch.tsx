
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  onNearestMatch: (colors: Array<PantoneColor & {
    deltaE: number;
  }>) => void;
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
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const handleFindNearest = () => {
    if (hexInput) {
      const nearest = findNearestPantones(hexInput, 3);
      onNearestMatch(nearest);
    }
  };
  const handlePopoverChange = (popoverId: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenPopover(popoverId);
    } else if (openPopover === popoverId) {
      setOpenPopover(null);
    }
  };
  const colorFamilies = ['All', 'Reds', 'Yellows', 'Greens', 'Blues', 'Cyans', 'Magentas', 'Neutrals'];

  // Helper component for mobile-friendly info icons
  const InfoIcon = ({
    content,
    popoverId
  }: {
    content: string;
    popoverId: string;
  }) => <>
      {/* Desktop tooltip */}
      <div className="hidden md:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-help flex-shrink-0 transition-colors" />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white border-gray-700">
            <p>{content}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Mobile/tablet popover */}
      <div className="md:hidden">
        <Popover open={openPopover === popoverId} onOpenChange={isOpen => handlePopoverChange(popoverId, isOpen)}>
          <PopoverTrigger asChild>
            <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation">
              <Info className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer flex-shrink-0 transition-colors" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-800 text-white border-gray-700 w-64">
            <p className="text-sm">{content}</p>
          </PopoverContent>
        </Popover>
      </div>
    </>;
  return <TooltipProvider>
      <div className="space-y-6 sticky top-0 z-50 py-6 bg-gray-50 dark:bg-gray-900 px-[10px] mx-0 my-0">
        {/* Main Search */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input type="text" placeholder="Search Pantone colors by name or number..." value={searchTerm} onChange={e => onSearchChange(e.target.value)} className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors" />
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
          <div className="flex items-center gap-2">
            <InfoIcon content="Filter by color family group" popoverId="colorFamily" />
            <Select value={colorFamily} onValueChange={onColorFamilyChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Color Family" />
              </SelectTrigger>
              <SelectContent>
                {colorFamilies.map(family => <SelectItem key={family} value={family}>{family}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <InfoIcon content="Sort results by different criteria" popoverId="sortBy" />
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
            <InfoIcon content="Find closest Pantone matches for hex color" popoverId="nearestMatch" />
            <div className="flex flex-1">
              <Input type="text" placeholder="Enter hex color (#FF0000)" value={hexInput} onChange={e => setHexInput(e.target.value)} className="h-10 rounded-r-none border-r-0 focus:z-10" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleFindNearest} className="h-10 px-3 rounded-l-none border-l-0">
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
    </TooltipProvider>;
};
