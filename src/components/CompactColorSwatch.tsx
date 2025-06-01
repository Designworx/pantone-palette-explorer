
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { PantoneColor } from '@/data/pantoneData';

interface CompactColorSwatchProps {
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

export const CompactColorSwatch = ({ color }: CompactColorSwatchProps) => {
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
    <div className="relative">
      {/* Color Block */}
      <div 
        className="w-20 h-20 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-200"
        style={{ backgroundColor: color.HEX }}
        onClick={() => copyToClipboard(color.HEX, 'Hex')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      {/* Hover Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 w-48">
          <div className="text-sm font-semibold text-gray-900 mb-2 leading-tight">
            {color.PANTONENAME}
          </div>
          
          <div className="space-y-1 text-xs">
            <div 
              className="text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => copyToClipboard(color.HEX, 'Hex')}
            >
              <span className="font-medium">HEX:</span> {color.HEX}
            </div>
            
            <div 
              className="text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => copyToClipboard(`C:${color.C} M:${color.M} Y:${color.Y} K:${color.K}`, 'CMYK')}
            >
              <span className="font-medium">CMYK:</span> C:{color.C} M:{color.M} Y:{color.Y} K:{color.K}
            </div>
            
            <div className="text-gray-500">
              <span className="font-medium">RGB:</span> {color.R}, {color.G}, {color.B}
            </div>
          </div>
          
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}
    </div>
  );
};
