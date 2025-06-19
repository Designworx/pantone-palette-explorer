
import { useState } from 'react';
import { PantoneColor } from '@/data/pantoneData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Download, Copy, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { usePalette } from '@/hooks/usePalette';
import { generateTints, findNearestPantones } from '@/utils/pantoneUtils';
import { generateComplementary, hexToRgb, rgbToLab } from '@/utils/colorConversion';

interface ColorDetailsProps {
  color: PantoneColor;
  deltaE?: number;
  onClose: () => void;
}

export const ColorDetails = ({ color, deltaE, onClose }: ColorDetailsProps) => {
  const { addToSaved, removeFromSaved, isSaved, addToRecent } = usePalette();
  const [selectedTab, setSelectedTab] = useState('details');
  
  const tints = generateTints(color);
  const complementaryHex = generateComplementary(color.HEX);
  const complementaryMatches = findNearestPantones(complementaryHex, 1);
  
  // Add to recent when component mounts
  useState(() => {
    addToRecent(color);
  });

  const toggleSaved = () => {
    if (isSaved(color.PANTONENAME)) {
      removeFromSaved(color.PANTONENAME);
      toast({
        title: "Removed from saved",
        description: `${color.PANTONENAME} removed from your palette`,
      });
    } else {
      addToSaved(color);
      toast({
        title: "Added to saved",
        description: `${color.PANTONENAME} added to your palette`,
      });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${type}: ${text}`,
      duration: 2000,
    });
  };

  const downloadASE = () => {
    // Simplified ASE generation - in real implementation, would generate proper binary ASE file
    const aseData = {
      name: color.PANTONENAME,
      hex: color.HEX,
      cmyk: { c: color.C, m: color.M, y: color.Y, k: color.K },
      rgb: { r: color.R, g: color.G, b: color.B }
    };
    
    const blob = new Blob([JSON.stringify(aseData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${color.PANTONENAME.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "ASE file downloaded",
      description: `${color.PANTONENAME} swatch exported`,
    });
  };

  const rgb = hexToRgb(color.HEX);
  const lab = rgb ? rgbToLab(rgb) : null;

  return (
    <Card className="fixed inset-4 md:inset-8 z-50 overflow-auto bg-white shadow-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {color.PANTONENAME}
            </h2>
            {deltaE !== undefined && (
              <Badge variant={deltaE > 5 ? "destructive" : "secondary"}>
                ΔE: {deltaE.toFixed(1)} {deltaE > 5 && "- Print proof recommended"}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={isSaved(color.PANTONENAME) ? "default" : "outline"}
              onClick={toggleSaved}
              className="h-10 flex items-center justify-center gap-2 px-4"
            >
              <Heart className={`h-4 w-4 ${isSaved(color.PANTONENAME) ? 'fill-current' : ''}`} />
              <span className="text-sm">
                {isSaved(color.PANTONENAME) ? 'Remove from favorites' : 'Add to favorites'}
              </span>
            </Button>
            <Button variant="outline" onClick={onClose} size="icon" className="h-10 w-10 flex items-center justify-center">
              <div className="relative w-4 h-4">
                <div className="absolute inset-0 w-full h-0.5 bg-current transform rotate-45 top-1/2 -translate-y-0.5"></div>
                <div className="absolute inset-0 w-full h-0.5 bg-current transform -rotate-45 top-1/2 -translate-y-0.5"></div>
              </div>
            </Button>
          </div>
        </div>

        {/* Color Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium mb-2">Color Preview</h3>
            <div className="space-y-2">
              <div
                className="h-24 w-full rounded border"
                style={{ backgroundColor: color.HEX }}
              />
              <div
                className="h-24 w-full rounded border relative"
                style={{ backgroundColor: '#4D4D4D' }}
              >
                <div
                  className="absolute inset-2 rounded"
                  style={{ backgroundColor: color.HEX }}
                />
                <div className="absolute bottom-1 right-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                  On 30% Black
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Actions</h3>
            <div className="space-y-2">
              <Button onClick={downloadASE} variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download ASE
              </Button>
              <Button
                onClick={() => copyToClipboard(
                  `:root { --pantone-${color.PANTONENAME.replace(/\s+/g, '-').toLowerCase()}: ${color.HEX}; }`,
                  'CSS Variable'
                )}
                variant="outline"
                className="w-full justify-start"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy CSS Variable
              </Button>
              <Button
                onClick={() => copyToClipboard(
                  `C:${color.C} M:${color.M} Y:${color.Y} K:${color.K}`,
                  'CMYK'
                )}
                variant="outline"
                className="w-full justify-start"
              >
                <Palette className="h-4 w-4 mr-2" />
                Copy CMYK
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Values</TabsTrigger>
            <TabsTrigger value="tints">Tints</TabsTrigger>
            <TabsTrigger value="harmonies">Harmonies</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">HEX</label>
                  <div className="p-2 bg-gray-50 rounded font-mono text-sm">{color.HEX}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">RGB</label>
                  <div className="p-2 bg-gray-50 rounded font-mono text-sm">
                    {color.R}, {color.G}, {color.B}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">CMYK (US SWOP Coated)</label>
                  <div className="p-2 bg-gray-50 rounded font-mono text-sm">
                    C:{color.C} M:{color.M} Y:{color.Y} K:{color.K}
                  </div>
                </div>
                {lab && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">LAB</label>
                    <div className="p-2 bg-gray-50 rounded font-mono text-sm">
                      L:{lab.L.toFixed(1)} a:{lab.a.toFixed(1)} b:{lab.b.toFixed(1)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tints" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {tints.map((tint) => (
                <div key={tint.percentage} className="text-center">
                  <div
                    className="h-16 w-full rounded border mb-2"
                    style={{ backgroundColor: tint.hex }}
                  />
                  <div className="text-sm font-medium">{tint.percentage}%</div>
                  <div className="text-xs text-gray-600 font-mono">{tint.hex}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="harmonies" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Complementary</h4>
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 rounded border"
                    style={{ backgroundColor: complementaryHex }}
                  />
                  <div>
                    <div className="font-mono text-sm">{complementaryHex}</div>
                    {complementaryMatches.length > 0 && (
                      <div className="text-sm text-gray-600">
                        Nearest: {complementaryMatches[0].PANTONENAME} (ΔE: {complementaryMatches[0].deltaE.toFixed(1)})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">SCSS Map</h4>
                <pre className="p-3 bg-gray-50 rounded text-sm overflow-x-auto">
{`$pantone-colors: (
  "${color.PANTONENAME}": ${color.HEX},
);`}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">CSS Custom Properties</h4>
                <pre className="p-3 bg-gray-50 rounded text-sm overflow-x-auto">
{`:root {
  --pantone-${color.PANTONENAME.replace(/\s+/g, '-').toLowerCase()}-hex: ${color.HEX};
  --pantone-${color.PANTONENAME.replace(/\s+/g, '-').toLowerCase()}-rgb: ${color.R}, ${color.G}, ${color.B};
}`}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
