

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Trash2, Download, Clock, Heart } from 'lucide-react';
import { usePalette } from '@/hooks/usePalette';
import { PantoneColor } from '@/data/pantoneData';
import { toast } from '@/hooks/use-toast';

interface PaletteManagerProps {
  onColorSelect: (color: PantoneColor) => void;
}

export const PaletteManager = ({ onColorSelect }: PaletteManagerProps) => {
  const { savedColors, savedPalettes, recentColors, removeFromSaved, savePalette, deletePalette } = usePalette();
  const [newPaletteName, setNewPaletteName] = useState('');

  const handleSavePalette = () => {
    if (!newPaletteName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a palette name",
        variant: "destructive"
      });
      return;
    }

    if (savedColors.length === 0) {
      toast({
        title: "Error",
        description: "No colors saved to create a palette",
        variant: "destructive"
      });
      return;
    }

    savePalette(newPaletteName, savedColors);
    setNewPaletteName('');
    toast({
      title: "Palette saved",
      description: `"${newPaletteName}" saved with ${savedColors.length} colors`,
    });
  };

  const exportPalette = (colors: PantoneColor[], name: string) => {
    const paletteData = {
      name,
      colors: colors.map(color => ({
        name: color.PANTONENAME,
        hex: color.HEX,
        cmyk: { c: color.C, m: color.M, y: color.Y, k: color.K },
        rgb: { r: color.R, g: color.G, b: color.B }
      }))
    };
    
    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}_palette.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Palette exported",
      description: `${name} exported successfully`,
    });
  };

  const ColorGrid = ({ colors, showRemove = false }: { colors: PantoneColor[], showRemove?: boolean }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {colors.map((color, index) => (
        <div key={index} className="relative group">
          <div
            className="h-16 w-full rounded border cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: color.HEX }}
            onClick={() => onColorSelect(color)}
          />
          <div className="mt-1 text-xs text-center font-medium truncate">
            {color.PANTONENAME}
          </div>
          <div className="text-xs text-center text-gray-500">
            {color.HEX}
          </div>
          {showRemove && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeFromSaved(color.PANTONENAME)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Card className="p-6">
      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger 
            value="saved"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white text-xs sm:text-sm"
          >
            <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Saved ({savedColors.length}/10)</span>
            <span className="sm:hidden">({savedColors.length}/10)</span>
          </TabsTrigger>
          <TabsTrigger 
            value="recent"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white text-xs sm:text-sm"
          >
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Recent</span>
            <span className="sm:hidden">Recent</span>
          </TabsTrigger>
          <TabsTrigger 
            value="palettes"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Palettes ({savedPalettes.length})</span>
            <span className="sm:hidden">({savedPalettes.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-4">
          {savedColors.length > 0 && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter palette name..."
                value={newPaletteName}
                onChange={(e) => setNewPaletteName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSavePalette}>Save Palette</Button>
              <Button
                variant="outline"
                onClick={() => exportPalette(savedColors, 'My_Saved_Colors')}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {savedColors.length > 0 ? (
            <ColorGrid colors={savedColors} showRemove />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No saved colors yet</p>
              <p className="text-sm">Click the heart icon on any color to save it</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {recentColors.length > 0 ? (
            <ColorGrid colors={recentColors} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent colors</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="palettes" className="space-y-4">
          {savedPalettes.length > 0 ? (
            savedPalettes.map((palette) => (
              <Card key={palette.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{palette.name}</h3>
                    <p className="text-sm text-gray-500">
                      {palette.colors.length} colors • {new Date(palette.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportPalette(palette.colors, palette.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePalette(palette.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ColorGrid colors={palette.colors} />
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="h-12 w-12 mx-auto mb-2 opacity-50 bg-gray-200 rounded"></div>
              <p>No saved palettes</p>
              <p className="text-sm">Save colors and create your first palette</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

