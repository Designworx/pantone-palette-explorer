
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { PantoneColor } from '@/data/pantoneData';
import { toast } from '@/hooks/use-toast';

export interface SavedPalette {
  id: string;
  name: string;
  colors: PantoneColor[];
  createdAt: Date;
}

interface PaletteContextType {
  savedColors: PantoneColor[];
  savedPalettes: SavedPalette[];
  recentColors: PantoneColor[];
  addToSaved: (color: PantoneColor) => boolean;
  removeFromSaved: (colorName: string) => void;
  addToRecent: (color: PantoneColor) => void;
  savePalette: (name: string, colors: PantoneColor[]) => string;
  deletePalette: (id: string) => void;
  isSaved: (colorName: string) => boolean;
  clearSavedColors: () => void;
  isAtLimit: () => boolean;
}

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export const PaletteProvider = ({ children }: { children: ReactNode }) => {
  const [savedColors, setSavedColors] = useState<PantoneColor[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [recentColors, setRecentColors] = useState<PantoneColor[]>([]);
  
  // Use refs to track if we're in the initial load phase
  const initialLoadComplete = useRef(false);

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
    
    // Mark initial load as complete
    initialLoadComplete.current = true;
  }, []);

  // Save to localStorage whenever state changes (but not on initial load)
  useEffect(() => {
    if (initialLoadComplete.current) {
      console.log('Saving to localStorage:', savedColors.length, 'colors');
      localStorage.setItem('pantone-saved-colors', JSON.stringify(savedColors));
    }
  }, [savedColors]);

  useEffect(() => {
    if (initialLoadComplete.current) {
      localStorage.setItem('pantone-saved-palettes', JSON.stringify(savedPalettes));
    }
  }, [savedPalettes]);

  useEffect(() => {
    if (initialLoadComplete.current) {
      localStorage.setItem('pantone-recent-colors', JSON.stringify(recentColors));
    }
  }, [recentColors]);

  const addToSaved = (color: PantoneColor): boolean => {
    console.log('addToSaved called with:', color.PANTONENAME);
    console.log('Current saved colors count:', savedColors.length);
    
    let wasAdded = false;
    
    setSavedColors(prev => {
      console.log('Previous saved colors:', prev.map(c => c.PANTONENAME));
      
      // Check if color already exists
      const exists = prev.find(c => c.PANTONENAME === color.PANTONENAME);
      if (exists) {
        console.log('Color already exists, not adding');
        return prev;
      }
      
      // If we're at capacity (10), show toast and don't add more
      if (prev.length >= 10) {
        console.log('Cannot add more colors: maximum of 10 reached');
        toast({
          title: "Palette limit reached",
          description: "You can save up to 10 colors per palette. Create a new palette to save more colors.",
          variant: "destructive"
        });
        return prev;
      }
      
      // Add new color
      const newColors = [...prev, color];
      console.log('Adding color, new count will be:', newColors.length);
      console.log('New saved colors:', newColors.map(c => c.PANTONENAME));
      wasAdded = true;
      return newColors;
    });
    
    return wasAdded;
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

  const clearSavedColors = () => {
    setSavedColors([]);
  };

  const isSaved = (colorName: string) => {
    return savedColors.some(c => c.PANTONENAME === colorName);
  };

  const isAtLimit = () => {
    return savedColors.length >= 10;
  };

  return (
    <PaletteContext.Provider value={{
      savedColors,
      savedPalettes,
      recentColors,
      addToSaved,
      removeFromSaved,
      addToRecent,
      savePalette,
      deletePalette,
      isSaved,
      clearSavedColors,
      isAtLimit
    }}>
      {children}
    </PaletteContext.Provider>
  );
};

export const usePaletteContext = () => {
  const context = useContext(PaletteContext);
  if (context === undefined) {
    throw new Error('usePaletteContext must be used within a PaletteProvider');
  }
  return context;
};
