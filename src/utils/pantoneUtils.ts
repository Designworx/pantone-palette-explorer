
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

export const searchPantones = (
  searchTerm: string = '',
  colorFamily: string = 'All',
  sortBy: string = 'name'
): PantoneColor[] => {
  const data = getPantoneData();
  
  let filtered = data.filter(color => {
    const matchesSearch = !searchTerm || 
      color.PANTONENAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.PANTONENAME.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFamily = colorFamily === 'All' || true; // No family property in current data
    
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
