"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@meetpoint/ui";
import type { Coordinates } from "@meetpoint/types";

interface AddressSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

interface AddressInputProps {
  onSelect: (coordinates: Coordinates, address: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export function AddressInput({
  onSelect,
  placeholder = "Rechercher une adresse...",
  initialValue = "",
}: AddressInputProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
          setSuggestions([]);
          return;
        }
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&country=fr&language=fr&limit=5`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      } catch (_error) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (suggestion: AddressSuggestion) => {
    const [lng, lat] = suggestion.center;
    setQuery(suggestion.place_name);
    setShowSuggestions(false);
    onSelect({ lat, lng }, suggestion.place_name);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full"
        role="combobox"
        aria-expanded={showSuggestions && suggestions.length > 0}
        aria-autocomplete="list"
        aria-controls="address-suggestions-listbox"
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 animate-spin text-keria-muted" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            id="address-suggestions-listbox"
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-keria-forest/50 bg-keria-darker shadow-lg"
          >
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={suggestion.id}
                role="option"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.05 }}
                onClick={() => handleSelect(suggestion)}
                className="cursor-pointer px-4 py-3 text-sm text-keria-cream hover:bg-keria-forest/30 transition-colors"
              >
                <span className="font-medium">
                  {suggestion.place_name.split(",")[0]}
                </span>
                <span className="text-keria-muted">
                  {suggestion.place_name.includes(",") &&
                    ", " + suggestion.place_name.split(",").slice(1).join(",")}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
