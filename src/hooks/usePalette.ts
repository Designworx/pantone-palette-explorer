
import { usePaletteContext } from '@/contexts/PaletteContext';

export type { SavedPalette } from '@/contexts/PaletteContext';

export const usePalette = () => {
  return usePaletteContext();
};
