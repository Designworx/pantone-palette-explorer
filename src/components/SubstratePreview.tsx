
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PantoneColor } from '@/data/pantoneData';

interface SubstratePreviewProps {
  color: PantoneColor;
  className?: string;
}

type Substrate = 'coated' | 'uncoated' | 'matte';

const substrateEffects = {
  coated: {
    name: 'Coated Paper',
    description: 'Glossy, vibrant colors',
    filter: 'brightness(1.1) saturate(1.15) contrast(1.05)',
  },
  uncoated: {
    name: 'Uncoated Paper',
    description: 'Muted, absorbed colors',
    filter: 'brightness(0.9) saturate(0.85) contrast(0.95)',
  },
  matte: {
    name: 'Matte Paper',
    description: 'Soft, reduced glare',
    filter: 'brightness(0.95) saturate(0.95) contrast(1.02)',
  },
};

export const SubstratePreview = ({ color, className = '' }: SubstratePreviewProps) => {
  const [selectedSubstrate, setSelectedSubstrate] = useState<Substrate>('coated');

  return (
    <Card className={`p-4 ${className}`}>
      <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
        Paper Stock Preview
      </h4>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(Object.keys(substrateEffects) as Substrate[]).map((substrate) => (
          <Button
            key={substrate}
            variant={selectedSubstrate === substrate ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSubstrate(substrate)}
            className="text-xs"
          >
            {substrateEffects[substrate].name.split(' ')[0]}
          </Button>
        ))}
      </div>
      
      <div className="space-y-3">
        <div className="text-center">
          <div 
            className="w-full h-16 rounded-lg border border-gray-300 mb-2 transition-all duration-300"
            style={{ 
              backgroundColor: color.HEX,
              filter: substrateEffects[selectedSubstrate].filter,
            }}
          />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {substrateEffects[selectedSubstrate].description}
          </p>
        </div>
        
        {/* Color values adjusted for substrate */}
        <div className="text-xs space-y-1 bg-gray-50 dark:bg-gray-800 p-2 rounded">
          <div><span className="font-medium">Substrate:</span> {substrateEffects[selectedSubstrate].name}</div>
          <div><span className="font-medium">Original:</span> {color.HEX}</div>
          <div><span className="font-medium">CMYK:</span> C:{color.C} M:{color.M} Y:{color.Y} K:{color.K}</div>
        </div>
      </div>
    </Card>
  );
};
