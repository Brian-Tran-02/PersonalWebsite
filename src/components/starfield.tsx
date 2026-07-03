import type { CSSProperties } from "react";

const STAR_COUNT = 90;

/** Deterministic pseudo-random in [0, 1) — same trick as tile-image.tsx, so
 * star positions are identical on server and client (no hydration mismatch). */
function seeded(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

/**
 * A faint starfield behind Hero's content — dark theme only (stars would
 * just read as stray dots on the light theme's background). Each star is a
 * tiny circle twinkling via the shared `.animate-twinkle` keyframe
 * (globals.css) — opacity/scale only, so it stays cheap even at ~90 elements.
 */
export function Starfield() {
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
    const seed = i * 12.9898 + 1;
    return {
      left: seeded(seed) * 100,
      top: seeded(seed + 1) * 100,
      size: 1 + seeded(seed + 2) * 1.6,
      duration: 2.5 + seeded(seed + 3) * 3.5,
      delay: seeded(seed + 4) * 5,
      maxOpacity: 0.4 + seeded(seed + 5) * 0.55,
    };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-20 hidden overflow-hidden dark:block"
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-white"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              "--twinkle-max": s.maxOpacity,
              "--twinkle-min": s.maxOpacity * 0.15,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
