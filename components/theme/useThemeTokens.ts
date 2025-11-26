"use client";

/**
 * Custom hook for managing theme tokens state
 * Handles import/export, URL sync, localStorage, and presets
 */
import { loadTheme, saveTheme } from "@/lib/storage";
import {
  clearThemeFromUrl,
  getThemeFromUrl,
  updateUrlWithTheme,
} from "@/lib/url";
import defaultTheme from "@/portfolio-theme-final.json";
import { validateThemeTokens } from "@/schemas/theme";
import type { SchemeName, ThemeTokens } from "@/types/theme";
import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 1000;

export function useThemeTokens() {
  // Important: initialize with a stable value for SSR and first client render
  // Then, after mount, load URL/localStorage theme to avoid hydration mismatch
  const [tokens, setTokens] = useState<ThemeTokens>(
    () => defaultTheme as ThemeTokens
  );

  const [scheme, setScheme] = useState<SchemeName>("light");
  const [compareMode, setCompareMode] = useState(false);
  const [compareTokens, setCompareTokens] = useState<ThemeTokens>(tokens);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load persisted/URL theme after mount to keep SSR and client initial render identical
  useEffect(() => {
    try {
      const urlTheme = getThemeFromUrl();
      if (urlTheme?.success && urlTheme.data) {
        setTokens(urlTheme.data as ThemeTokens);
        return;
      }

      const savedTheme = loadTheme();
      if (savedTheme) {
        setTokens(savedTheme);
      }
    } catch (_) {
      // ignore and keep default theme
    }
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveTheme(tokens);
    }, DEBOUNCE_MS);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [tokens]);

  // Import theme from JSON
  const importTheme = useCallback(
    (json: string): { success: boolean; errors?: string[] } => {
      try {
        const data = JSON.parse(json);
        const result = validateThemeTokens(data);

        if (result.success && result.data) {
          setTokens(result.data as ThemeTokens);
          return { success: true };
        }

        return { success: false, errors: result.errors };
      } catch (error) {
        return {
          success: false,
          errors: [
            `Invalid JSON: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          ],
        };
      }
    },
    []
  );

  // Export theme to JSON
  const exportTheme = useCallback((): string => {
    return JSON.stringify(tokens, null, 2);
  }, [tokens]);

  // Share via URL
  const shareTheme = useCallback((): string => {
    updateUrlWithTheme(tokens);
    return window.location.href;
  }, [tokens]);

  // Reset to default theme
  const resetTheme = useCallback(() => {
    setTokens(defaultTheme as ThemeTokens);
    clearThemeFromUrl();
  }, []);

  // Toggle scheme
  const toggleScheme = useCallback(() => {
    setScheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Compare mode
  const enableCompare = useCallback(() => {
    setCompareTokens({ ...tokens });
    setCompareMode(true);
  }, [tokens]);

  const disableCompare = useCallback(() => {
    setCompareMode(false);
  }, []);

  const copyMappingToCompare = useCallback(() => {
    setCompareTokens({ ...tokens });
  }, [tokens]);

  return {
    tokens,
    setTokens,
    scheme,
    setScheme,
    toggleScheme,
    compareMode,
    compareTokens,
    setCompareTokens,
    enableCompare,
    disableCompare,
    copyMappingToCompare,
    importTheme,
    exportTheme,
    shareTheme,
    resetTheme,
  };
}
