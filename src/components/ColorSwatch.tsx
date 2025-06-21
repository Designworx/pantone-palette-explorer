
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Heart, Eye, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PantoneColor } from '@/data/pantoneData';
import { usePalette } from '@/hooks/usePalette';
import { SubstratePreview } from './SubstratePreview';
import { ColorHarmonyWidget } from './ColorHarmonyWidget';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface ColorSwatchProps {
  color: PantoneColor;
  onClick?: (color: PantoneColor) => void;
  allColors?: PantoneColor[];
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

export const ColorSwatch = ({ color, onClick, allColors = [] }: ColorSwatchProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [showSubstrate, setShowSubstrate] = useState(false);
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
        setTimeout(() => setShowRipple(false), 1000);
        
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

  // Mobile touch handlers
  const handleTouchStart = () => {
    setTouchStartTime(Date.now());
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration > 500) { // Long press
      e.preventDefault();
      toggleSaved(e as any);
    }
  };
  
  // On mobile/responsive, show info when not hovered AND not saved
  // On desktop, only show info when not hovered
  const shouldShowColorExpanded = isHovered;
  const shouldShowColorInfo = !isHovered || (!colorIsSaved && window.innerWidth < 768);
  
  return (
    <TooltipProvider>
      <Card 
        className={`overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer bg-card dark:bg-card relative ${
          shouldShowColorExpanded ? 'p-0' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Color Swatch */}
        <div 
          className={`transition-all duration-300 relative ${
            shouldShowColorExpanded 
              ? 'absolute inset-0 z-10 rounded-lg w-full h-full' 
              : 'h-32 w-full'
          }`}
          style={{ backgroundColor: color.HEX }}
        >
          {/* Enhanced Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-1">
            {/* Substrate Preview Button */}
            <HoverCard>
              <HoverCardT

rigger asChild>
                <button
                  className="h-8 w-8 p-0 transition-all duration-200 flex items-center justify-center z-20 bg-white/80 backdrop-blur-sm rounded-full opacity-0 hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSubstrate(!showSubstrate);
                  }}
                  title="Preview on different paper stocks"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-0">
                <SubstratePreview color={color} />
              </HoverCardContent>
            </HoverCard>

            {/* Color Harmony Button */}
            {allColors.length > 0 && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    className="h-8 w-8 p-0 transition-all duration-200 flex items-center justify-center z-20 bg-white/80 backdrop-blur-sm rounded-full opacity-0 hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    title="View color harmonies"
                  >
                    <Palette className="h-4 w-4 text-gray-700" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-0">
                  <ColorHarmonyWidget 
                    baseColor={color} 
                    allColors={allColors}
                    onColorSelect={(harmonColor) => onClick?.(harmonColor)}
                  />
                </HoverCardContent>
              </HoverCard>
            )}

            {/* Heart button */}
            <button
              className={`h-8 w-8 p-0 transition-all duration-200 flex items-center justify-center z-20 overflow-visible bg-white/80 backdrop-blur-sm rounded-full ${
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
              title={colorIsSaved ? 'Remove from favorites' : 'Add to favorites (long press on mobile)'}
            >
              {/* Water ripple effect - positioned to expand beyond button */}
              {showRipple && (
                <>
                  <div 
                    className="absolute rounded-full bg-white/80 border border-white/40 pointer-events-none"
                    style={{ 
                      width: '16px',
                      height: '16px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      animation: 'ripple-1 1s ease-out forwards'
                    }}
                  />
                  <div 
                    className="absolute rounded-full bg-white/60 border border-white/30 pointer-events-none"
                    style={{ 
                      width: '16px',
                      height: '16px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      animation: 'ripple-2 1s ease-out 0.15s forwards'
                    }}
                  />
                  <div 
                    className="absolute rounded-full bg-white/40 border border-white/20 pointer-events-none"
                    style={{ 
                      width: '16px',
                      height: '16px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      animation: 'ripple-3 1s ease-out 0.3s forwards'
                    }}
                  />
                  <div 
                    className="absolute rounded-full bg-white/20 border border-white/10 pointer-events-none"
                    style={{ 
                      width: '16px',
                      height: '16px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      animation: 'ripple-4 1s ease-out 0.45s forwards'
                    }}
                  />
                </>
              )}
              
              <Heart 
                className={`h-4 w-4 transition-all duration-200 relative z-10 ${
                  colorIsSaved ? 'fill-current scale-110 text-gray-600' : 'text-gray-700'
                }`} 
              />
            </button>
          </div>

          {/* Saved indicator - slides down on hover */}
          {colorIsSaved && (
            <div className={`absolute left-2 transition-all duration-300 ${
              shouldShowColorExpanded ? 'bottom-2' : 'bottom-2'
            }`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-800">
                Saved
              </div>
            </div>
          )}
        </div>
        
        {/* Color Information - show based on responsive logic */}
        {shouldShowColorInfo && (
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
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
        
        @keyframes ripple-2 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(6);
            opacity: 0;
          }
        }
        
        @keyframes ripple-3 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(8);
            opacity: 0;
          }
        }
        
        @keyframes ripple-4 {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.2;
          }
          100% {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
          }
        }
        `}
      </style>
    </TooltipProvider>
  );
};
