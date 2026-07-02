/**
 * Page-wide ambient glow. A single fixed layer painted from static radial
 * gradients — no blur filters and no animation, so it costs nothing per frame.
 */
export function AuroraBackground() {
  return <div aria-hidden className="aurora pointer-events-none fixed inset-0 -z-10" />;
}
