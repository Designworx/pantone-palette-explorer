
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Palette } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import { findNearestPantones } from '@/utils/pantoneUtils';
import { PantoneColor } from '@/data/pantoneData';

interface HexColorMatcherProps {
  onNearestMatch: (colors: Array<PantoneColor & { deltaE: number }>) => void;
  openPopover: string | null;
  onPopoverChange: (popoverId: string, isOpen: boolean) => void;
}

export const HexColorMatcher = ({
  onNearestMatch,
  openPopover,
  onPopoverChange
}: HexColorMatcherProps) => {
  const [hexInput, setHexInput] = useState('');
  
  const handleFindNearest = () => {
    if (hexInput) {
      // Normalize hex input - add # if not present and ensure proper format
      let normalizedHex = hexInput.trim();
      if (!normalizedHex.startsWith('#')) {
        normalizedHex = '#' + normalizedHex;
      }
      const nearest = findNearestPantones(normalizedHex, 3);
      onNearestMatch(nearest);
    }
  };

  const handleHexInputChange = (value: string) => {
    // Allow user to type with or without #, but don't force it in the display
    setHexInput(value);
  };

  return (
    <div className="flex items-center gap-2">
      <InfoTooltip 
        content="Find closest Pantone matches for hex color" 
        popoverId="nearestMatch"
        openPopover={openPopover}
        onPopoverChange={onPopoverChange}
      />
      <div className="flex flex-1">
        <Input 
          type="text" 
          placeholder="Enter hex color (FF0000 or #FF0000)" 
          value={hexInput} 
          onChange={(e) => handleHexInputChange(e.target.value)}
          className="h-10 rounded-r-none border-r-0 focus:z-10" 
        />
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
  );
};
