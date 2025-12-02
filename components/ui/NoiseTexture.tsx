// Lines: 1-52 (entire file)
"use client";

import { useEffect, useState } from "react";

/**
 * SVG paper texture overlay using feTurbulence + feDiffuseLighting.
 * Creates realistic paper grain with depth through simulated lighting.
 * Positioned behind all content (z-[-1]) to only affect background.
 */
export function NoiseTexture() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Light mode: warm linen | Dark mode: deep thorn green
  const lightingColor = isDark ? "hsl(107 18% 15%)" : "hsl(44 100% 94%)";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1]"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        style={{ mixBlendMode: "multiply", opacity: isDark ? 0.5 : 0.35 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="roughpaper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="5"
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor={lightingColor}
            surfaceScale="2"
          >
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#roughpaper)"
          fill="none"
        />
      </svg>
    </div>
  );
}
