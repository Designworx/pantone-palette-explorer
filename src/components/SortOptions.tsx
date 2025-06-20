
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfoTooltip } from './InfoTooltip';

interface SortOptionsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  openPopover: string | null;
  onPopoverChange: (popoverId: string, isOpen: boolean) => void;
}

export const SortOptions = ({
  sortBy,
  onSortChange,
  openPopover,
  onPopoverChange
}: SortOptionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <InfoTooltip 
        content="Sort results by different criteria" 
        popoverId="sortBy"
        openPopover={openPopover}
        onPopoverChange={onPopoverChange}
      />
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="h-10">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent className="z-[200]">
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="lightness">Lightness</SelectItem>
          <SelectItem value="chroma">Chroma</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
