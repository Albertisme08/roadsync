
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";
import { FreightTypeData, filterFreightTypes } from "@/utils/freightTypeData";
import { Loader2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FreightTypeAutosuggestProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const FreightTypeAutosuggest: React.FC<FreightTypeAutosuggestProps> = ({
  value,
  onChange,
  placeholder = "Enter freight type",
  disabled = false,
}) => {
  const [suggestions, setSuggestions] = useState<FreightTypeData[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedType, setSelectedType] = useState<FreightTypeData | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search for performance
  useEffect(() => {
    const query = value;
    if (query.length >= 1) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setSuggestions(filterFreightTypes(query));
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
    setSelectedType(null);
    setHighlightedIndex(-1);
  };

  const handleSelectSuggestion = (suggestion: FreightTypeData) => {
    onChange(suggestion.label);
    setSelectedType(suggestion);
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
    <TooltipProvider>
      <div className="relative">
        <div className="flex items-center gap-2">
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
          
          {selectedType && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-shrink-0 cursor-help">
                  <Info className="h-4 w-4 text-gray-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent 
                className="w-80 p-0" 
                side="right"
                align="start"
              >
                <div className="p-3 space-y-2">
                  <div>
                    <p className="font-medium text-sm">English:</p>
                    <p className="text-sm text-muted-foreground">{selectedType.descriptionEn}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Español:</p>
                    <p className="text-sm text-muted-foreground">{selectedType.descriptionEs}</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

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
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    index === highlightedIndex ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div>
                    <p className="text-sm font-medium">{suggestion.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{suggestion.descriptionEn}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default FreightTypeAutosuggest;
