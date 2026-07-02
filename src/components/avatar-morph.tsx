"use client";

import { useRef, type RefObject } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useHeadTilt } from "@/components/hero-avatar";

const COLS = 10;
const ROWS = 10;
const BOX = 460; // square stage size in px; 460 / 10 = 46, an exact tile size

// The dissolve only plays out over the final stretch of the Hero->About
// scroll (not the whole span) — this keeps the tile timing fixed regardless
// of how tall the surrounding text ends up being, and keeps the avatar
// present/unchanged (just tilting) through the bulk of the scroll.
const DISSOLVE_START = 0.62;
const DISSOLVE_SPAN = 1 - DISSOLVE_START;

/** Deterministic pseudo-random in [0, 1) — same value on server and client,
 * so per-tile stagger doesn't cause a hydration mismatch. */
function seeded(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

function Tile({
  col,
  row,
  tile,
  progress,
}: {
  col: number;
  row: number;
  tile: number;
  progress: MotionValue<number>;
}) {
  const seed = col * 13.37 + row * 7.91;
  const start = DISSOLVE_START + seeded(seed) * DISSOLVE_SPAN * 0.5;
  const end = Math.min(
    1,
    start + DISSOLVE_SPAN * 0.35 + seeded(seed + 1) * DISSOLVE_SPAN * 0.2,
  );
  const driftX = (seeded(seed + 2) - 0.5) * 70;
  const driftY = (seeded(seed + 3) - 0.5) * 60 - 35;

  const opacity = useTransform(progress, [start, end], [1, 0]);
  const x = useTransform(progress, [start, end], [0, driftX]);
  const y = useTransform(progress, [start, end], [0, driftY]);
  const scale = useTransform(progress, [start, end], [1, 0.4]);

  // A 1px overlap on every edge hides the hairline seams that otherwise
  // show between adjacent tiles before the dissolve begins.
  const overlap = 1;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: col * tile - overlap,
        top: row * tile - overlap,
        width: tile + overlap * 2,
        height: tile + overlap * 2,
        backgroundImage: "url(/brian-avatar.png)",
        backgroundSize: `${BOX}px ${BOX}px`,
        backgroundPosition: `-${col * tile - overlap}px -${row * tile - overlap}px`,
        opacity,
        x,
        y,
        scale,
      }}
    />
  );
}

/**
 * Lives inside the sticky column that spans Hero+About (see hero-about.tsx).
 * For the first ~62% of scroll through that combined span it's just the
 * plain tilting avatar — identical feel to the standalone mobile avatar,
 * present the whole way through instead of scrolling away with Hero's text.
 * Over the final stretch, a grid of tiles sliced from it disperses with a
 * per-tile random drift, revealing the real photo underneath.
 */
export function AvatarMorph({
  stageRef,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { rotateX, rotateY, shiftX, shiftY, onPointerMove, onPointerLeave } =
    useHeadTilt(tiltRef);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  const photoOpacity = useTransform(
    scrollYProgress,
    [DISSOLVE_START + DISSOLVE_SPAN * 0.25, 0.97],
    [0, 1],
  );

  const tile = BOX / COLS;
  const tiles: { col: number; row: number }[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      tiles.push({ col, row });
    }
  }

  // Reduced motion: no scroll-linked effect at all, just the resolved photo —
  // matching where the effect always ends up, without the motion in between.
  // No `priority`: this whole component is also mounted (CSS-hidden) on
  // mobile, and default lazy-loading is what lets the browser skip it there.
  if (reduce) {
    return (
      <Image
        src="/brian-photo.png"
        alt="Portrait of Brian Tran"
        width={1302}
        height={1208}
        className="mx-auto h-auto w-full max-w-[460px] object-contain"
      />
    );
  }

  return (
    <div
      ref={tiltRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative mx-auto"
      style={{ width: BOX, height: BOX }}
    >
      <div
        aria-hidden
        className="absolute inset-x-10 bottom-2 h-10 rounded-full bg-accent/25 blur-2xl"
      />

      <motion.img
        src="/brian-photo.png"
        alt="Portrait of Brian Tran"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ opacity: photoOpacity }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          rotateX,
          rotateY,
          x: shiftX,
          y: shiftY,
          transformStyle: "preserve-3d",
        }}
      >
        {tiles.map((t) => (
          <Tile
            key={`${t.col}-${t.row}`}
            col={t.col}
            row={t.row}
            tile={tile}
            progress={scrollYProgress}
          />
        ))}
      </motion.div>
    </div>
  );
}
