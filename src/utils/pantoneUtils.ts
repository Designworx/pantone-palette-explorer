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
  
  // Very low saturation colors are neutrals
  if (saturation < 0.15) {
    return 'Neutrals';
  }
  
  // First check by name patterns for more accurate classification
  if (name.includes('yellow') || name.includes('gold') || name.includes('amber') || 
      name.includes('lemon') || name.includes('canary') || name.includes('banana') ||
      name.includes('corn') || name.includes('sunshine')) {
    return 'Yellows';
  }
  
  if (name.includes('red') || name.includes('crimson') || name.includes('scarlet') || 
      name.includes('burgundy') || name.includes('maroon') || name.includes('cherry') ||
      name.includes('rose') || name.includes('ruby')) {
    return 'Reds';
  }
  
  if (name.includes('blue') || name.includes('navy') || name.includes('azure') || 
      name.includes('sapphire') || name.includes('cobalt') || name.includes('royal')) {
    return 'Blues';
  }
  
  if (name.includes('green') || name.includes('emerald') || name.includes('forest') || 
      name.includes('mint') || name.includes('lime') || name.includes('olive')) {
    return 'Greens';
  }
  
  if (name.includes('cyan') || name.includes('turquoise') || name.includes('teal') || 
      name.includes('aqua')) {
    return 'Cyans';
  }
  
  if (name.includes('magenta') || name.includes('fuchsia') || name.includes('purple') || 
      name.includes('violet') || name.includes('plum') || name.includes('lavender')) {
    return 'Magentas';
  }
  
  if (name.includes('orange') || name.includes('coral') || name.includes('peach') || 
      name.includes('tangerine')) {
    // Orange is between red and yellow, but we'll classify as red for now
    return 'Reds';
  }
  
  // If no name match, analyze RGB values more carefully
  const redRatio = r / 255;
  const greenRatio = g / 255;
  const blueRatio = b / 255;
  
  // Yellow detection: high red AND green, low blue
  if (redRatio > 0.6 && greenRatio > 0.6 && blueRatio < 0.5 && 
      Math.abs(redRatio - greenRatio) < 0.3) {
    return 'Yellows';
  }
  
  // Red detection: high red, lower green and blue
  if (redRatio > 0.5 && redRatio > greenRatio * 1.3 && redRatio > blueRatio * 1.3) {
    return 'Reds';
  }
  
  // Green detection: high green, lower red and blue
  if (greenRatio > 0.5 && greenRatio > redRatio * 1.2 && greenRatio > blueRatio * 1.2) {
    return 'Greens';
  }
  
  // Blue detection: high blue, lower red and green
  if (blueRatio > 0.5 && blueRatio > redRatio * 1.2 && blueRatio > greenRatio * 1.2) {
    return 'Blues';
  }
  
  // Cyan detection: high green and blue, lower red
  if (greenRatio > 0.5 && blueRatio > 0.5 && redRatio < 0.4) {
    return 'Cyans';
  }
  
  // Magenta detection: high red and blue, lower green
  if (redRatio > 0.5 && blueRatio > 0.5 && greenRatio < 0.4) {
    return 'Magentas';
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
