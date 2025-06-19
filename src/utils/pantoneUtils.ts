
import { PantoneColor } from '@/data/pantoneData';
import { hexToLab, calculateDeltaE, hexToRgb, rgbToLab } from './colorConversion';

// Store the preloaded data
let cachedPantoneData: PantoneColor[] = [];

// Function to set the preloaded data
export const setPantoneData = (data: PantoneColor[]) => {
  cachedPantoneData = data;
};

// Function to get the cached data
export const getPantoneData = () => {
  return cachedPantoneData;
};

// Helper function to determine color family based on Pantone name and hex color
const getColorFamily = (color: PantoneColor): string => {
  const name = color.PANTONENAME.toLowerCase();
  const hex = color.HEX.toLowerCase();
  
  // Convert hex to RGB for better color analysis
  const rgb = hexToRgb(hex);
  if (!rgb) return 'Neutrals';
  
  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  
  // Low saturation colors are neutrals
  if (saturation < 0.2) {
    return 'Neutrals';
  }
  
  // Determine dominant color based on RGB values
  if (r > g && r > b) {
    // Red is dominant
    if (name.includes('red') || name.includes('crimson') || name.includes('scarlet') || 
        name.includes('burgundy') || name.includes('maroon') || name.includes('cherry')) {
      return 'Reds';
    }
    // Could also be magenta if it has significant blue
    if (b > g * 1.2) {
      return 'Magentas';
    }
    return 'Reds';
  } else if (g > r && g > b) {
    // Green is dominant
    return 'Greens';
  } else if (b > r && b > g) {
    // Blue is dominant
    if (name.includes('cyan') || (g > r * 1.2)) {
      return 'Cyans';
    }
    return 'Blues';
  }
  
  // Mixed colors - check for specific patterns
  if (r > b && g > b) {
    return 'Yellows'; // Red + Green = Yellow
  } else if (r > g && b > g) {
    return 'Magentas'; // Red + Blue = Magenta
  } else if (g > r && b > r) {
    return 'Cyans'; // Green + Blue = Cyan
  }
  
  return 'Neutrals';
};

export const searchPantones = (
  searchTerm: string = '',
  colorFamily: string = 'All',
  sortBy: string = 'name'
): PantoneColor[] => {
  const data = getPantoneData();
  
  let filtered = data.filter(color => {
    const matchesSearch = !searchTerm || 
      color.PANTONENAME.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFamily = colorFamily === 'All' || getColorFamily(color) === colorFamily;
    
    return matchesSearch && matchesFamily;
  });

  // Sort the results
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'lightness':
        // Calculate LAB values for sorting
        const labA = hexToRgb(a.HEX) ? rgbToLab(hexToRgb(a.HEX)!) : { L: 0, a: 0, b: 0 };
        const labB = hexToRgb(b.HEX) ? rgbToLab(hexToRgb(b.HEX)!) : { L: 0, a: 0, b: 0 };
        return labB.L - labA.L;
      case 'chroma':
        const labA2 = hexToRgb(a.HEX) ? rgbToLab(hexToRgb(a.HEX)!) : { L: 0, a: 0, b: 0 };
        const labB2 = hexToRgb(b.HEX) ? rgbToLab(hexToRgb(b.HEX)!) : { L: 0, a: 0, b: 0 };
        const chromaA = Math.sqrt(Math.pow(labA2.a, 2) + Math.pow(labA2.b, 2));
        const chromaB = Math.sqrt(Math.pow(labB2.a, 2) + Math.pow(labB2.b, 2));
        return chromaB - chromaA;
      default:
        return a.PANTONENAME.localeCompare(b.PANTONENAME);
    }
  });

  return filtered;
};

export const findNearestPantones = (
  hexColor: string,
  count: number = 5
): Array<PantoneColor & { deltaE: number }> => {
  const data = getPantoneData();
  
  try {
    const targetLab = hexToLab(hexColor);
    
    const withDeltaE = data.map(pantone => {
      const pantoneRgb = hexToRgb(pantone.HEX);
      const pantoneLab = pantoneRgb ? rgbToLab(pantoneRgb) : { L: 0, a: 0, b: 0 };
      
      return {
        ...pantone,
        deltaE: calculateDeltaE(targetLab, pantoneLab)
      };
    });

    return withDeltaE
      .sort((a, b) => a.deltaE - b.deltaE)
      .slice(0, count);
  } catch (error) {
    console.error('Error finding nearest Pantones:', error);
    return [];
  }
};

export const generateTints = (color: PantoneColor) => {
  const rgb = hexToRgb(color.HEX);
  if (!rgb) return [];

  const tints = [];
  const percentages = [100, 75, 50, 25, 10];
  
  for (const percentage of percentages) {
    const factor = percentage / 100;
    const tintedR = Math.round(rgb.r + (255 - rgb.r) * (1 - factor));
    const tintedG = Math.round(rgb.g + (255 - rgb.g) * (1 - factor));
    const tintedB = Math.round(rgb.b + (255 - rgb.b) * (1 - factor));
    
    const hex = "#" + ((1 << 24) + (tintedR << 16) + (tintedG << 8) + tintedB).toString(16).slice(1);
    
    tints.push({
      percentage,
      hex
    });
  }
  
  return tints;
};
