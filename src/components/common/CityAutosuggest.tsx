
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";
import { CityData, filterCities } from "@/utils/cityData";
import { Loader2 } from "lucide-react";

interface CityAutosuggestProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CityAutosuggest: React.FC<CityAutosuggestProps> = ({
  value,
  onChange,
  placeholder = "Enter city, state",
  disabled = false,
}) => {
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search for performance
  useEffect(() => {
    const query = value;
    if (query.length >= 2) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setSuggestions(filterCities(query));
        setIsLoading(false);
      }, 150); // Small delay for better UX
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  useEffect(() => {
    // Handle clicks outside the component to close suggestions
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onChange(query);
    setHighlightedIndex(-1);
  };

  const handleSelectSuggestion = (suggestion: CityData) => {
    onChange(suggestion.display);
    setSuggestions([]);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle keyboard navigation
    if (!suggestions.length) return;

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
    // Enter
    else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    }
    // Escape
    else if (e.key === "Escape") {
      setSuggestions([]);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <FormControl>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          className="w-full"
          autoComplete="off"
        />
      </FormControl>

      {isLoading && isFocused && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Loader2 size={16} className="animate-spin text-gray-400" />
        </div>
      )}

      {suggestions.length > 0 && isFocused && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                  index === highlightedIndex ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {suggestion.display}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CityAutosuggest;
