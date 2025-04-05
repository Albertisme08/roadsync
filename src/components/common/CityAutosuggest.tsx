
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";
import { CityData, filterCities } from "@/utils/cityData";

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
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    
    if (query.length >= 2) {
      setSuggestions(filterCities(query));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: CityData) => {
    onChange(suggestion.display);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  return (
    <div className="relative">
      <FormControl>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          className="w-full"
        />
      </FormControl>

      {suggestions.length > 0 && isFocused && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSelectSuggestion(suggestion)}
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
