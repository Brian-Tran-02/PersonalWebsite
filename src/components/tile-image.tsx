"use client";

import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";

const COLS = 26;
const ROWS = 26;

/** Deterministic pseudo-random in [0, 1) — same value on server and client,
 * so per-tile stagger doesn't cause a hydration mismatch. */
function seeded(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

function Tile({
  col,
  row,
  tileW,
  tileH,
  width,
  height,
  src,
  variant,
  range,
  progress,
}: {
  col: number;
  row: number;
  tileW: number;
  tileH: number;
  width: number;
  height: number;
  src: string;
  variant: "disperse" | "assemble";
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const seed = col * 13.37 + row * 7.91;
  const [rangeStart, rangeEnd] = range;
  const span = rangeEnd - rangeStart;
  const start = rangeStart + seeded(seed) * span * 0.5;
  const end = Math.min(rangeEnd, start + span * 0.35 + seeded(seed + 1) * span * 0.2);
  const driftX = (seeded(seed + 2) - 0.5) * 90;
  const driftY = (seeded(seed + 3) - 0.5) * 80 - 40;
  const rotate = (seeded(seed + 4) - 0.5) * 60;

  // "disperse": assembled (1, no offset) -> scattered (0, drifted).
  // "assemble": scattered (0, drifted) -> assembled (1, no offset) — the
  // exact same keyframes, just read in the opposite order.
  const opacity = useTransform(
    progress,
    [start, end],
    variant === "disperse" ? [1, 0] : [0, 1],
  );
  const x = useTransform(
    progress,
    [start, end],
    variant === "disperse" ? [0, driftX] : [driftX, 0],
  );
  const y = useTransform(
    progress,
    [start, end],
    variant === "disperse" ? [0, driftY] : [driftY, 0],
  );
  const scale = useTransform(
    progress,
    [start, end],
    variant === "disperse" ? [1, 0.35] : [0.35, 1],
  );
  const rotateZ = useTransform(
    progress,
    [start, end],
    variant === "disperse" ? [0, rotate] : [rotate, 0],
  );

  // A 1px overlap on every edge hides hairline seams between tiles at full
  // assembly (opacity 1, no offset) — same fix proven earlier today.
  const overlap = 1;
  const left = col * tileW - overlap;
  const top = row * tileH - overlap;

  // The static box (left/top/width/height — plain numbers) lives on a plain
  // div; mixing plain numbers into a motion component's style object makes
  // Framer Motion re-apply the whole style attribute imperatively after
  // mount (with its own rounding), which races React's hydration check and
  // throws a false-positive "tree hydrated but attributes didn't match"
  // warning. The painted content (background-image slice) has to stay on
  // the same element as the animated opacity/transform though, or the tile
  // would sit there fully visible while an empty layer moves on top of it.
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: tileW + overlap * 2,
        height: tileH + overlap * 2,
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${src})`,
          backgroundSize: `${width}px ${height}px`,
          backgroundPosition: `-${left}px -${top}px`,
          opacity,
          x,
          y,
          scale,
          rotateZ,
        }}
      />
    </div>
  );
}

/**
 * Shared tile-particle effect, used two ways:
 * - `variant="disperse"`: starts fully assembled, scatters/fades apart as
 *   `progress` increases (Hero's robot, as Hero scrolls out of view).
 * - `variant="assemble"`: the mirror — starts scattered/invisible, converges
 *   into the whole image as `progress` increases (About's photo, as About
 *   scrolls into view).
 *
 * `progress` is a MotionValue the caller computes (via `useScroll`) with
 * whatever offset config matches its own trigger — this component doesn't
 * know or care whether that's an enter-view or exit-view scroll range, only
 * the `range` sub-window within it (e.g. `[0, 0.35]`) over which the effect
 * should actually play out, since progress 0->1 may span a much longer
 * scroll distance than the effect itself should take.
 *
 * `width`/`height` are independent (not a single square `box`) — the source
 * images aren't necessarily square (the robot art includes a wide
 * holographic base beneath a narrower bust, for instance), and forcing a
 * non-square source into a square box would visibly stretch it.
 *
 * Finer-grained than the first version built today (10x10) — 26x26 reads as
 * dust/particles rather than visible chunky tiles, per explicit request.
 * Still transform/opacity only, no filters, so it stays compositor-cheap
 * despite the higher element count.
 */
export function TileImage({
  src,
  width,
  height,
  variant,
  range,
  progress,
  className,
}: {
  src: string;
  width: number;
  height: number;
  variant: "disperse" | "assemble";
  range: [number, number];
  progress: MotionValue<number>;
  className?: string;
}) {
  const tileW = width / COLS;
  const tileH = height / ROWS;
  const tiles: { col: number; row: number }[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      tiles.push({ col, row });
    }
  }

  return (
    <div
      aria-hidden
      className={`relative ${className ?? ""}`}
      style={{ width, height }}
    >
      {tiles.map((t) => (
        <Tile
          key={`${t.col}-${t.row}`}
          col={t.col}
          row={t.row}
          tileW={tileW}
          tileH={tileH}
          width={width}
          height={height}
          src={src}
          variant={variant}
          range={range}
          progress={progress}
        />
      ))}
    </div>
  );
}
