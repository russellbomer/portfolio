"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type Shape = "circle" | "triangle";

// Shapes are cropped directly from the source logo mark (Datum-Logo.png),
// preserving its actual stroke/fill proportions rather than approximating
// them — see public/images/datum/datum-{triangle,circle}[-dark].png.
const SHAPE_SIZE = 32; // rendered size, square (both source crops are ~1:1)
const TILE_SIZE = 64; // spacing between repeats within a single line
// Track length needed for the slowest column (ratio 1) to comfortably
// cover the viewport + full page scroll. Faster columns translate further
// for the same scroll distance, so each column scales this by its own
// speed ratio — otherwise faster columns run out of rendered track (and
// visibly end) before reaching the bottom of the page.
const BASE_RAIL_HEIGHT = 3600;

// Static offset between the two overlapping columns so they're staggered
// rather than sitting exactly on top of each other, at rest and at any
// scroll position (on top of the dynamic drift from their speed difference).
const COLUMN_STAGGER = TILE_SIZE / 2;

// Each column gets its own speed, scaled off the leftmost column's speed,
// continuing the same +0.5 ratio progression for however many columns exist.
const BASE_SPEED = 0.15;
const SPEED_RATIOS = [
  1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5,
];

// Opacity steps down linearly from the outermost column to the innermost.
const OUTER_OPACITY = 0.8;
const INNER_OPACITY = 0.05;

function TiledColumn({
  lightSrc,
  darkSrc,
  y,
  speedRatio,
  side,
  offset,
  opacity,
  flip = false,
  staggerOffset = 0,
}: {
  lightSrc: string;
  darkSrc: string;
  y: MotionValue<number>;
  speedRatio: number; // scales this column's own track length — see BASE_RAIL_HEIGHT
  side: "left" | "right";
  offset: number; // in Tailwind spacing units (steps of 0.25rem), applied inline —
  // a template-literal class like `left-${offset}` wouldn't be seen by
  // Tailwind's static JIT scanner and would silently never generate CSS.
  opacity: number;
  flip?: boolean; // mirror horizontally, for the right-side reflection
  staggerOffset?: number;
}) {
  const railHeight = BASE_RAIL_HEIGHT * speedRatio;
  const tileCount = Math.ceil(railHeight / TILE_SIZE);

  return (
    <motion.div
      className="absolute top-0 flex flex-col items-center"
      style={{
        y,
        [side]: `${offset * 0.25}rem`,
        height: railHeight + staggerOffset,
        paddingTop: staggerOffset,
        opacity,
      }}
    >
      {Array.from({ length: tileCount }).map((_, i) => (
        <div
          key={i}
          style={{ height: TILE_SIZE, width: SHAPE_SIZE }}
          className="relative shrink-0"
        >
          {/* Image is taller (SHAPE_SIZE) than its tile slot (TILE_SIZE),
              so it overflows into neighboring tiles' space — that overlap
              is the point, not a bug. */}
          <Image
            src={lightSrc}
            alt=""
            width={SHAPE_SIZE}
            height={SHAPE_SIZE}
            className={`absolute top-0 left-0 block dark:hidden ${flip ? "-scale-x-100" : ""}`}
          />
          <Image
            src={darkSrc}
            alt=""
            width={SHAPE_SIZE}
            height={SHAPE_SIZE}
            className={`absolute top-0 left-0 hidden dark:block ${flip ? "-scale-x-100" : ""}`}
          />
        </div>
      ))}
    </motion.div>
  );
}

export function DatumParallaxRails() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // One independent speed per column, each a multiple of BASE_SPEED per
  // SPEED_RATIOS. All still drift upward (negative). Rules of Hooks means
  // these have to be explicit calls, not a loop — the count is fixed anyway.
  const y1 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[0]));
  const y2 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[1]));
  const y3 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[2]));
  const y4 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[3]));
  const y5 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[4]));
  const y6 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[5]));
  const y7 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[6]));
  const y8 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[7]));
  const y9 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[8]));
  const y10 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[9]));
  const y11 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[10]));
  const y12 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[11]));
  const y13 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[12]));
  const y14 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[13]));
  const y15 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[14]));
  const y16 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[15]));
  const y17 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[16]));
  const y18 = useTransform(scrollY, (v) => (shouldReduceMotion ? 0 : -v * BASE_SPEED * SPEED_RATIOS[17]));

  // circle/triangle alternate; every triangle keeps the staggered vertical
  // offset; horizontal position steps by 2 units per column throughout.
  const speeds = [y1, y2, y3, y4, y5, y6, y7, y8, y9, y10, y11, y12, y13, y14, y15, y16, y17, y18];

  // Linear step from OUTER_OPACITY (column 0, flush against the edge) down
  // to INNER_OPACITY (the last column).
  const opacityStep = (OUTER_OPACITY - INNER_OPACITY) / (speeds.length - 1);
  const opacityForIndex = (i: number) => OUTER_OPACITY - i * opacityStep;

  const columns = speeds.map((y, i) => ({
    shape: (i % 2 === 0 ? "circle" : "triangle") as Shape,
    y,
    speedRatio: SPEED_RATIOS[i],
    offset: i * 2.25,
    opacity: opacityForIndex(i),
  }));

  // Mirrored on the right: same shape/position sequence and the *same*
  // (not reversed) speed-per-offset mapping. The right cluster is already
  // spatially mirrored via `right:` positioning, so reversing the speed
  // order too would cancel that mirroring out and reproduce the left
  // cluster's screen-space speed gradient instead of its true reflection —
  // reusing the same offset->speed pairing is what actually mirrors it.
  const rightColumns = speeds.map((y, i) => ({
    shape: (i % 2 === 0 ? "circle" : "triangle") as Shape,
    y,
    speedRatio: SPEED_RATIOS[i],
    offset: i * 2.25,
    opacity: opacityForIndex(i),
  }));

  return (
    <div
      // z-0 (not z-[-1]) so this sits above the global NoiseTexture (z-[-1],
      // painted after this in DOM order otherwise sits on top and its
      // multiply blend dims these regardless of their own opacity). Since
      // this renders before <main> in the page tree, it still paints behind
      // all actual content at the z-0/auto layer — DOM order governs
      // stacking among same-layer elements, and normal content comes later.
      className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden lg:block"
      aria-hidden="true"
    >
      {/* Left edge: circle / triangle, alternating and overlapping, 18
          columns deep. Each column has its own scroll speed (see
          SPEED_RATIOS); triangle columns keep the staggered vertical
          offset so they don't align exactly with the circles. */}
      <div className="absolute left-0 top-0 h-full">
        {columns.map((col, i) => (
          <TiledColumn
            key={i}
            lightSrc={`/images/datum/datum-${col.shape}.png`}
            darkSrc={`/images/datum/datum-${col.shape}-dark.png`}
            y={col.y}
            speedRatio={col.speedRatio}
            side="left"
            offset={col.offset}
            opacity={col.opacity}
            staggerOffset={col.shape === "triangle" ? COLUMN_STAGGER : 0}
          />
        ))}
      </div>

      {/* Right edge: mirror image of the left cluster — shapes flipped
          horizontally, speed ratios reversed. */}
      <div className="absolute right-0 top-0 h-full">
        {rightColumns.map((col, i) => (
          <TiledColumn
            key={i}
            lightSrc={`/images/datum/datum-${col.shape}.png`}
            darkSrc={`/images/datum/datum-${col.shape}-dark.png`}
            y={col.y}
            speedRatio={col.speedRatio}
            side="right"
            offset={col.offset}
            opacity={col.opacity}
            flip
            staggerOffset={col.shape === "triangle" ? COLUMN_STAGGER : 0}
          />
        ))}
      </div>
    </div>
  );
}
