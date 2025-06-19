
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
  if (saturation < 0.1) {
    return 'Neutrals';
  }
  
  // Normalize RGB values to 0-1 range for easier comparison
  const redRatio = r / 255;
  const greenRatio = g / 255;
  const blueRatio = b / 255;
  
  // First check by name patterns for more accurate classification
  if (name.includes('yellow') || name.includes('gold') || name.includes('amber') || 
      name.includes('lemon') || name.includes('canary') || name.includes('banana') ||
      name.includes('corn') || name.includes('sunshine') || name.includes('mustard') ||
      name.includes('citron') || name.includes('lime')) {
    return 'Yellows';
  }
  
  if (name.includes('red') || name.includes('crimson') || name.includes('scarlet') || 
      name.includes('burgundy') || name.includes('maroon') || name.includes('cherry') ||
      name.includes('rose') || name.includes('ruby') || name.includes('brick') ||
      name.includes('wine') || name.includes('coral')) {
    return 'Reds';
  }
  
  if (name.includes('blue') || name.includes('navy') || name.includes('azure') || 
      name.includes('sapphire') || name.includes('cobalt') || name.includes('royal') ||
      name.includes('cerulean') || name.includes('indigo') || name.includes('sky')) {
    return 'Blues';
  }
  
  if (name.includes('green') || name.includes('emerald') || name.includes('forest') || 
      name.includes('mint') || name.includes('olive') || name.includes('sage') ||
      name.includes('pine') || name.includes('jade') || name.includes('moss')) {
    return 'Greens';
  }
  
  if (name.includes('cyan') || name.includes('turquoise') || name.includes('teal') || 
      name.includes('aqua') || name.includes('peacock')) {
    return 'Cyans';
  }
  
  if (name.includes('magenta') || name.includes('fuchsia') || name.includes('purple') || 
      name.includes('violet') || name.includes('plum') || name.includes('lavender') ||
      name.includes('orchid') || name.includes('amethyst')) {
    return 'Magentas';
  }
  
  if (name.includes('orange') || name.includes('peach') || name.includes('tangerine') ||
      name.includes('apricot') || name.includes('rust')) {
    // Check if it's more yellow or more red
    if (greenRatio > 0.5 && redRatio > 0.6) {
      return 'Yellows';
    }
    return 'Reds';
  }
  
  // If no name match, analyze RGB values
  // Yellow detection: high red AND green, low blue
  if (redRatio > 0.5 && greenRatio > 0.5 && blueRatio < 0.4) {
    return 'Yellows';
  }
  
  // Red detection: red is dominant
  if (redRatio > greenRatio && redRatio > blueRatio && redRatio > 0.4) {
    // Check if it's more magenta (high blue too)
    if (blueRatio > 0.4 && blueRatio > greenRatio) {
      return 'Magentas';
    }
    return 'Reds';
  }
  
  // Green detection: green is dominant
  if (greenRatio > redRatio && greenRatio > blueRatio && greenRatio > 0.4) {
    // Check if it's more cyan (high blue too)
    if (blueRatio > 0.4 && blueRatio > redRatio) {
      return 'Cyans';
    }
    return 'Greens';
  }
  
  // Blue detection: blue is dominant
  if (blueRatio > redRatio && blueRatio > greenRatio && blueRatio > 0.4) {
    // Check if it's more cyan (high green too)
    if (greenRatio > 0.4 && greenRatio > redRatio) {
      return 'Cyans';
    }
    // Check if it's more magenta (high red too)
    if (redRatio > 0.4 && redRatio > greenRatio) {
      return 'Magentas';
    }
    return 'Blues';
  }
  
  // Cyan detection: high green and blue, lower red
  if (greenRatio > 0.4 && blueRatio > 0.4 && redRatio < greenRatio && redRatio < blueRatio) {
    return 'Cyans';
  }
  
  // Magenta detection: high red and blue, lower green
  if (redRatio > 0.4 && blueRatio > 0.4 && greenRatio < redRatio && greenRatio < blueRatio) {
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
