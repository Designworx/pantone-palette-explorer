
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { PantoneColor } from '@/data/pantoneData';

interface ColorSwatchProps {
  color: PantoneColor;
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

export const ColorSwatch = ({ color }: ColorSwatchProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const textColor = getTextColor(color.HEX);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${type}: ${text}`,
      duration: 2000,
    });
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Color Swatch */}
      <div 
        className="h-32 w-full relative transition-all duration-300"
        style={{ backgroundColor: color.HEX }}
        onClick={() => copyToClipboard(color.HEX, 'Hex')}
      >
        {isHovered && (
          <div 
            className="absolute inset-0 flex items-center justify-center text-sm font-medium transition-opacity duration-300"
            style={{ color: textColor }}
          >
            Click to copy hex
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
            onClick={() => copyToClipboard(color.HEX, 'Hex')}
          >
            <span className="font-medium">HEX:</span> {color.HEX}
          </div>
          
          <div 
            className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => copyToClipboard(`C:${color.C} M:${color.M} Y:${color.Y} K:${color.K}`, 'CMYK')}
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
