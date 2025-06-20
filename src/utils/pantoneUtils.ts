import { PantoneColor } from '@/data/pantoneData';
import { hexToLab, calculateDeltaE, hexToRgb, rgbToLab } from './colorConversion';

// Store the preloaded data
let cachedPantoneData: PantoneColor[] = [];
let deduplicatedData: PantoneColor[] = [];

// Function to set the preloaded data and remove duplicates permanently
export const setPantoneData = (data: PantoneColor[]) => {
  cachedPantoneData = data;
  
  // Remove duplicates by Pantone name, keeping the first occurrence
  const seen = new Set<string>();
  deduplicatedData = data.filter(color => {
    if (seen.has(color.PANTONENAME)) {
      return false;
    }
    seen.add(color.PANTONENAME);
    return true;
  });
  
  console.log(`Removed ${data.length - deduplicatedData.length} duplicate colors. Final count: ${deduplicatedData.length}`);
};

// Function to get the cached data (now returns deduplicated data)
export const getPantoneData = () => {
  return deduplicatedData;
};

// Helper function to determine color family based on Pantone name and hex color
const getColorFamily = (color: PantoneColor): string => {
  const name = color.PANTONENAME.toLowerCase();
  const hex = color.HEX.toLowerCase();
  
  // Convert hex to RGB and HSV for better color analysis
  const rgb = hexToRgb(hex);
  if (!rgb) return 'Neutrals';
  
  const { r, g, b } = rgb;
  
  // Convert RGB to HSV for better color classification
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  
  const saturation = max === 0 ? 0 : delta / max;
  const value = max;
  
  let hue = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      hue = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      hue = (bNorm - rNorm) / delta + 2;
    } else {
      hue = (rNorm - gNorm) / delta + 4;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }
  
  // Very low saturation colors are neutrals (regardless of name)
  if (saturation < 0.15 && value < 0.9) {
    return 'Neutrals';
  }
  
  // Very dark colors with low saturation are also neutrals
  if (value < 0.2 && saturation < 0.3) {
    return 'Neutrals';
  }
  
  // First check by name patterns for more accurate classification
  if (name.includes('yellow') || name.includes('gold') || name.includes('amber') || 
      name.includes('lemon') || name.includes('canary') || name.includes('banana') ||
      name.includes('corn') || name.includes('sunshine') || name.includes('mustard') ||
      name.includes('citron') || name.includes('butter')) {
    return 'Yellows';
  }
  
  if (name.includes('red') || name.includes('crimson') || name.includes('scarlet') || 
      name.includes('burgundy') || name.includes('maroon') || name.includes('cherry') ||
      name.includes('rose') || name.includes('ruby') || name.includes('brick') ||
      name.includes('wine') || name.includes('coral') || name.includes('pink')) {
    return 'Reds';
  }
  
  if (name.includes('blue') || name.includes('navy') || name.includes('azure') || 
      name.includes('sapphire') || name.includes('cobalt') || name.includes('royal') ||
      name.includes('cerulean') || name.includes('indigo') || name.includes('sky')) {
    return 'Blues';
  }
  
  if (name.includes('green') || name.includes('emerald') || name.includes('forest') || 
      name.includes('mint') || name.includes('olive') || name.includes('sage') ||
      name.includes('pine') || name.includes('jade') || name.includes('moss') ||
      name.includes('lime') && !name.includes('yellow')) {
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
    // Orange colors go to Reds unless they're very yellow
    if (hue >= 30 && hue <= 60 && gNorm > 0.6) {
      return 'Yellows';
    }
    return 'Reds';
  }
  
  // If no name match, use HSV analysis
  if (saturation >= 0.15) {
    // Red hues: 330-360 and 0-30
    if ((hue >= 330 && hue <= 360) || (hue >= 0 && hue <= 30)) {
      return 'Reds';
    }
    
    // Orange/Red-Orange hues: 30-60 (lean towards red unless very yellow)
    if (hue >= 30 && hue <= 60) {
      if (hue >= 45 && gNorm > rNorm * 0.8) {
        return 'Yellows';
      }
      return 'Reds';
    }
    
    // Yellow hues: 60-90
    if (hue >= 60 && hue <= 90) {
      return 'Yellows';
    }
    
    // Yellow-Green to Green hues: 90-150
    if (hue >= 90 && hue <= 150) {
      return 'Greens';
    }
    
    // Green to Cyan hues: 150-210
    if (hue >= 150 && hue <= 210) {
      if (hue >= 150 && hue <= 180) {
        return 'Cyans';
      }
      return 'Cyans';
    }
    
    // Cyan to Blue hues: 210-270
    if (hue >= 210 && hue <= 270) {
      if (hue <= 240) {
        return 'Cyans';
      }
      return 'Blues';
    }
    
    // Blue to Magenta hues: 270-330
    if (hue >= 270 && hue <= 330) {
      if (hue >= 300) {
        return 'Magentas';
      }
      return 'Blues';
    }
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

  // Sort the results (duplicates already removed at data level)
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
