
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MainSearchInputProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const MainSearchInput = ({
  searchTerm,
  onSearchChange
}: MainSearchInputProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 h-6 w-6 pointer-events-none" />
        <Input 
          type="text" 
          placeholder="Search Pantone colors by name or number..." 
          value={searchTerm} 
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-14 h-16 text-xl font-medium border-3 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 shadow-lg rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500" 
        />
      </div>
    </div>
  );
};
