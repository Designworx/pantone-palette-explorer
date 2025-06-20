
import { usePaletteContext } from '@/contexts/PaletteContext';

export { SavedPalette } from '@/contexts/PaletteContext';

export const usePalette = () => {
  return usePaletteContext();
};
