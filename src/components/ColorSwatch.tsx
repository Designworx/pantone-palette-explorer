
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PantoneColor } from '@/data/pantoneData';
import { usePalette } from '@/hooks/usePalette';

interface ColorSwatchProps {
  color: PantoneColor;
  onClick?: (color: PantoneColor) => void;
}

// Function to determine if text should be light or dark based on background
const getTextColor = (hex: string) => {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export const ColorSwatch = ({ color, onClick }: ColorSwatchProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToSaved, removeFromSaved, isSaved, addToRecent } = usePalette();
  const textColor = getTextColor(color.HEX);
  const colorIsSaved = isSaved(color.PANTONENAME);

  const copyToClipboard = (text: string, type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${type}: ${text}`,
      duration: 2000,
    });
  };

  const toggleSaved = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Toggling save for ${color.PANTONENAME}, currently saved: ${colorIsSaved}`);
    
    if (colorIsSaved) {
      removeFromSaved(color.PANTONENAME);
      toast({
        title: "Removed from saved",
        description: `${color.PANTONENAME} removed from favorites`,
      });
    } else {
      const wasAdded = addToSaved(color);
      if (wasAdded) {
        toast({
          title: "Added to saved",
          description: `${color.PANTONENAME} saved to favorites`,
        });
      }
      // If wasAdded is false, the addToSaved function already shows the limit reached toast
    }
  };

  const handleClick = () => {
    addToRecent(color);
    onClick?.(color);
  };
  
  return (
    <TooltipProvider>
      <Card 
        className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer bg-card dark:bg-card relative z-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Color Swatch */}
        <div 
          className="h-32 w-full relative transition-all duration-300"
          style={{ backgroundColor: color.HEX }}
        >
          {/* Heart button - always visible on mobile/tablet, hover on desktop */}
          <button
            className={`absolute top-2 right-2 h-8 w-8 p-0 rounded-full transition-all duration-200 flex items-center justify-center z-[1] ${
              colorIsSaved 
                ? 'opacity-100 bg-white/30 backdrop-blur-sm' 
                : `opacity-100 md:opacity-0 bg-white/20 backdrop-blur-sm hover:bg-white/40 ${isHovered ? 'md:opacity-100' : ''}`
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaved(e);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            title={colorIsSaved ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              className={`h-4 w-4 transition-all duration-200 ${
                colorIsSaved ? 'fill-current scale-110 text-gray-600' : ''
              }`} 
              style={{ color: colorIsSaved ? '#4b5563' : textColor }} 
            />
          </button>

          {/* Hover overlay */}
          {isHovered && !colorIsSaved && (
            <div 
              className="absolute inset-0 flex items-center justify-center text-sm font-medium transition-opacity duration-300 bg-black bg-opacity-10"
              style={{ color: textColor }}
            >
              Click for details
            </div>
          )}

          {/* Saved indicator */}
          {colorIsSaved && (
            <div className="absolute bottom-2 left-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-800">
                Saved
              </div>
            </div>
          )}
        </div>
        
        {/* Color Information */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-foreground leading-tight flex-1">
              {color.PANTONENAME}
            </h3>
          </div>
          
          <div className="space-y-1">
            <div 
              className="text-xs text-muted-foreground cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={(e) => copyToClipboard(color.HEX, 'Hex', e)}
            >
              <span className="font-medium">HEX:</span> {color.HEX}
            </div>
            
            <div 
              className="text-xs text-muted-foreground cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={(e) => copyToClipboard(`C:${color.C} M:${color.M} Y:${color.Y} K:${color.K}`, 'CMYK', e)}
            >
              <span className="font-medium">CMYK:</span> C:{color.C} M:{color.M} Y:{color.Y} K:{color.K}
            </div>
            
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">RGB:</span> {color.R}, {color.G}, {color.B}
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};
