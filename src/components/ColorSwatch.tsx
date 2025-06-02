
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PantoneColor } from '@/data/pantoneData';
import { usePalette } from '@/hooks/usePalette';

interface ColorSwatchProps {
  color: PantoneColor;
  onClick?: () => void;
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
    e.stopPropagation();
    if (isSaved(color.PANTONENAME)) {
      removeFromSaved(color.PANTONENAME);
      toast({
        title: "Removed from saved",
        description: `${color.PANTONENAME} removed`,
      });
    } else {
      addToSaved(color);
      toast({
        title: "Added to saved",
        description: `${color.PANTONENAME} saved`,
      });
    }
  };

  const handleClick = () => {
    addToRecent(color);
    onClick?.();
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Color Swatch */}
      <div 
        className="h-32 w-full relative transition-all duration-300"
        style={{ backgroundColor: color.HEX }}
      >
        {/* Star button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 h-8 w-8 p-0 ${
            isHovered || isSaved(color.PANTONENAME) ? 'opacity-100' : 'opacity-0'
          } transition-opacity hover:bg-white/20`}
          onClick={toggleSaved}
        >
          <Star className={`h-4 w-4 ${isSaved(color.PANTONENAME) ? 'fill-current' : ''}`} style={{ color: textColor }} />
        </Button>

        {isHovered && (
          <div 
            className="absolute inset-0 flex items-center justify-center text-sm font-medium transition-opacity duration-300 bg-black bg-opacity-10"
            style={{ color: textColor }}
          >
            Click for details
          </div>
        )}
      </div>
      
      {/* Color Information */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm text-gray-900 leading-tight">
          {color.PANTONENAME}
        </h3>
        
        <div className="space-y-1">
          <div 
            className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={(e) => copyToClipboard(color.HEX, 'Hex', e)}
          >
            <span className="font-medium">HEX:</span> {color.HEX}
          </div>
          
          <div 
            className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={(e) => copyToClipboard(`C:${color.C} M:${color.M} Y:${color.Y} K:${color.K}`, 'CMYK', e)}
          >
            <span className="font-medium">CMYK:</span> C:{color.C} M:{color.M} Y:{color.Y} K:{color.K}
          </div>
          
          <div className="text-xs text-gray-500">
            <span className="font-medium">RGB:</span> {color.R}, {color.G}, {color.B}
          </div>
        </div>
      </div>
    </Card>
  );
};
