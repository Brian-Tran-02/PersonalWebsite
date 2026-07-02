"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import type { ReactNode } from "react";

/**
 * Directs attention to the section nearest the viewport centre: as a section
 * scrolls away it eases into a blur + dim + slight scale-down, and the incoming
 * one sharpens. Driven by motion values (updated off the React render loop);
 * `willChange: filter` keeps the section on its own compositor layer so the
 * blur is applied on the GPU rather than re-rasterized on the main thread.
 */
export function SectionFocus({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // `scrollYProgress` starts at 0 (= fully scrolled away) until the first
  // measurement, which would server-render every section blurred and dimmed.
  // Seed a proxy value in the sharp zone instead, so SSR HTML and the first
  // paint are crisp, and sync it once real scroll measurements arrive.
  const progress = useMotionValue(0.5);
  useMotionValueEvent(scrollYProgress, "change", (v) => progress.set(v));

  const blur = useTransform(progress, [0, 0.32, 0.68, 1], [8, 0, 0, 8]);
  const opacity = useTransform(
    progress,
    [0, 0.32, 0.68, 1],
    [0.36, 1, 1, 0.36],
  );
  const scale = useTransform(
    progress,
    [0, 0.32, 0.68, 1],
    [0.98, 1, 1, 0.98],
  );
  const filter = useMotionTemplate`blur(${blur}px)`;

  if (reduce) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ filter, opacity, scale, willChange: "filter" }}
    >
      {children}
    </motion.div>
  );
}
