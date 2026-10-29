import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Temps de lecture estimé à ~200 mots par minute
export function readingTime(text: string) {
  const words = text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean);
  return Math.max(1, Math.round(words.length / 200));
}
