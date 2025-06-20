import { useState, useEffect } from 'react';
import { PantoneColor } from '@/data/pantoneData';

export interface SavedPalette {
  id: string;
  name: string;
  colors: PantoneColor[];
  createdAt: Date;
}

export const usePalette = () => {
  const [savedColors, setSavedColors] = useState<PantoneColor[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [recentColors, setRecentColors] = useState<PantoneColor[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pantone-saved-colors');
    if (saved) {
      const parsedColors = JSON.parse(saved);
      console.log('Loading saved colors from localStorage:', parsedColors.length, 'colors');
      setSavedColors(parsedColors);
    }
    
    const palettes = localStorage.getItem('pantone-saved-palettes');
    if (palettes) {
      setSavedPalettes(JSON.parse(palettes));
    }
    
    const recent = localStorage.getItem('pantone-recent-colors');
    if (recent) {
      setRecentColors(JSON.parse(recent));
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    console.log('Saving to localStorage:', savedColors.length, 'colors');
    localStorage.setItem('pantone-saved-colors', JSON.stringify(savedColors));
  }, [savedColors]);

  useEffect(() => {
    localStorage.setItem('pantone-saved-palettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  useEffect(() => {
    localStorage.setItem('pantone-recent-colors', JSON.stringify(recentColors));
  }, [recentColors]);

  const addToSaved = (color: PantoneColor) => {
    console.log('addToSaved called with:', color.PANTONENAME);
    console.log('Current saved colors count:', savedColors.length);
    
    setSavedColors(prev => {
      console.log('Previous saved colors:', prev.map(c => c.PANTONENAME));
      
      // Check if color already exists
      const exists = prev.find(c => c.PANTONENAME === color.PANTONENAME);
      if (exists) {
        console.log('Color already exists, not adding');
        return prev;
      }
      
      // If we're at capacity (10), don't add more
      if (prev.length >= 10) {
        console.log('Cannot add more colors: maximum of 10 reached');
        return prev;
      }
      
      // Add new color
      const newColors = [...prev, color];
      console.log('Adding color, new count will be:', newColors.length);
      console.log('New saved colors:', newColors.map(c => c.PANTONENAME));
      return newColors;
    });
  };

  const removeFromSaved = (colorName: string) => {
    setSavedColors(prev => prev.filter(c => c.PANTONENAME !== colorName));
  };

  const addToRecent = (color: PantoneColor) => {
    setRecentColors(prev => {
      const filtered = prev.filter(c => c.PANTONENAME !== color.PANTONENAME);
      const updated = [color, ...filtered].slice(0, 5);
      return updated;
    });
  };

  const savePalette = (name: string, colors: PantoneColor[]) => {
    const newPalette: SavedPalette = {
      id: Date.now().toString(),
      name,
      colors,
      createdAt: new Date()
    };
    setSavedPalettes(prev => [...prev, newPalette]);
    return newPalette.id;
  };

  const deletePalette = (id: string) => {
    setSavedPalettes(prev => prev.filter(p => p.id !== id));
  };

  const isSaved = (colorName: string) => {
    return savedColors.some(c => c.PANTONENAME === colorName);
  };

  return {
    savedColors,
    savedPalettes,
    recentColors,
    addToSaved,
    removeFromSaved,
    addToRecent,
    savePalette,
    deletePalette,
    isSaved
  };
};
