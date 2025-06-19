
import { PantoneColor } from '@/data/pantoneData';
import { ColorSwatch } from '@/components/ColorSwatch';
import { Badge } from '@/components/ui/badge';

interface NearestMatchesProps {
  nearestMatches: Array<PantoneColor & { deltaE: number }>;
  onColorSelect: (color: PantoneColor, deltaE?: number) => void;
}

export const NearestMatches = ({ nearestMatches, onColorSelect }: NearestMatchesProps) => {
  if (nearestMatches.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <h3 className="text-lg font-semibold mb-4">Nearest Pantone Matches</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {nearestMatches.map((color, index) => (
          <div key={index} className="relative">
            <ColorSwatch
              color={color}
              onClick={() => onColorSelect(color, color.deltaE)}
            />
            <Badge
              variant={color.deltaE > 5 ? "destructive" : "secondary"}
              className="absolute top-2 right-2"
            >
              ΔE: {color.deltaE.toFixed(1)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
