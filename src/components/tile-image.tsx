"use client";

import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";

// Both real callers (Hero, About) pass their own explicit cols/rows now —
// see the perf note above TileImage below for the actual current counts and
// the history of tuning them against reported scroll jank. This default is
// just a fallback for a hypothetical future caller that doesn't specify one.
const DEFAULT_COLS = 24;
const DEFAULT_ROWS = 24;

// Piecewise-linear interpolation over a small (3-5 point) keyframe array,
// clamped at both ends — the same semantics as Framer Motion's own
// array-form `useTransform`, reimplemented here so 4 of these (x, y, scale,
// rotate) can be combined into ONE motion value (see the `transform` comment
// in Tile below) instead of 4 separate ones.
function interp(times: number[], values: number[], t: number): number {
  const last = times.length - 1;
  if (t <= times[0]) return values[0];
  if (t >= times[last]) return values[last];
  for (let i = 0; i < last; i++) {
    if (t >= times[i] && t <= times[i + 1]) {
      const span = times[i + 1] - times[i];
      const localT = span === 0 ? 0 : (t - times[i]) / span;
      return values[i] + (values[i + 1] - values[i]) * localT;
    }
  }
  return values[last];
}

/** Deterministic pseudo-random in [0, 1) — integer/bitwise arithmetic only
 * (no Math.sin), so it's bit-identical on server and client. Math.sin isn't
 * guaranteed to return the exact same value on every JS engine (Node on the
 * server vs. the browser can differ in the last few bits of precision) —
 * that turned out to be a real, observed hydration mismatch on the
 * equivalent starfield.tsx helper, so this one's built the same way to rule
 * it out here too, even though the tile mismatch this caused was already
 * masked by suppressHydrationWarning below. */
function seeded(n: number) {
  let x = Math.floor(n * 1000) | 0;
  x = Math.imul(x ^ (x >>> 16), 2654435761);
  x = Math.imul(x ^ (x >>> 13), 2246822519);
  x = (x ^ (x >>> 16)) >>> 0;
  return x / 4294967296;
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
  // For "assemble", the per-tile start is biased by row (0 for the top row,
  // ~1 for the bottom) blended with some per-tile jitter, instead of pure
  // per-tile randomness — so upper rows visibly resolve into place before
  // lower ones, reading as the photo assembling top-down rather than all
  // rows arriving in an arbitrary scattered order. "disperse" keeps the
  // original fully-random stagger (robot's own explode-outward look wasn't
  // asked to change).
  const rowFraction = row * tileH / height;
  const staggerFraction =
    variant === "assemble"
      ? rowFraction * 0.7 + seeded(seed) * 0.3
      : seeded(seed);
  // The 0.25 here caps how late the LAST tile can start (a quarter into the
  // range, not half) — tiles begin their transition sooner within whatever
  // range they're given, rather than a chunk of them barely having started
  // by the range's midpoint. The duration fractions (0.55 base + up to 0.2
  // jitter) are deliberately sized so the worst case (max start + max
  // jitter) lands AT rangeEnd (0.25+0.55+0.2 = 1.0) — with the old, smaller
  // fractions (0.35 base) the worst case only ever reached 0.8 of the
  // range no matter how wide the caller's range was, so tiles were always
  // finishing well short of a widened range instead of actually using it.
  const start = rangeStart + staggerFraction * span * 0.25;
  const end = Math.min(rangeEnd, start + span * 0.55 + seeded(seed + 1) * span * 0.2);
  // Explosion moment sits early in the tile's own [start, end] window — an
  // outward radial burst that happens quickly, before the shared drift below
  // takes over for the rest of the travel. Only used by "disperse" now.
  const mid = start + (end - start) * 0.35;

  // "disperse" (Hero's robot): a per-tile radial "explosion" (random angle/
  // distance, giving the initial dispersal a scattered/bursting look) near
  // the start, then a SHARED down-and-left drift every tile picks up
  // afterward (the long trip toward where About's photo sits) — unchanged.
  const explodeAngle = seeded(seed + 2) * Math.PI * 2;
  const explodeRadius = 70 + seeded(seed + 3) * 110;
  const explodeX = Math.cos(explodeAngle) * explodeRadius;
  const explodeY = Math.sin(explodeAngle) * explodeRadius;
  const travelX = -(520 + seeded(seed + 4) * 160);
  const travelY = 420 + seeded(seed + 4) * 140;
  const rotate = (seeded(seed + 5) - 0.5) * 60;

  // "assemble" (About's photo): a straight top-to-bottom fall instead of the
  // old mirrored explode+diagonal-travel — that read as the whole cloud
  // imploding inward from scattered directions rather than clearly "coming
  // from the top" per explicit feedback. Mostly vertical (large negative Y,
  // i.e. starting well above the tile's own resting spot), with a SLIGHT
  // consistent rightward bias on top (not a symmetric per-tile jitter) so
  // tiles arrive travelling down-and-LEFT into place — matching the robot's
  // own down-left travel direction (see travelX/Y above), per explicit
  // "better match the movement curve of the particles from the robot"
  // feedback. Still small relative to dropY (60-120px vs 560-900px) so it
  // reads as "mostly from the top, slightly from the right", not a strong
  // diagonal.
  const dropY = -(560 + seeded(seed + 6) * 340);
  const dropX = 60 + seeded(seed + 7) * 60;
  const dropRotate = (seeded(seed + 5) - 0.5) * 34;

  // Framer Motion's scroll-linked transforms can silently switch to a
  // native, browser-accelerated animation when the browser supports
  // ViewTimeline — but that path doesn't reliably HOLD a value once
  // `progress` passes a tile's own `end` (verified empirically: tiles were
  // reappearing at random opacities long after they should've stayed at 0).
  // Rather than depend on "clamp beyond [start, end]" behavior, define the
  // hold segments explicitly across the MotionValue's whole real domain
  // ([0, 1], not just this tile's own sub-window) so there's nothing left
  // to interpolate incorrectly outside [start, end]. This only produces a
  // flat hold if `coreValues[0]`/`coreValues[last]` are themselves the
  // correct "at rest" values — it works by duplicating them at t=0/t=1, and
  // interpolating between two EQUAL values is what makes that segment flat.
  // (A real bug came from forgetting this: an earlier version of assemble's
  // opacity had a raised first value of 0.5 meant for "while actively
  // falling", not "before it's started" — duplicating THAT at t=0 made
  // every tile visible at 0.5 opacity from the very top of the page, before
  // any scrolling. Fixed below by keeping the core array's own first value
  // at 0 and reaching the raised floor via an early second point instead.)
  function withHolds(coreTimes: number[], coreValues: number[]) {
    const times: number[] = [];
    const values: number[] = [];
    if (coreTimes[0] > 0) {
      times.push(0);
      values.push(coreValues[0]);
    }
    times.push(...coreTimes);
    values.push(...coreValues);
    if (coreTimes[coreTimes.length - 1] < 1) {
      times.push(1);
      values.push(coreValues[coreValues.length - 1]);
    }
    return { times, values };
  }

  // "disperse": assembled (1, no offset) -> explodes outward -> drifts
  // down-left, staying fully visible through that whole motion, and only
  // fades out right at the very end (the last ~8% of the tile's own
  // [start, end] window — pushed later still, from 0.82, per explicit
  // "disappear later" feedback) — fading on the SAME schedule as the travel
  // made tiles vanish mid-flight, before they'd ever visibly arrive
  // anywhere, so it read as "explode then disappear" instead of "explode
  // then travel".
  // "assemble": stays at exactly 0 until its own start (see the withHolds
  // comment above for why this has to be the core array's own first value,
  // not just relied on as a default), then jumps quickly to a raised 0.5
  // floor (by 5% through the window) and on to full opacity (by 20%
  // through), holding at 1 for the rest of the fall/landing — per explicit
  // "increase the opacity of the particles" feedback. The original plain
  // [start,end] -> [0,1] linear ramp meant a tile was still quite
  // translucent for most of its own window (e.g. ~0.5 opacity at its own
  // halfway point), reading as faint dust rather than clearly visible
  // particles.
  const lateFade = start + (end - start) * 0.92;
  const quickRise = start + (end - start) * 0.05;
  const earlyOpaque = start + (end - start) * 0.2;
  const opacityKF =
    variant === "disperse"
      ? withHolds([start, lateFade, end], [1, 1, 0])
      : withHolds([start, quickRise, earlyOpaque, end], [0, 0.5, 1, 1]);
  const xKF =
    variant === "disperse"
      ? withHolds([start, mid, end], [0, explodeX, explodeX + travelX])
      : withHolds([start, end], [dropX, 0]);
  const yKF =
    variant === "disperse"
      ? withHolds([start, mid, end], [0, explodeY, explodeY + travelY])
      : withHolds([start, end], [dropY, 0]);
  const scaleKF = withHolds([start, end], variant === "disperse" ? [1, 0.35] : [0.35, 1]);
  const rotateKF = withHolds(
    [start, end],
    variant === "disperse" ? [0, rotate] : [dropRotate, 0],
  );

  // Each tile used to drive 5 separate motion values (opacity, x, y, scale,
  // rotateZ) — with ~2000+ tiles on screen, that's 10,000+ independent
  // Framer Motion subscriptions all recomputing on every scroll-driven
  // progress update, which is exactly the kind of per-frame cost that causes
  // real, reported symptoms: page scroll (compositor-driven) feels instant
  // while tile positions (main-thread-driven) visibly lag behind by a
  // fraction of a second, and on fast scrolls the main thread falls behind
  // enough that tiles skip straight past their own [start, end] window
  // without ever rendering a mid-state — reading as popping in/out rather
  // than travelling. x/y/scale/rotate are combined into ONE motion value
  // (a pre-built `transform` string, computed with the `interp` helper
  // above) instead of 4 separate ones — same math, but 4 independent
  // MotionValue subscriptions (each with its own bookkeeping, plus Framer's
  // generic per-frame scan across ~17 possible transform keys to build the
  // final CSS string) collapse into 1. Order matches Framer's own default
  // transform composition order (translate, then scale, then rotate) so the
  // visual result is identical to the old separate x/y/scale/rotateZ props.
  const opacity = useTransform(progress, (p) => interp(opacityKF.times, opacityKF.values, p));
  const transform = useTransform(progress, (p) => {
    const tx = interp(xKF.times, xKF.values, p);
    const ty = interp(yKF.times, yKF.values, p);
    const s = interp(scaleKF.times, scaleKF.values, p);
    const r = interp(rotateKF.times, rotateKF.values, p);
    return `translate(${tx}px, ${ty}px) scale(${s}) rotate(${r}deg)`;
  });

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
          transform,
        }}
      />
    </div>
  );
}

/**
 * Shared tile-particle effect, used two ways:
 * - `variant="disperse"`: starts fully assembled, bursts outward per-tile
 *   then drifts down-and-left as a group, fading to gone as `progress`
 *   increases (Hero's robot, as Hero scrolls out of view) — headed toward
 *   where About's photo will assemble, using its own earlier-finishing
 *   range so it's gone well before that assembly completes, not lingering
 *   on screen.
 * - `variant="assemble"`: starts scattered above and falls straight down
 *   (with a slight rightward bias, see dropX in Tile above) into place,
 *   row-by-row from the top down, converging into the whole image as
 *   `progress` increases (About's photo, as About scrolls into view).
 *   Deliberately a plain top-to-bottom fall rather than mirroring disperse's
 *   radial-explode-then-diagonal-travel path — an earlier version did mirror
 *   it, but that read as the cloud imploding inward from scattered
 *   directions rather than clearly "coming from the top" per explicit
 *   feedback.
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
 * 24x24 (the default) reads as fine dust/particles rather than visible
 * chunky tiles. Still transform/opacity only, no filters — but tile count is
 * still the dominant cost (roughly quadratic in cols/rows), so raising
 * `cols`/`rows` for a denser look is a real perf trade-off, not a free one.
 *
 * History, since this has swung back and forth: 32x32/40x40 (Hero/About)
 * caused a reported stutter -> cut to 24x24/28x28 (smooth) -> bumped to
 * 30x30/34x34 per an explicit "more particles" request -> that reintroduced
 * a worse, more specific symptom (page scroll instant, tile positions ~0.5s
 * behind, fast scrolls skipping tiles straight past their own [start, end]
 * without rendering a mid-state). Each tile used to drive 5 independent
 * motion values (opacity, x, y, scale, rotateZ); x/y/scale/rotate are now
 * combined into one pre-built `transform` string (see Tile above), so each
 * tile drives 2, not 5 — roughly 60% fewer per-frame subscriptions at the
 * same tile count. Current counts (26x26/30x30, set at each call site) land
 * below the last known-smooth total (1360) even while being denser than it,
 * once that consolidation is accounted for.
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
}: {
  src: string;
  width: number;
  height: number;
  variant: "disperse" | "assemble";
  range: [number, number];
  progress: MotionValue<number>;
  className?: string;
  /** Tile grid density — defaults to 24x24; bump for a finer/denser effect,
   * but expect a real perf cost (see the note above the component). */
  cols?: number;
  rows?: number;
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
        />
      ))}
    </div>
  );
}
