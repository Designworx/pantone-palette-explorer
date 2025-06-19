
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { PantoneColor } from '@/data/pantoneData';

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  colorFamily: string;
  onColorFamilyChange: (family: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onNearestMatch: (colors: Array<PantoneColor & { deltaE: number }>) => void;
}

export const SearchSection = ({
  searchTerm,
  onSearchChange,
  colorFamily,
  onColorFamilyChange,
  sortBy,
  onSortChange,
  onNearestMatch
}: SearchSectionProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <AdvancedSearch
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        colorFamily={colorFamily}
        onColorFamilyChange={onColorFamilyChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onNearestMatch={onNearestMatch}
      />
    </div>
  );
};
