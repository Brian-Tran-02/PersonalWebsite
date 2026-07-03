"use client";

import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";

const DEFAULT_COLS = 32;
const DEFAULT_ROWS = 32;

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
  driftFrom,
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
  driftFrom: "left" | "top";
}) {
  const seed = col * 13.37 + row * 7.91;
  const [rangeStart, rangeEnd] = range;
  const span = rangeEnd - rangeStart;
  const start = rangeStart + seeded(seed) * span * 0.5;
  const end = Math.min(rangeEnd, start + span * 0.35 + seeded(seed + 1) * span * 0.2);
  // Always biased toward one edge (not omnidirectional scatter) — tiles
  // travel from/to a consistent direction rather than exploding outward in
  // place. Hero's robot flies left (toward where About's photo sits);
  // About's photo defaults can be overridden to assemble from above instead.
  const driftMain = -(600 + seeded(seed + 2) * 350);
  const driftCross = (seeded(seed + 3) - 0.5) * 140;
  const driftX = driftFrom === "left" ? driftMain : driftCross;
  const driftY = driftFrom === "top" ? driftMain : driftCross;
  const rotate = (seeded(seed + 4) - 0.5) * 60;

  // Framer Motion's scroll-linked transforms can silently switch to a
  // native, browser-accelerated animation when the browser supports
  // ViewTimeline — but that path doesn't reliably HOLD a value once
  // `progress` passes a tile's own `end` (verified empirically: tiles were
  // reappearing at random opacities long after they should've stayed at 0).
  // Rather than depend on "clamp beyond [start, end]" behavior, define the
  // hold segments explicitly across the MotionValue's whole real domain
  // ([0, 1], not just this tile's own sub-window) so there's nothing left
  // to interpolate incorrectly outside [start, end].
  const keyframeInput: number[] = [];
  if (start > 0) keyframeInput.push(0);
  keyframeInput.push(start, end);
  if (end < 1) keyframeInput.push(1);
  const withHolds = (before: number, after: number): number[] => {
    const out: number[] = [];
    if (start > 0) out.push(before);
    out.push(before, after);
    if (end < 1) out.push(after);
    return out;
  };

  // "disperse": assembled (1, no offset) -> flown-off and faded to gone.
  // Fading is tied to the SAME [start, end] window as the fly-off motion, so
  // tiles vanish while still traveling (not fading away in place) — per the
  // caller's own range (e.g. ROBOT_DISPERSE_RANGE in hero.tsx), this
  // completes well before whatever it's supposed to hand off to (About's
  // photo) finishes assembling.
  // "assemble": scattered off-screen (invisible) -> assembled (1, no
  // offset), the mirror, read in the opposite order.
  const opacity = useTransform(
    progress,
    keyframeInput,
    variant === "disperse" ? withHolds(1, 0) : withHolds(0, 1),
  );
  const x = useTransform(
    progress,
    keyframeInput,
    variant === "disperse" ? withHolds(0, driftX) : withHolds(driftX, 0),
  );
  const y = useTransform(
    progress,
    keyframeInput,
    variant === "disperse" ? withHolds(0, driftY) : withHolds(driftY, 0),
  );
  const scale = useTransform(
    progress,
    keyframeInput,
    variant === "disperse" ? withHolds(1, 0.35) : withHolds(0.35, 1),
  );
  const rotateZ = useTransform(
    progress,
    keyframeInput,
    variant === "disperse" ? withHolds(0, rotate) : withHolds(rotate, 0),
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
        suppressHydrationWarning
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
 * - `variant="disperse"`: starts fully assembled, flies apart toward one
 *   edge and fades to gone as `progress` increases (Hero's robot, as Hero
 *   scrolls out of view) — as if it's headed toward where About's photo
 *   will assemble, using its own earlier-finishing range so it's gone well
 *   before that assembly completes, not lingering on screen.
 * - `variant="assemble"`: the mirror — starts scattered off-screen
 *   (invisible), converges into the whole image as `progress` increases
 *   (About's photo, as About scrolls into view) — reading as a continuation
 *   of Hero's tiles arriving, though the two are actually independent
 *   scroll-triggered effects, not one literal shared object.
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
 * 32x32 (the default) reads as fine dust/particles rather than visible
 * chunky tiles. Still transform/opacity only, no filters, so it stays
 * compositor-cheap even at a higher `cols`/`rows` count.
 */
export function TileImage({
  src,
  width,
  height,
  variant,
  range,
  progress,
  className,
  cols = DEFAULT_COLS,
  rows = DEFAULT_ROWS,
  driftFrom = "left",
}: {
  src: string;
  width: number;
  height: number;
  variant: "disperse" | "assemble";
  range: [number, number];
  progress: MotionValue<number>;
  className?: string;
  /** Tile grid density — defaults to 32x32; bump for a finer/denser effect. */
  cols?: number;
  rows?: number;
  /** Which edge tiles travel from/to — "left" (default, Hero's robot) or
   * "top" (About's photo assembles from above instead). */
  driftFrom?: "left" | "top";
}) {
  const tileW = width / cols;
  const tileH = height / rows;
  const tiles: { col: number; row: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
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
          driftFrom={driftFrom}
        />
      ))}
    </div>
  );
}
