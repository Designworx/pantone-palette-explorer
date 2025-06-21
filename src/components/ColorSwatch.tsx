
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
  const [showRipple, setShowRipple] = useState(false);
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
        // Trigger ripple effect when successfully adding to favorites
        setShowRipple(true);
        setTimeout(() => setShowRipple(false), 2000);
        
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
        className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer bg-card dark:bg-card relative ${
          isHovered && !colorIsSaved ? 'p-0' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Color Swatch */}
        <div 
          className={`transition-all duration-300 relative ${
            isHovered && !colorIsSaved 
              ? 'absolute inset-0 z-10 rounded-lg w-full h-full' 
              : 'h-32 w-full'
          }`}
          style={{ backgroundColor: color.HEX }}
        >
          {/* Heart button */}
          <button
            className={`absolute top-2 right-2 h-8 w-8 p-0 transition-all duration-200 flex items-center justify-center z-20 overflow-hidden ${
              colorIsSaved 
                ? 'opacity-100' 
                : `opacity-100 md:opacity-0 hover:opacity-100 ${isHovered ? 'md:opacity-100' : ''}`
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
            {/* Water ripple effect */}
            {showRipple && (
              <>
                <div 
                  className="absolute rounded-full bg-white/80 border border-white/40"
                  style={{ 
                    width: '16px',
                    height: '16px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'ripple-1 2s ease-out forwards'
                  }}
                />
                <div 
                  className="absolute rounded-full bg-white/60 border border-white/30"
                  style={{ 
                    width: '16px',
                    height: '16px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'ripple-2 2s ease-out 0.3s forwards'
                  }}
                />
                <div 
                  className="absolute rounded-full bg-white/40 border border-white/20"
                  style={{ 
                    width: '16px',
                    height: '16px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'ripple-3 2s ease-out 0.6s forwards'
                  }}
                />
                <div 
                  className="absolute rounded-full bg-white/20 border border-white/10"
                  style={{ 
                    width: '16px',
                    height: '16px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'ripple-4 2s ease-out 0.9s forwards'
                  }}
                />
              </>
            )}
            
            <Heart 
              className={`h-4 w-4 transition-all duration-200 relative z-10 ${
                colorIsSaved ? 'fill-current scale-110 text-gray-600' : ''
              }`} 
              style={{ color: colorIsSaved ? '#4b5563' : textColor }} 
            />
          </button>

          {/* Saved indicator */}
          {colorIsSaved && (
            <div className="absolute bottom-2 left-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-800">
                Saved
              </div>
            </div>
          )}
        </div>
        
        {/* Color Information - completely hidden when hovering non-saved colors */}
        {!(isHovered && !colorIsSaved) && (
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
        )}
      </Card>

      {/* CSS animations for water ripple effect */}
      <style>
        {`
        @keyframes ripple-1 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }
        
        @keyframes ripple-2 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4.5);
            opacity: 0;
          }
        }
        
        @keyframes ripple-3 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(6);
            opacity: 0;
          }
        }
        
        @keyframes ripple-4 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.2;
          }
          100% {
            transform: translate(-50%, -50%) scale(8);
            opacity: 0;
          }
        }
        `}
      </style>
    </TooltipProvider>
  );
};
