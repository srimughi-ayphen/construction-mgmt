import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//helps combine class names (like "bg-red-500", "text-white") safely
//fixes conflicts between Tailwind classes (like "p-2" vs "p-4")

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
export function titleCase(str: string): string {
  if (!str) return "-";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
