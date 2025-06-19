
import { PantoneColor } from '@/data/pantoneData';
import { hexToLab, calculateDeltaE } from './colorConversion';

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
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFamily = colorFamily === 'All' || color.family === colorFamily;
    
    return matchesSearch && matchesFamily;
  });

  // Sort the results
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'lightness':
        return (b.lab?.L || 0) - (a.lab?.L || 0);
      case 'chroma':
        const chromaA = Math.sqrt(Math.pow(a.lab?.a || 0, 2) + Math.pow(a.lab?.b || 0, 2));
        const chromaB = Math.sqrt(Math.pow(b.lab?.a || 0, 2) + Math.pow(b.lab?.b || 0, 2));
        return chromaB - chromaA;
      default:
        return a.name.localeCompare(b.name);
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
    
    const withDeltaE = data.map(pantone => ({
      ...pantone,
      deltaE: calculateDeltaE(targetLab, pantone.lab!)
    }));

    return withDeltaE
      .sort((a, b) => a.deltaE - b.deltaE)
      .slice(0, count);
  } catch (error) {
    console.error('Error finding nearest Pantones:', error);
    return [];
  }
};
