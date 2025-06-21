
import { FuzzySearchInput } from './FuzzySearchInput';
import { PantoneColor } from '@/data/pantoneData';

interface EnhancedMainSearchInputProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  allColors: PantoneColor[];
}

export const EnhancedMainSearchInput = ({
  searchTerm,
  onSearchChange,
  allColors
}: EnhancedMainSearchInputProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <FuzzySearchInput
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        allColors={allColors}
      />
    </div>
  );
};
