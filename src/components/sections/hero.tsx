"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { PillButton } from "@/components/pill-button";
import { TileImage } from "@/components/tile-image";
import { HeroCards } from "@/components/hero-cards";
import { site } from "@/lib/site";
import { Code, Lightning, Users } from "@phosphor-icons/react/dist/ssr";

const features = [
  { icon: Code, label: "Clean Code", detail: "Maintainable & Scalable" },
  { icon: Lightning, label: "Performance", detail: "Fast & Optimized" },
  { icon: Users, label: "User Focused", detail: "Intuitive & Accessible" },
];

// How much of Hero's own scroll-past-distance the fade+disperse takes —
// "scroll down slightly" per the brief, not the full section height.
const FADE_RANGE: [number, number] = [0, 0.32];

/**
 * Two-column hero matching the reference image: badge/title/description/
 * CTAs/feature-row on the left, the robot + floating cards on the right.
 * As you scroll past it, everything fades together (one shared opacity
 * transform) while the robot specifically disperses into tile-particles
 * (see tile-image.tsx) rather than just fading flat — About's photo then
 * assembles the same way in reverse as it scrolls into view.
 */
export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, FADE_RANGE, [1, 0]);

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative isolate min-h-dvh overflow-hidden px-4 pb-16 pt-32 sm:pt-36 md:pb-24"
    >
      <motion.div
        style={{ opacity }}
        className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-12"
      >
        {/* Left */}
        <div className="flex flex-col items-start gap-6 lg:col-span-6">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-accent-green/30 bg-accent-green-soft px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent-green">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
              </span>
              {site.available}
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-glow text-[clamp(2.5rem,5.2vw,4rem)] font-semibold leading-[1.05] tracking-tight text-fg">
              Full-Stack Software Developer
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-[46ch] text-lg leading-relaxed text-fg-muted">
              {site.summary}
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex flex-wrap items-center gap-3">
              <PillButton href="#work" icon="arrow-right">
                See my work
              </PillButton>
              <PillButton
                href={site.resume}
                variant="ghost"
                icon="download"
                download
              >
                Résumé
              </PillButton>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-4 rounded-2xl border border-border-strong bg-surface/50 px-5 py-4">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                    <f.icon size={17} weight="bold" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-fg">{f.label}</p>
                    <p className="text-xs text-fg-faint">{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right — robot + floating cards */}
        <div className="relative lg:col-span-6">
          <Reveal delay={0.15}>
            {/* The robot art is portrait (1122x1402 — it includes a
                holographic base beneath the bust), not square, so its box
                keeps that aspect ratio rather than forcing a square that
                would stretch it. */}
            <div className="relative mx-auto" style={{ width: 640, height: 560 }}>
              <HeroCards />
              <TileImage
                src="/brian-robot.png"
                width={430}
                height={537}
                variant="disperse"
                range={FADE_RANGE}
                progress={scrollYProgress}
                className="mx-auto drop-shadow-[0_30px_60px_rgba(10,16,40,0.6)]"
              />
            </div>
          </Reveal>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to the About section"
        style={{ opacity }}
        className="group mx-auto mt-10 hidden w-max flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-faint transition-colors duration-300 group-hover:text-fg-muted">
          Scroll
        </span>
        <span className="h-10 w-px overflow-hidden rounded-full bg-border-strong">
          <span className="block h-full w-full animate-scroll-line bg-accent" />
        </span>
      </motion.a>
    </section>
  );
}
