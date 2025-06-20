
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
    <div className="flex items-center justify-center min-h-[120px] shadow-md z-[99999] relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl w-full">
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
    </div>
  );
};
