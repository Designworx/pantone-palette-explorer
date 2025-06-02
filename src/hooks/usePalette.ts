
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
      setSavedColors(JSON.parse(saved));
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
    localStorage.setItem('pantone-saved-colors', JSON.stringify(savedColors));
  }, [savedColors]);

  useEffect(() => {
    localStorage.setItem('pantone-saved-palettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  useEffect(() => {
    localStorage.setItem('pantone-recent-colors', JSON.stringify(recentColors));
  }, [recentColors]);

  const addToSaved = (color: PantoneColor) => {
    if (savedColors.length >= 10) {
      setSavedColors(prev => [...prev.slice(1), color]);
    } else {
      setSavedColors(prev => {
        const exists = prev.find(c => c.PANTONENAME === color.PANTONENAME);
        if (exists) return prev;
        return [...prev, color];
      });
    }
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
