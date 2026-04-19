import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUnit(unit?: string): string {
  if (!unit) return "";
  const map: Record<string, string> = {
    UNIT: "Unidad",
    GRAM: "Gramos",
    KILOGRAM: "Kilogramos",
    MILLILITER: "Mililitros",
    LITER: "Litros",
  };
  return map[unit] || unit;
}
