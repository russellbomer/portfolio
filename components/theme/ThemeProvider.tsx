"use client";

/**
 * ThemeProvider component
 * Applies CSS variables and exposes theme context
 */
import type { SchemeName, ThemeTokens } from "@/types/theme";
import React, { createContext, useContext, useEffect, useMemo } from "react";

interface ThemeContextValue {
  tokens: ThemeTokens;
  scheme: SchemeName;
  setTokens: (tokens: ThemeTokens) => void;
  setScheme: (scheme: SchemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  tokens: ThemeTokens;
  scheme: SchemeName;
  setTokens: (tokens: ThemeTokens) => void;
  setScheme: (scheme: SchemeName) => void;
  children: React.ReactNode;
  className?: string;
}

export function ThemeProvider({
  tokens,
  scheme,
  setTokens,
  setScheme,
  children,
  className,
}: ThemeProviderProps) {
  // Compute CSS variables from tokens
  const styleVars = useMemo(() => {
    const vars: Record<string, string> = {};
    const mapping = tokens.schemes[scheme];

    // Resolve each semantic role to an HSL triplet
    Object.entries(mapping).forEach(([role, { baseColorId, shadeKey }]) => {
      const baseColor = tokens.palette.find((c) => c.id === baseColorId);
      if (!baseColor) {
        console.warn(
          `Base color "${baseColorId}" not found for role "${role}"`
        );
        return;
      }

      let hsl = baseColor.hsl;

      // If shadeKey is specified and scale exists, use that shade
      if (shadeKey && baseColor.scale.length > 0) {
        const shade = baseColor.scale.find((s) => s.key === shadeKey);
        if (shade) {
          hsl = shade.hsl;
        }
      }

      // Convert role to CSS variable name
      const varName = `--${role}`;
      vars[varName] = hsl;
    });

    console.log("[ThemeProvider] Computed vars for", scheme, ":", vars);
    return vars;
  }, [tokens, scheme]);

  const contextValue: ThemeContextValue = {
    tokens,
    scheme,
    setTokens,
    setScheme,
  };

  // Apply CSS variables as inline styles for proper React hydration
  const inlineStyles = useMemo(() => {
    const styles: Record<string, string> = {};
    Object.entries(styleVars).forEach(([key, value]) => {
      // Base variable, e.g. --primary: "118 19% 41%"
      styles[key] = value;
      // Also set Tailwind's resolved variable explicitly, e.g. --color-primary: hsl(...)
      const varName = key.replace(/^--/, "");
      styles[`--color-${varName}`] = `hsl(${value})`;
    });
    console.log("[ThemeProvider] Inline styles for", scheme, ":", styles);
    return styles as React.CSSProperties;
  }, [styleVars, scheme]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    const appliedKeys: string[] = [];

    Object.entries(styleVars).forEach(([key, value]) => {
      const colorVar = `--color-${key.replace(/^--/, "")}`;
      root.style.setProperty(key, value);
      root.style.setProperty(colorVar, `hsl(${value})`);
      appliedKeys.push(key, colorVar);
    });

    return () => {
      appliedKeys.forEach((property) => {
        root.style.removeProperty(property);
      });
    };
  }, [styleVars]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        data-theme={scheme}
        style={inlineStyles}
        className={`theme-lab-preview ${scheme === "dark" ? "dark" : ""} ${
          className || ""
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
