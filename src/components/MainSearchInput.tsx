
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
    <div className="relative flex items-center justify-center mb-8">
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
        <Input 
          type="text" 
          placeholder="Search Pantone colors by name or number..." 
          value={searchTerm} 
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-16 h-14 text-lg font-medium border border-border focus:border-ring transition-all duration-200 bg-card shadow-sm placeholder:text-muted-foreground" 
        />
      </div>
    </div>
  );
};
