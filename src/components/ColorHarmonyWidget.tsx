
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PantoneColor } from '@/data/pantoneData';
import { hexToRgb } from '@/utils/colorConversion';

interface ColorHarmonyWidgetProps {
  baseColor: PantoneColor;
  allColors: PantoneColor[];
  onColorSelect: (color: PantoneColor) => void;
}

type HarmonyType = 'complementary' | 'triadic' | 'analogous' | 'split-complementary';

const generateHarmony = (hex: string, type: HarmonyType): string[] => {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  
  // Convert RGB to HSL for easier manipulation
  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : delta / max;
  const l = (max + min) / 2;
  
  if (delta !== 0) {
    if (max === rNorm) h = ((gNorm - bNorm) / delta) % 6;
    else if (max === gNorm) h = (bNorm - rNorm) / delta + 2;
    else h = (rNorm - gNorm) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  
  const hslToHex = (hue: number, sat: number, lig: number) => {
    const c = (1 - Math.abs(2 * lig - 1)) * sat;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = lig - c / 2;
    
    let rPrime = 0, gPrime = 0, bPrime = 0;
    
    if (0 <= hue && hue < 60) [rPrime, gPrime, bPrime] = [c, x, 0];
    else if (60 <= hue && hue < 120) [rPrime, gPrime, bPrime] = [x, c, 0];
    else if (120 <= hue && hue < 180) [rPrime, gPrime, bPrime] = [0, c, x];
    else if (180 <= hue && hue < 240) [rPrime, gPrime, bPrime] = [0, x, c];
    else if (240 <= hue && hue < 300) [rPrime, gPrime, bPrime] = [x, 0, c];
    else if (300 <= hue && hue < 360) [rPrime, gPrime, bPrime] = [c, 0, x];
    
    const rFinal = Math.round((rPrime + m) * 255);
    const gFinal = Math.round((gPrime + m) * 255);
    const bFinal = Math.round((bPrime + m) * 255);
    
    return `#${((1 << 24) + (rFinal << 16) + (gFinal << 8) + bFinal).toString(16).slice(1)}`;
  };
  
  switch (type) {
    case 'complementary':
      return [hslToHex((h + 180) % 360, s, l)];
    case 'triadic':
      return [
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l)
      ];
    case 'analogous':
      return [
        hslToHex((h + 30) % 360, s, l),
        hslToHex((h - 30 + 360) % 360, s, l)
      ];
    case 'split-complementary':
      return [
        hslToHex((h + 150) % 360, s, l),
        hslToHex((h + 210) % 360, s, l)
      ];
    default:
      return [];
  }
};

export const ColorHarmonyWidget = ({ baseColor, allColors, onColorSelect }: ColorHarmonyWidgetProps) => {
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('complementary');
  
  const harmonyColors = generateHarmony(baseColor.HEX, harmonyType);
  
  // Find closest Pantone matches for harmony colors
  const findClosestPantone = (targetHex: string) => {
    const targetRgb = hexToRgb(targetHex);
    if (!targetRgb) return null;
    
    let closest = allColors[0];
    let minDistance = Infinity;
    
    allColors.forEach(color => {
      const colorRgb = hexToRgb(color.HEX);
      if (!colorRgb) return;
      
      const distance = Math.sqrt(
        Math.pow(targetRgb.r - colorRgb.r, 2) +
        Math.pow(targetRgb.g - colorRgb.g, 2) +
        Math.pow(targetRgb.b - colorRgb.b, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = color;
      }
    });
    
    return closest;
  };

  return (
    <Card className="p-4">
      <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
        Color Harmony
      </h4>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {(['complementary', 'triadic', 'analogous', 'split-complementary'] as HarmonyType[]).map((type) => (
          <Button
            key={type}
            variant={harmonyType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setHarmonyType(type)}
            className="text-xs"
          >
            {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
          </Button>
        ))}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded border border-gray-300"
            style={{ backgroundColor: baseColor.HEX }}
          />
          <span className="text-xs font-medium">Base Color</span>
        </div>
        
        {harmonyColors.map((harmonyHex, index) => {
          const closestPantone = findClosestPantone(harmonyHex);
          return (
            <div 
              key={index}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
              onClick={() => closestPantone && onColorSelect(closestPantone)}
            >
              <div 
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: harmonyHex }}
              />
              <div className="flex-1">
                <div className="text-xs font-medium">
                  {closestPantone?.PANTONENAME || 'No match'}
                </div>
                <div className="text-xs text-gray-500">
                  {closestPantone?.HEX || harmonyHex}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
