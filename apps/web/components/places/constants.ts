export const CATEGORY_LABELS: Record<string, { label: string }> = {
  restaurant: { label: "Restaurant" },
  cafe: { label: "Café" },
  bar: { label: "Bar" },
  fast_food: { label: "Fast-food" },
  cinema: { label: "Cinéma" },
  park: { label: "Parc" },
  other: { label: "Autre" },
};

export const CATEGORY_FILTERS = [
  { value: "all", label: "Tous" },
  { value: "restaurant", label: "Restaurants" },
  { value: "cafe", label: "Cafés" },
  { value: "bar", label: "Bars" },
  { value: "fast_food", label: "Fast-food" },
];

export const PRICE_LEVELS = ["", "€", "€€", "€€€", "€€€€"];

// Categories searched when the "all" filter is active.
export const DEFAULT_SEARCH_CATEGORIES = ["restaurant", "cafe", "bar", "fast_food"];
