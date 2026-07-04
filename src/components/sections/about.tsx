"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { TileImage } from "@/components/tile-image";
import { site } from "@/lib/site";
import {
  GithubLogo,
  LinkedinLogo,
  EnvelopeSimple,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";

const stats = [
  { value: "4+", label: "sites shipped" },
  { value: "−35%", label: "faster loads" },
  { value: "100%", label: "client satisfaction" },
  { value: "98/100", label: "project score" },
];

/**
 * Regained a 2-column layout — this time the photo is on the LEFT, and it
 * assembles from scattered tile-particles into the whole image as this
 * section scrolls into view (the mirror of Hero's robot dispersing as Hero
 * scrolls out — see tile-image.tsx). Badge and summary line used to live
 * here too (this morning's build); they've moved to Hero, so this section
 * now starts directly with the heading.
 */
// The trigger point (progress 0) is set to "start 158%" rather than "start
// end" — i.e. About's top counts as "arrived" while it's still more than
// half a viewport-height below the visible bottom edge, not only once it's
// actually touching it. That starts the tiles assembling earlier (less dead
// scroll after the robot disperses and before the photo picks up), without
// touching the 50vh gap itself, which stays as its own deliberate breathing
// room. Pushed later still from 150% per explicit "start earlier" feedback —
// but 158% is close to the ceiling here, not an arbitrary round number:
// About's top sits ~1465px down the page (Hero's ~1013px height + the 50vh
// gap), and at a 900px-tall viewport that puts the "start 163%" point at
// page-load scroll (0px). Past ~163% the earliest-seeded tile's own [start,
// end] window would already be underway before the user has scrolled at
// all — a few stray particles rendering at the very top of the page pre-
// scroll. 158% leaves a small buffer under that ceiling.
// Progress 1 ("start start") is unchanged — section top reaching the
// viewport's top edge.
//
// ASSEMBLE_RANGE[0]/[1] used to be 0/0.95 (tiles start right at the offset's
// own progress-0 point, finish just short of progress-1). Per explicit
// "start 4 scrolls later, end 1 scroll earlier" feedback — reading "1
// scroll" as one mouse-wheel notch, ~100px, the standard convention —
// that's a +400px shift to the start and a -100px shift to the finish, in
// absolute scroll terms.
//
// The progress-vs-scrollY relationship this offset produces turned out NOT
// to be simple linear (confirmed by temporarily exposing scrollYProgress
// and sampling it directly at known scrollY values — a naive "targetPoint /
// span" formula was off by a wide margin, especially at low scrollY). These
// two fractions were calibrated from that direct sampling: at a 900px-tall
// viewport, scrollY 400 (the desired new start) measured progress ~0.2525,
// and scrollY ~1292 (desired new finish, 100px before the old ~1392)
// measured ~0.88. Also confirmed separately that "finish" has to be judged
// by the tiles' own transform settling to rest, not by opacity reaching 1 —
// opacity is deliberately front-loaded now (reaches full well before a tile
// finishes falling, see tile-image.tsx), so it reaches 1 far earlier than
// the tile is actually in place.
const ASSEMBLE_RANGE: [number, number] = [0.2525, 0.88];

// The narrative used to animate over this exact same ASSEMBLE_RANGE, in
// lockstep with the photo. But once that range was widened (0.65 -> 0.95)
// per "assemble later" feedback, the narrative's own slide got stretched
// across nearly the whole scroll too — so gradual it barely read as
// motion at all ("isn't really visible... looks boring"). It now animates
// over its own much shorter window instead, so it snaps into place quickly
// and reads as a distinct, dramatic entrance rather than a slow drift.
const NARRATIVE_RANGE: [number, number] = [0, 0.22];

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 158%", "start start"],
  });
  // Slides in from further right (80 -> 280 -> 360px) and now also scales up
  // from slightly small (0.85 -> 1) for more visible punch as it arrives,
  // per explicit "come in more dramatically" feedback — on NARRATIVE_RANGE,
  // not the photo's own much longer ASSEMBLE_RANGE (see above). Explicit
  // hold points at progress 1 — same reason as hero.tsx's opacity fix: a
  // plain 2-point range that stays "past its own end" for most of the
  // remaining scroll (which this now does, being so much shorter than the
  // full reveal) risks the same accelerated-scroll-timeline bug where the
  // value doesn't reliably hold beyond the range.
  const narrativeX = useTransform(scrollYProgress, [0, NARRATIVE_RANGE[1], 1], [360, 0, 0]);
  const narrativeOpacity = useTransform(scrollYProgress, [0, NARRATIVE_RANGE[1], 1], [0, 1, 1]);
  const narrativeScale = useTransform(scrollYProgress, [0, NARRATIVE_RANGE[1], 1], [0.85, 1, 1]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="scroll-mt-24 flex min-h-dvh flex-col justify-center px-4 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          {/* Photo — assembles from particles as this section scrolls in */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative mx-auto" style={{ width: 400, height: 371 }}>
                <div
                  aria-hidden
                  className="absolute inset-x-10 bottom-2 h-10 rounded-full bg-accent/20 blur-2xl"
                />
                <TileImage
                  src="/brian-photo.png"
                  width={800}
                  height={740}
                  variant="assemble"
                  range={ASSEMBLE_RANGE}
                  progress={scrollYProgress}
                  // 28x28 -> 34x34 per "more particles" feedback, then back
                  // to 30x30 once that (plus Hero's own bump) caused a
                  // reported scroll-lag regression — see the perf history
                  // comment on TileImage in tile-image.tsx.
                  cols={30}
                  rows={30}
                  className="translate-y-[-340px] -translate-x-[200px] mx-auto drop-shadow-[0_30px_60px_rgba(10,16,40,0.5)]"
                />
              </div>
            </Reveal>
          </div>

          {/* Narrative — slides + scales in from the right on its own short
              NARRATIVE_RANGE (much snappier than the photo's own long
              assemble), not the one-time IntersectionObserver-triggered
              Reveal used elsewhere. */}
          <div className="lg:col-span-7">
            <motion.div
              style={{ x: narrativeX, opacity: narrativeOpacity, scale: narrativeScale }}
            >
              {/* ~20% smaller than the previous text-4xl/sm:text-5xl, per
                  explicit "reduce heading size" feedback — exact rem values
                  rather than the nearest Tailwind presets so the reduction
                  lands precisely at 20%, not whatever the closest step is. */}
              <h2 className="text-[1.8rem] font-semibold leading-[1.05] tracking-tight text-fg sm:text-[2.4rem]">
                An engineer who ships, not just builds.
              </h2>

              <div className="mt-9 space-y-5 text-lg leading-relaxed text-fg-muted">
                <p>
                  I&rsquo;m a full-stack engineer finishing my Honours BSc in
                  Computer Science at the University of Ottawa, expected
                  April 2026. Most of what I know came from shipping —
                  co-founding{" "}
                  <span className="font-medium text-fg">Weblume</span>, where
                  client work means real deadlines, real users, and code that
                  has to hold up in production.
                </p>
                <p>
                  I move across the stack comfortably: React and TypeScript
                  on the front, Node and Express on the back, Python and SQL
                  when the problem calls for it. What I care about most is
                  the part users actually feel — fast loads, clear states,
                  and interfaces that stay out of the way.
                </p>
                <p>
                  Coursework that shaped how I think about problems: data
                  structures &amp; algorithms, databases, cryptography,
                  artificial intelligence and machine learning, operating
                  systems, networking, and software engineering.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick facts — stats, currently, socials */}
        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-col gap-8 border-t border-border-hair pt-10 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-semibold tracking-tight text-fg">
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-xs text-fg-muted">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm text-fg-muted">
                <span className="text-fg-faint">Currently — </span>
                <span className="font-medium text-fg">
                  Co-founder & Full-Stack Dev · Weblume
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-fg-muted">
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 transition-colors hover:text-fg"
                >
                  <GithubLogo size={18} weight="fill" className="text-fg-faint transition-colors group-hover:text-accent" />
                  GitHub
                </a>
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 transition-colors hover:text-fg"
                >
                  <LinkedinLogo size={18} weight="fill" className="text-fg-faint transition-colors group-hover:text-accent" />
                  LinkedIn
                </a>
                <a
                  href={site.socials.email}
                  className="group inline-flex items-center gap-2 transition-colors hover:text-fg"
                >
                  <EnvelopeSimple size={18} weight="fill" className="text-fg-faint transition-colors group-hover:text-accent" />
                  Email
                </a>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={18} weight="fill" className="text-fg-faint" />
                  {site.location}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
