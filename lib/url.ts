/**
 * URL utilities for theme sharing via query parameters
 */
import { validateThemeTokens } from "@/schemas/theme";
import type { ThemeTokens } from "@/types/theme";

/**
 * Encode theme tokens to base64 for URL sharing
 */
export function encodeThemeToUrl(tokens: ThemeTokens): string {
  try {
    const json = JSON.stringify(tokens);
    const base64 = Buffer.from(json).toString("base64");
    return base64;
  } catch (error) {
    console.error("Failed to encode theme to URL:", error);
    throw error;
  }
}

/**
 * Decode theme tokens from base64 URL parameter
 */
export function decodeThemeFromUrl(base64: string): {
  success: boolean;
  data?: ThemeTokens;
  errors?: string[];
} {
  try {
    const json = Buffer.from(base64, "base64").toString("utf-8");
    const data = JSON.parse(json);
    const result = validateThemeTokens(data);

    if (result.success && result.data) {
      return { success: true, data: result.data as ThemeTokens };
    }

    return { success: false, errors: result.errors };
  } catch (error) {
    return {
      success: false,
      errors: [
        `Failed to decode theme: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      ],
    };
  }
}

/**
 * Get theme from URL query parameter
 */
export function getThemeFromUrl(): {
  success: boolean;
  data?: ThemeTokens;
  errors?: string[];
} | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const themeParam = params.get("theme");

  if (!themeParam) return null;

  return decodeThemeFromUrl(themeParam);
}

/**
 * Update URL with theme parameter without page reload
 */
export function updateUrlWithTheme(tokens: ThemeTokens): void {
  if (typeof window === "undefined") return;

  try {
    const base64 = encodeThemeToUrl(tokens);
    const url = new URL(window.location.href);
    url.searchParams.set("theme", base64);
    window.history.replaceState({}, "", url.toString());
  } catch (error) {
    console.error("Failed to update URL with theme:", error);
  }
}

/**
 * Clear theme from URL
 */
export function clearThemeFromUrl(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.delete("theme");
  window.history.replaceState({}, "", url.toString());
}

/**
 * Copy shareable URL to clipboard
 */
export async function copyShareableUrl(tokens: ThemeTokens): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const base64 = encodeThemeToUrl(tokens);
    const url = new URL(window.location.href);
    url.searchParams.set("theme", base64);

    await navigator.clipboard.writeText(url.toString());
    return true;
  } catch (error) {
    console.error("Failed to copy URL to clipboard:", error);
    return false;
  }
}
