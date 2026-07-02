/**
 * Fixed film grain. No mix-blend-mode — blending a full-screen layer forces the
 * whole viewport to recomposite on scroll. A plain low-opacity overlay is free.
 */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 -z-10 opacity-[0.03] dark:opacity-[0.04]"
    />
  );
}
