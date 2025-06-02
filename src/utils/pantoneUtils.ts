
import { PantoneData, PantoneColor } from '@/data/pantoneData';
import { hexToRgb, rgbToLab, calculateDeltaE, getColorFamily } from './colorConversion';

// Find nearest Pantone colors by Delta E
export const findNearestPantones = (targetHex: string, count: number = 3): Array<PantoneColor & { deltaE: number }> => {
  const targetRgb = hexToRgb(targetHex);
  if (!targetRgb) return [];
  
  const targetLab = rgbToLab(targetRgb);
  
  const withDeltaE = PantoneData.map(color => {
    const colorRgb = hexToRgb(color.HEX);
    if (!colorRgb) return { ...color, deltaE: 999 };
    
    const colorLab = rgbToLab(colorRgb);
    const deltaE = calculateDeltaE(targetLab, colorLab);
    
    return { ...color, deltaE };
  });
  
  return withDeltaE
    .sort((a, b) => a.deltaE - b.deltaE)
    .slice(0, count);
};

// Filter colors by family
export const filterByColorFamily = (colors: PantoneColor[], family: string): PantoneColor[] => {
  if (family === 'All') return colors;
  
  return colors.filter(color => getColorFamily(color.HEX) === family);
};

// Advanced search with multiple criteria
export const searchPantones = (
  searchTerm: string,
  colorFamily: string = 'All',
  sortBy: string = 'name'
): PantoneColor[] => {
  let filtered = PantoneData;
  
  // Text search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(color =>
      color.PANTONENAME.toLowerCase().includes(term) ||
      color.HEX.toLowerCase().includes(term)
    );
  }
  
  // Color family filter
  filtered = filterByColorFamily(filtered, colorFamily);
  
  // Sorting
  switch (sortBy) {
    case 'lightness':
      filtered.sort((a, b) => {
        const rgbA = hexToRgb(a.HEX);
        const rgbB = hexToRgb(b.HEX);
        if (!rgbA || !rgbB) return 0;
        
        const lightnessA = rgbToLab(rgbA).L;
        const lightnessB = rgbToLab(rgbB).L;
        return lightnessB - lightnessA;
      });
      break;
    case 'chroma':
      filtered.sort((a, b) => {
        const rgbA = hexToRgb(a.HEX);
        const rgbB = hexToRgb(b.HEX);
        if (!rgbA || !rgbB) return 0;
        
        const labA = rgbToLab(rgbA);
        const labB = rgbToLab(rgbB);
        const chromaA = Math.sqrt(labA.a * labA.a + labA.b * labA.b);
        const chromaB = Math.sqrt(labB.a * labB.a + labB.b * labB.b);
        return chromaB - chromaA;
      });
      break;
    default:
      filtered.sort((a, b) => a.PANTONENAME.localeCompare(b.PANTONENAME));
  }
  
  return filtered;
};

// Generate tints for a Pantone color
export const generateTints = (color: PantoneColor): Array<{ percentage: number; cmyk: string; hex: string }> => {
  const tints = [];
  for (let i = 10; i <= 90; i += 10) {
    const tintC = Math.round(color.C * (i / 100));
    const tintM = Math.round(color.M * (i / 100));
    const tintY = Math.round(color.Y * (i / 100));
    const tintK = Math.round(color.K * (i / 100));
    
    // Approximate hex conversion for tints
    const baseRgb = hexToRgb(color.HEX);
    if (baseRgb) {
      const factor = i / 100;
      const tintR = Math.round(255 - (255 - baseRgb.r) * factor);
      const tintG = Math.round(255 - (255 - baseRgb.g) * factor);
      const tintB = Math.round(255 - (255 - baseRgb.b) * factor);
      
      const tintHex = "#" + ((1 << 24) + (tintR << 16) + (tintG << 8) + tintB).toString(16).slice(1);
      
      tints.push({
        percentage: i,
        cmyk: `C:${tintC} M:${tintM} Y:${tintY} K:${tintK}`,
        hex: tintHex
      });
    }
  }
  return tints;
};
