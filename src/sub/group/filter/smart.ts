import {
  inferCountry,
  inferRate,
  isCountry,
  isEmby,
  isExcluded,
  isLimit,
} from "./infer";
import type { Filter } from "./types";

const AI_COUNTRIES_EXCLUDE = new Set(["HK", "MO", "OT"]);

export function createCountryFilter(country: string): Filter {
  return (name: string): boolean => {
    if (!autoFilter(name)) return false;
    return isCountry(name, country);
  };
}

export const aiFilter: Filter = (name: string): boolean => {
  if (!autoFilter(name)) return false;
  const country = inferCountry(name);
  if (AI_COUNTRIES_EXCLUDE.has(country)) return false;
  return true;
};

export const autoFilter: Filter = (name: string): boolean => {
  if (isExcluded(name)) return false;
  if (isEmby(name)) return false;
  return true;
};

export const balancedFilter: Filter = (name: string): boolean => {
  if (!aiFilter(name)) return false;
  if (inferRate(name) > 1.5) return false;
  return true;
};

export const embyFilter: Filter = (name: string): boolean => {
  if (isExcluded(name)) return false;
  if (isEmby(name)) return true;
  if (isLimit(name)) return false;
  if (inferRate(name) > 0.5) return false;
  return true;
};

export const globalFilter: Filter = (name: string): boolean => {
  if (isExcluded(name)) return false;
  return true;
};

export const mediaFilter: Filter = (name: string): boolean => {
  if (!autoFilter(name)) return false;
  if (isLimit(name)) return false;
  if (inferRate(name) > 1.5) return false;
  return true;
};

export const downloadFilter: Filter = (name: string): boolean => {
  if (!autoFilter(name)) return false;
  if (inferRate(name) > 1.0) return false;
  return true;
};
