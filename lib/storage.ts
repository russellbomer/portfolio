/**
 * LocalStorage utilities for theme persistence
 */
import { validateThemeTokens } from "@/schemas/theme";
import type { ThemeTokens } from "@/types/theme";

const STORAGE_KEY = "theme-lab/v1";

/**
 * Save theme tokens to localStorage
 */
export function saveTheme(tokens: ThemeTokens): void {
  if (typeof window === "undefined") return;

  try {
    const json = JSON.stringify(tokens);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error("Failed to save theme to localStorage:", error);
  }
}

/**
 * Load theme tokens from localStorage
 */
export function loadTheme(): ThemeTokens | null {
  if (typeof window === "undefined") return null;

  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return null;

    const data = JSON.parse(json);
    const result = validateThemeTokens(data);

    if (result.success && result.data) {
      return result.data as ThemeTokens;
    }

    console.warn("Invalid theme data in localStorage:", result.errors);
    return null;
  } catch (error) {
    console.error("Failed to load theme from localStorage:", error);
    return null;
  }
}

/**
 * Clear theme from localStorage
 */
export function clearTheme(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear theme from localStorage:", error);
  }
}

/**
 * Check if there's a saved theme
 */
export function hasSavedTheme(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}
