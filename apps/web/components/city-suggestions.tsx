"use client";

import { motion } from "framer-motion";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@meetpoint/ui";
import type { SuggestedCity } from "@/types/ai";

interface CitySuggestionsProps {
  cities: SuggestedCity[];
  onSelectCity: (city: SuggestedCity) => void;
  selectedCityName?: string;
}

export function CitySuggestions({ cities, onSelectCity, selectedCityName }: CitySuggestionsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Villes suggérées</CardTitle>
          <Badge variant="default">{cities.length}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <motion.ul
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {cities.map((city) => {
            const isSelected = selectedCityName === city.name;

            return (
              <motion.li
                key={`${city.name}-${city.region}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className={`rounded-lg border p-3 transition-colors ${
                  isSelected
                    ? "border-keria-gold/50 bg-keria-gold/10"
                    : "border-keria-forest/30 bg-keria-forest/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-keria-cream truncate font-semibold">
                      {city.name}
                    </h3>
                    <p className="text-keria-muted text-xs">{city.region}</p>
                  </div>
                  <Badge variant={city.matchScore >= 80 ? "success" : "warning"}>
                    {city.matchScore}% match
                  </Badge>
                </div>

                <p className="text-keria-cream/80 mt-2 text-sm">{city.reason}</p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectCity(city)}
                  disabled={isSelected}
                  className="mt-3 w-full"
                >
                  {isSelected ? "Choisie" : "Choisir cette ville"}
                </Button>
              </motion.li>
            );
          })}
        </motion.ul>
      </CardContent>
    </Card>
  );
}
