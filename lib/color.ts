/**
 * Color utilities for HSL manipulation, contrast checking, and scale generation
 */
import type { Hsl, ShadeStop } from "@/types/theme";
import * as culori from "culori";

/**
 * Parse HSL triplet string to numeric values
 */
export function parseHslTriplet(str: Hsl): { h: number; s: number; l: number } {
  const match = str.match(
    /^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/
  );
  if (!match) {
    throw new Error(`Invalid HSL format: ${str}`);
  }
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

/**
 * Format HSL values back to triplet string
 */
export function formatHslTriplet(h: number, s: number, l: number): Hsl {
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%` as Hsl;
}

/**
 * Convert HSL to RGB (0-255)
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  // Normalize
  h = h % 360;
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert sRGB value (0-255) to linear RGB (0-1)
 */
function sRgbToLinear(val: number): number {
  const v = val / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Calculate relative luminance (0-1) from HSL
 * Based on WCAG 2.1 formula: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function relativeLuminance(hsl: Hsl): number {
  const { h, s, l } = parseHslTriplet(hsl);
  const { r, g, b } = hslToRgb(h, s, l);

  const rLinear = sRgbToLinear(r);
  const gLinear = sRgbToLinear(g);
  const bLinear = sRgbToLinear(b);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 formula: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function contrastRatio(a: Hsl, b: Hsl): number {
  const lum1 = relativeLuminance(a);
  const lum2 = relativeLuminance(b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast passes WCAG requirements
 */
export function checkContrast(
  foreground: Hsl,
  background: Hsl,
  level: "AA" | "AAA" = "AA",
  size: "normal" | "large" = "normal"
): { ratio: number; passes: boolean } {
  const ratio = contrastRatio(foreground, background);

  let threshold: number;
  if (level === "AAA") {
    threshold = size === "large" ? 4.5 : 7.0;
  } else {
    threshold = size === "large" ? 3.0 : 4.5;
  }

  return {
    ratio,
    passes: ratio >= threshold,
  };
}

/**
 * Generate a shade scale from a base HSL color
 * Attempts to use OKLCH for perceptually uniform scaling
 * Falls back to HSL manipulation if culori is unavailable
 */
export function generateScale(
  base: Hsl,
  stops: string[] = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "950",
  ]
): ShadeStop[] {
  const { h, s, l } = parseHslTriplet(base);

  // Try to use culori for better perceptual scaling
  try {
    // Dynamically import culori (works in browser and SSR)
    if (typeof window !== "undefined") {
      return generateScaleWithCulori(base, stops);
    }
  } catch (e) {
    // Fall through to HSL-based generation
  }

  // Fallback: HSL-based scale generation
  // Map stops to lightness values (inverted for typical scale)
  const stopMap: Record<string, number> = {
    "50": 95,
    "100": 90,
    "200": 80,
    "300": 70,
    "400": 60,
    "500": 50, // base
    "600": 40,
    "700": 30,
    "800": 20,
    "900": 10,
    "950": 5,
  };

  return stops.map((key) => {
    const targetL = stopMap[key] ?? l;
    // Adjust saturation slightly for very light/dark shades
    let adjustedS = s;
    if (targetL > 85) {
      adjustedS = Math.max(s * 0.5, s - 20);
    } else if (targetL < 15) {
      adjustedS = Math.max(s * 0.7, s - 10);
    }

    return {
      key,
      hsl: formatHslTriplet(h, adjustedS, targetL),
    };
  });
}

/**
 * Generate scale using culori for OKLCH-based perceptual uniformity
 * This function will be implemented when culori is loaded
 */
function generateScaleWithCulori(base: Hsl, stops: string[]): ShadeStop[] {
  const { h, s, l } = parseHslTriplet(base);
  const hslColor = culori.hsl({ h, s: s / 100, l: l / 100 });

  // Convert to OKLCH
  const oklch = culori.oklch(hslColor);

  if (!oklch) {
    throw new Error("Failed to convert to OKLCH");
  }

  const stopMap: Record<string, number> = {
    "50": 0.95,
    "100": 0.9,
    "200": 0.8,
    "300": 0.7,
    "400": 0.6,
    "500": 0.5,
    "600": 0.4,
    "700": 0.3,
    "800": 0.2,
    "900": 0.1,
    "950": 0.05,
  };

  return stops.map((key) => {
    const targetL = stopMap[key] ?? oklch.l;
    const scaledColor: culori.Oklch = { ...oklch, l: targetL, mode: "oklch" };

    // Convert back to HSL and clamp to gamut
    const clamped = culori.clampRgb(scaledColor);
    const hslResult = culori.hsl(clamped);

    if (!hslResult) {
      // Fallback to base color if conversion fails
      return { key, hsl: base };
    }

    return {
      key,
      hsl: formatHslTriplet(
        hslResult.h || 0,
        (hslResult.s || 0) * 100,
        (hslResult.l || 0) * 100
      ),
    };
  });
}

/**
 * Lighten an HSL color by a percentage
 */
export function lighten(hsl: Hsl, amount: number): Hsl {
  const { h, s, l } = parseHslTriplet(hsl);
  const newL = Math.min(100, l + amount);
  return formatHslTriplet(h, s, newL);
}

/**
 * Darken an HSL color by a percentage
 */
export function darken(hsl: Hsl, amount: number): Hsl {
  const { h, s, l } = parseHslTriplet(hsl);
  const newL = Math.max(0, l - amount);
  return formatHslTriplet(h, s, newL);
}

/**
 * Adjust saturation of an HSL color
 */
export function saturate(hsl: Hsl, amount: number): Hsl {
  const { h, s, l } = parseHslTriplet(hsl);
  const newS = Math.min(100, Math.max(0, s + amount));
  return formatHslTriplet(h, newS, l);
}

/**
 * Convert HSL to hex for display/debugging
 */
export function hslToHex(hsl: Hsl): string {
  const { h, s, l } = parseHslTriplet(hsl);
  const { r, g, b } = hslToRgb(h, s, l);

  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert a hex color to HSL triplet format ("H S% L%")
 */
export function hexToHsl(hex: string): Hsl {
  let value = hex.trim().replace(/^#/, "");

  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (value.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
  }

  h = Math.round((h * 60 + 360) % 360);

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  const saturation = Math.round(s * 100);
  const lightness = Math.round(l * 100);

  return formatHslTriplet(h, saturation, lightness);
}
