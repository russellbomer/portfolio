// Lines: 1-52 (entire file)
"use client";

import { useEffect, useState } from "react";

interface NoiseTextureProps {
  /** Positioning classes. Defaults to a viewport-fixed layer behind all content. */
  className?: string;
  /** SVG filter id. Override when rendering more than one instance on a page. */
  filterId?: string;
}

/**
 * SVG paper texture overlay using feTurbulence + feDiffuseLighting.
 * Creates realistic paper grain with depth through simulated lighting.
 * Positioned behind all content (z-[-1]) to only affect background.
 */
export function NoiseTexture({
  className = "pointer-events-none fixed inset-0 z-[-1]",
  filterId = "roughpaper",
}: NoiseTextureProps = {}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state - use queueMicrotask to avoid synchronous setState
    queueMicrotask(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

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
    <div className={className} aria-hidden="true">
      <svg
        className="h-full w-full"
        style={{ mixBlendMode: "multiply", opacity: isDark ? 0.5 : 0.35 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
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
          filter={`url(#${filterId})`}
          fill="none"
        />
      </svg>
    </div>
  );
}
