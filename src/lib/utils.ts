/** Small utility helpers */
import { type ClassValue, clsx } from "clsx";

// Lightweight clsx – avoids needing the full tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
