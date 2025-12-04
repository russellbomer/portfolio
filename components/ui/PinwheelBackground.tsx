"use client";

import { useEffect, useState } from "react";
import { Pinwheel } from "./Pinwheel";

interface PinwheelBackgroundProps {
  className?: string;
}

type LayoutConfig = {
  columns: number;
  tileSize: number;
  rowCount: number;
  show: boolean;
  mode: "grid" | "accent"; // grid = tiled background, accent = single decorative pinwheel
};

// =============================================================================
// BREAKPOINT CONFIGURATIONS
// Tune each breakpoint individually for optimal display on target devices
// =============================================================================

const BREAKPOINTS = {
  // Breakpoint 1: Mobile (< 640px)
  // Target: iPhone SE, iPhone 14, Android phones (portrait)
  // Uses accent mode: single pinwheel in top-right corner
  mobile: {
    maxWidth: 639,
    columns: 1,
    tileSize: 60,
    show: true,
    mode: "accent" as const,
  },

  // Breakpoint 2: Large Mobile / Small Tablet (640-767px)
  // Target: Large phones (landscape), small tablets
  sm: {
    maxWidth: 767,
    columns: 1,
    tileSize: 80,
    show: true,
    mode: "accent" as const,
  },

  // Breakpoint 3: Tablet Portrait (768-1023px)
  // Target: iPad Mini, iPad portrait, Android tablets
  md: {
    maxWidth: 1023,
    columns: 1,
    tileSize: 100,
    show: true,
    mode: "grid" as const,
  },

  // Breakpoint 4: Tablet Landscape / Small Laptop (1024-1279px)
  // Target: iPad landscape, MacBook Air, small laptops
  lg: {
    maxWidth: 1279,
    columns: 1,
    tileSize: 140,
    show: true,
    mode: "grid" as const,
  },

  // Breakpoint 5: Desktop (1280-1535px)
  // Target: MacBook Pro 14", standard external monitors
  xl: {
    maxWidth: 1535,
    columns: 2,
    tileSize: 160,
    show: true,
    mode: "grid" as const,
  },

  // Breakpoint 6: Large Desktop (1536px+)
  // Target: 27" monitors, ultrawide, 4K displays
  xxl: {
    maxWidth: Infinity,
    columns: 2,
    tileSize: 200,
    show: true,
    mode: "grid" as const,
  },
};

function getLayoutConfig(width: number, height: number): LayoutConfig {
  let config;

  if (width <= BREAKPOINTS.mobile.maxWidth) {
    config = BREAKPOINTS.mobile;
  } else if (width <= BREAKPOINTS.sm.maxWidth) {
    config = BREAKPOINTS.sm;
  } else if (width <= BREAKPOINTS.md.maxWidth) {
    config = BREAKPOINTS.md;
  } else if (width <= BREAKPOINTS.lg.maxWidth) {
    config = BREAKPOINTS.lg;
  } else if (width <= BREAKPOINTS.xl.maxWidth) {
    config = BREAKPOINTS.xl;
  } else {
    config = BREAKPOINTS.xxl;
  }

  const { columns, tileSize, show, mode } = config;

  // For accent mode, only need 1 pinwheel
  // For grid mode, calculate rows needed to fill scroll depth
  const rowCount = !show
    ? 0
    : mode === "accent"
    ? 1
    : Math.ceil((height * 3) / tileSize) + 2;

  return { columns, tileSize, rowCount, show, mode };
}

export function PinwheelBackground({
  className = "",
}: PinwheelBackgroundProps) {
  const [layout, setLayout] = useState<LayoutConfig>({
    columns: 2,
    tileSize: 200,
    rowCount: 25,
    show: true,
    mode: "grid",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));

    const updateLayout = () => {
      const config = getLayoutConfig(window.innerWidth, window.innerHeight);
      setLayout(config);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Two-color alternating palette
  const fern = "hsl(118 19% 41%)";
  const ferrum = "hsl(22 76% 36%)";

  // Don't render on mobile or before mount (SSR)
  if (!mounted || !layout.show) {
    return null;
  }

  const { columns, tileSize, rowCount, mode } = layout;

  // ACCENT MODE: Single pinwheel in top-right corner with alternating colors
  if (mode === "accent") {
    return (
      <div
        className={`fixed top-4 right-4 pointer-events-none transition-opacity duration-500 ${className}`}
        style={{
          zIndex: 0,
          opacity: mounted ? 0.7 : 0,
          width: tileSize,
          height: tileSize,
        }}
        aria-hidden="true"
      >
        <Pinwheel size={tileSize} colors={[fern, ferrum]} spinSpeed={0.3} />
      </div>
    );
  }

  // GRID MODE: Tiled pinwheel background
  const tiles: { row: number; col: number; color: string; speed: number }[] =
    [];

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < columns; col++) {
      // Checkerboard: (row + col) % 2 alternates
      const color = (row + col) % 2 === 0 ? fern : ferrum;
      const speed = 0.5;
      tiles.push({ row, col, color, speed });
    }
  }

  // Calculate container width based on columns
  const containerWidth = tileSize * columns + 50; // Extra for rotation overflow

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 pointer-events-none transition-opacity duration-500 ${className}`}
      style={{
        zIndex: 0,
        width: `${containerWidth}px`,
        opacity: mounted ? 1 : 0,
      }}
      aria-hidden="true"
    >
      {tiles.map(({ row, col, color, speed }, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center"
          style={{
            right: col * tileSize,
            top: row * tileSize,
            width: tileSize,
            height: tileSize,
          }}
        >
          <Pinwheel size={tileSize} color={color} spinSpeed={speed} />
        </div>
      ))}
    </div>
  );
}
