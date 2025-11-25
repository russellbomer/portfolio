"use client";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { initWebVitals } from "@/lib/analytics/web-vitals";
import tokensJson from "@/portfolio-theme-alpha.json";
import type { SchemeName, ThemeTokens } from "@/types/theme";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "portfolio-theme-scheme";

function resolveInitialScheme(): SchemeName {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  return prefersDark.matches ? "dark" : "light";
}

function hasStoredPreference(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark";
}

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialTokens = useMemo(() => tokensJson as ThemeTokens, []);
  const [tokens, setTokens] = useState<ThemeTokens>(initialTokens);
  const [scheme, setSchemeState] = useState<SchemeName>(() =>
    resolveInitialScheme()
  );
  const hasExplicitPreferenceRef = useRef<boolean>(hasStoredPreference());

  const setScheme = useCallback((nextScheme: SchemeName) => {
    setSchemeState(nextScheme);
    if (typeof window !== "undefined") {
      hasExplicitPreferenceRef.current = true;
      window.localStorage.setItem(STORAGE_KEY, nextScheme);
    }
  }, []);

  // Initialize Web Vitals once on mount (client only).
  useEffect(() => {
    initWebVitals();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.dataset.theme = scheme;
    document.documentElement.classList.toggle("dark", scheme === "dark");
    document.documentElement.style.colorScheme = scheme;
  }, [scheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (!hasExplicitPreferenceRef.current) {
      setSchemeState(mediaQuery.matches ? "dark" : "light");
    }

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (hasExplicitPreferenceRef.current) {
        return;
      }
      setSchemeState(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <ThemeProvider
      tokens={tokens}
      scheme={scheme}
      setTokens={setTokens}
      setScheme={setScheme}
    >
      {children}
    </ThemeProvider>
  );
}
