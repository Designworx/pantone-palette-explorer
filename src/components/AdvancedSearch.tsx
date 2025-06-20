
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PantoneColor } from '@/data/pantoneData';
import { MainSearchInput } from './MainSearchInput';
import { ColorFamilyFilter } from './ColorFamilyFilter';
import { SortOptions } from './SortOptions';
import { HexColorMatcher } from './HexColorMatcher';

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
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  const handlePopoverChange = (popoverId: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenPopover(popoverId);
    } else if (openPopover === popoverId) {
      setOpenPopover(null);
    }
  };

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    // Reset all filters to defaults when user starts typing
    if (value) {
      if (colorFamily !== 'All') {
        onColorFamilyChange('All');
      }
      if (sortBy !== 'name') {
        onSortChange('name');
      }
    }
  };
    
  return (
    <TooltipProvider>
      <div className="space-y-8 sticky top-0 py-8 bg-gray-50 dark:bg-gray-900 px-[10px] mx-0 my-0 z-50">
        {/* Main Search - Made More Prominent */}
        <MainSearchInput 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        {/* More/Less Options Button */}
        <Collapsible open={showMoreOptions} onOpenChange={setShowMoreOptions}>
          <div className="flex justify-center">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-sm transition-all duration-200"
              >
                {showMoreOptions ? (
                  <>
                    Less options
                    <ChevronUp className="h-4 w-4 transition-transform duration-200" />
                  </>
                ) : (
                  <>
                    More options
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* Collapsible Filters with smooth slide animation */}
          <CollapsibleContent className="overflow-visible data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <ColorFamilyFilter
                colorFamily={colorFamily}
                onColorFamilyChange={onColorFamilyChange}
                openPopover={openPopover}
                onPopoverChange={handlePopoverChange}
              />

              <SortOptions
                sortBy={sortBy}
                onSortChange={onSortChange}
                openPopover={openPopover}
                onPopoverChange={handlePopoverChange}
              />

              <HexColorMatcher
                onNearestMatch={onNearestMatch}
                openPopover={openPopover}
                onPopoverChange={handlePopoverChange}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  );
};
