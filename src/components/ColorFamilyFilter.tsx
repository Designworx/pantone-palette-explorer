
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfoTooltip } from './InfoTooltip';

interface ColorFamilyFilterProps {
  colorFamily: string;
  onColorFamilyChange: (family: string) => void;
  openPopover: string | null;
  onPopoverChange: (popoverId: string, isOpen: boolean) => void;
}

export const ColorFamilyFilter = ({
  colorFamily,
  onColorFamilyChange,
  openPopover,
  onPopoverChange
}: ColorFamilyFilterProps) => {
  const colorFamilies = ['All', 'Reds', 'Yellows', 'Greens', 'Blues', 'Cyans', 'Magentas', 'Neutrals'];

  return (
    <div className="flex items-center gap-2">
      <InfoTooltip 
        content="Filter by color family group" 
        popoverId="colorFamily"
        openPopover={openPopover}
        onPopoverChange={onPopoverChange}
      />
      <Select value={colorFamily} onValueChange={onColorFamilyChange}>
        <SelectTrigger className="h-10">
          <SelectValue placeholder="Color Family" />
        </SelectTrigger>
        <SelectContent className="z-[200]">
          {colorFamilies.map(family => (
            <SelectItem key={family} value={family}>{family}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
