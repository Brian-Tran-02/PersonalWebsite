"use client";

import { useRef, type RefObject } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Whole-head cursor tilt — not eye-only, since the source art is a single
 * flat illustration with no separate pupil layer. Springs ease the tilt back
 * to neutral once the pointer leaves. Shared by the standalone mobile avatar
 * below and by AvatarMorph's pre-dissolve state on desktop.
 */
export function useHeadTilt(ref: RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 14, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-1, 1], [-14, 14]), spring);
  const rotateX = useSpring(useTransform(py, [-1, 1], [10, -10]), spring);
  const shiftX = useSpring(useTransform(px, [-1, 1], [-8, 8]), spring);
  const shiftY = useSpring(useTransform(py, [-1, 1], [-6, 6]), spring);

  function onPointerMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    px.set(Math.max(-1, Math.min(1, x * 2)));
    py.set(Math.max(-1, Math.min(1, y * 2)));
  }

  function onPointerLeave() {
    px.set(0);
    py.set(0);
  }

  return {
    reduce,
    rotateX,
    rotateY,
    shiftX,
    shiftY,
    onPointerMove: reduce ? undefined : onPointerMove,
    onPointerLeave: reduce ? undefined : onPointerLeave,
  };
}

/** Standalone floating avatar — used on mobile, where the merged sticky/
 * dissolve stage is skipped entirely in favor of two simple static images. */
export function HeroAvatar() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduce, rotateX, rotateY, shiftX, shiftY, onPointerMove, onPointerLeave } =
    useHeadTilt(ref);

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative mx-auto w-full max-w-[420px]"
      style={{ perspective: 900 }}
    >
      <div
        aria-hidden
        className="absolute inset-x-10 bottom-2 h-10 rounded-full bg-accent/25 blur-2xl"
      />
      <motion.div
        className="animate-float-slow"
        style={
          reduce
            ? undefined
            : { rotateX, rotateY, x: shiftX, y: shiftY, transformStyle: "preserve-3d" }
        }
      >
        <Image
          src="/brian-avatar.png"
          alt="Illustrated avatar of Brian Tran"
          width={1254}
          height={1254}
          // No `priority`: this component is also mounted (CSS-hidden) on
          // desktop as the mobile fallback slot, and default lazy-loading is
          // what lets the browser skip fetching it there. On mobile, where
          // it's genuinely visible on load, lazy images already in the
          // viewport are still fetched promptly.
          className="h-auto w-full select-none drop-shadow-[0_30px_50px_rgba(20,30,60,0.35)]"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}
