"use client";

import { Pinwheel } from "./Pinwheel";

interface PinwheelBackgroundProps {
  className?: string;
}

export function PinwheelBackground({
  className = "",
}: PinwheelBackgroundProps) {
  // Two-color alternating palette
  const fern = "hsl(118 19% 41%)";
  const ferrum = "hsl(22 76% 36%)";

  // Calculate how many rows needed to fill viewport (estimate ~10 rows for tall screens)
  const rowCount = 25;
  const tileSize = 200;

  // Generate 2-column grid with alternating colors (checkerboard pattern)
  const tiles: { row: number; col: number; color: string; speed: number }[] =
    [];

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < 2; col++) {
      // Checkerboard: (row + col) % 2 alternates
      const color = (row + col) % 2 === 0 ? fern : ferrum;
      // All spin clockwise (positive speed)
      const speed = 0.5;
      tiles.push({ row, col, color, speed });
    }
  }

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 pointer-events-none ${className}`}
      style={{
        zIndex: 0,
        width: `${tileSize * 2 + 100}px`, // Extra width for rotation overflow
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
