
import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PantoneColor } from '@/data/pantoneData';

interface FuzzySearchInputProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  allColors: PantoneColor[];
}

// Simple fuzzy search algorithm
const fuzzyMatch = (pattern: string, text: string): number => {
  if (!pattern) return 0;
  
  const patternLower = pattern.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match gets highest score
  if (textLower.includes(patternLower)) {
    return textLower.indexOf(patternLower) === 0 ? 100 : 80;
  }
  
  // Fuzzy character matching
  let patternIndex = 0;
  let score = 0;
  
  for (let i = 0; i < textLower.length && patternIndex < patternLower.length; i++) {
    if (textLower[i] === patternLower[patternIndex]) {
      score += 1;
      patternIndex++;
    }
  }
  
  return patternIndex === patternLower.length ? (score / pattern.length) * 60 : 0;
};

export const FuzzySearchInput = ({
  searchTerm,
  onSearchChange,
  allColors
}: FuzzySearchInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchMode, setSearchMode] = useState<'name' | 'number'>('name');

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    if (searchMode === 'number') {
      // Pantone number search (e.g., "300", "300-400")
      const isRange = searchTerm.includes('-');
      if (isRange) {
        const [start, end] = searchTerm.split('-').map(s => parseInt(s.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          return allColors.filter(color => {
            const match = color.PANTONENAME.match(/(\d+)/);
            if (match) {
              const num = parseInt(match[1]);
              return num >= start && num <= end;
            }
            return false;
          }).slice(0, 8);
        }
      } else {
        const num = parseInt(searchTerm);
        if (!isNaN(num)) {
          return allColors.filter(color => 
            color.PANTONENAME.toLowerCase().includes(num.toString())
          ).slice(0, 8);
        }
      }
      return [];
    }
    
    // Fuzzy name search
    const scored = allColors.map(color => ({
      color,
      score: fuzzyMatch(searchTerm, color.PANTONENAME)
    })).filter(item => item.score > 20);
    
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.color);
  }, [searchTerm, allColors, searchMode]);

  const handleSuggestionClick = (colorName: string) => {
    onSearchChange(colorName);
    setShowSuggestions(false);
  };

  useEffect(() => {
    setShowSuggestions(searchTerm.length >= 2);
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-md">
      <div className="flex">
        <Button
          type="button"
          variant={searchMode === 'name' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSearchMode('name')}
          className="rounded-r-none border-r-0 px-3"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={searchMode === 'number' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSearchMode('number')}
          className="rounded-l-none rounded-r-none border-r-0 px-3"
        >
          <Hash className="h-4 w-4" />
        </Button>
        <Input 
          type="text" 
          placeholder={searchMode === 'name' ? "Search by name (e.g., 'coral', 'navy')..." : "Search by number (e.g., '300' or '300-400')..."} 
          value={searchTerm} 
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowSuggestions(searchTerm.length >= 2)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-4 h-16 text-xl font-medium border-3 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 shadow-lg rounded-l-none rounded-r-xl placeholder:text-gray-400 dark:placeholder:text-gray-500" 
        />
      </div>
      
      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((color) => (
            <div
              key={color.PANTONENAME}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              onClick={() => handleSuggestionClick(color.PANTONENAME)}
            >
              <div 
                className="w-8 h-8 rounded-full border border-gray-300"
                style={{ backgroundColor: color.HEX }}
              />
              <span className="text-sm font-medium">{color.PANTONENAME}</span>
              <span className="text-xs text-gray-500 ml-auto">{color.HEX}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
