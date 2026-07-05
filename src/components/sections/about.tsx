"use client";

import type { ReactNode } from "react";
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
//
// The text used to just stay fully visible for the rest of the scroll once
// it appeared — per explicit "titles and text stay on screen too long,
// declutter and bring more attention to the middle" request, it now also
// disappears again before the section scrolls out, not just appears once.
// [0.2, 0.8] on visibilityProgress below (0% = section's top at the
// viewport's bottom edge, 100% = section's top at the viewport's top edge,
// per the user's own explicit framing) — fully visible by 20% of that
// climb, starts fading back out at 80%, gone by 100%.
const NARRATIVE_VISIBLE_RANGE: [number, number] = [0.2, 0.8];

// About 1/2's baby photo disperses AFTER it finishes assembling, exploding
// outward then travelling down-and-right (see travelDirection on TileImage)
// as the user keeps scrolling past this section toward About 2/2's
// brian-photo — per explicit "make the baby picture particles explode out
// like the robot image but then move down and right so it can morph into
// brian-photo" request. This needs a SECOND, genuinely different progress
// source from ASSEMBLE_RANGE's: that one saturates at 1 once the section's
// top reaches the viewport top and stays there for the rest of the time
// scrolling through/past the section, so it can't drive a "keep scrolling
// after assembly finishes" effect. "end end" -> "end start" tracks the
// section's own EXIT instead (0 when its bottom touches the viewport
// bottom, 1 once its bottom has scrolled all the way past the viewport
// top) — a fresh 0->1 climb that starts right around when the entry
// progress above has already maxed out, since this section is ~one
// viewport tall.
const DISPERSE_RANGE: [number, number] = [0, 0.9];

const defaultParagraphs: ReactNode[] = [
  <>
    I&rsquo;m a full-stack engineer finishing my Honours BSc in Computer
    Science at the University of Ottawa, expected April 2026. I co-founded{" "}
    <span className="font-medium text-fg">Weblume</span>, where client work
    means real deadlines and production-ready code.
  </>,
  <>
    I move across the stack comfortably: React and TypeScript on the front,
    Node and Express on the back, Python and SQL when needed. I care most
    about fast loads, clear states, and interfaces that stay out of the way.
  </>,
  <>
    Coursework that shaped how I think: data structures &amp; algorithms,
    databases, cryptography, AI/ML, operating systems, networking, and
    software engineering.
  </>,
];

export function About({
  mirrored = false,
  showQuickFacts = true,
  label,
  titleBlock,
  heading = "An engineer who ships, not just builds.",
  paragraphs = defaultParagraphs,
  narrativeClassName = "",
  photoSrc = "/brian-photo.png",
  photoWidth = 800,
  photoHeight = 740,
  photoClassName = "translate-y-[-260px] -translate-x-[240px] mx-auto drop-shadow-[0_30px_60px_rgba(10,16,40,0.5)]",
  dropDirection = "right",
  dropDistance = 160,
  disperseAfter = false,
  disperseDirection = "right",
  disperseDistance = 600,
  ringOffsetX = 0,
  narrativeExitExtend = 0,
}: {
  mirrored?: boolean;
  /** Stats/currently/socials row + its top divider — off for the first of
      the two About instances per explicit "remove the quick facts and the
      separation line from the first about section" request; the second
      keeps it, so this is per-instance rather than a global change. */
  showQuickFacts?: boolean;
  /** Small "About 1/2" / "About 2/2" tag directly above the heading, so the
      two instances are distinguishable while comparing layouts — per
      explicit request. Lives inside the narrative column (not above the
      whole grid) so it moves with `mirrored` instead of always sitting on
      the far left. Ignored when `titleBlock` is given. */
  label?: string;
  /** Full custom replacement for the label+heading block (icon, two-tone
      heading, accent underline, etc.) — per explicit "make it look like
      this [reference image]" request, which needed a bespoke icon/color
      treatment the plain `label`+`heading` strings couldn't express. When
      provided, `label` and `heading` are ignored entirely. */
  titleBlock?: ReactNode;
  /** Per-instance heading/body override — the first About instance tells a
      different "origin story" narrative instead of the default professional
      summary, per explicit request. */
  heading?: ReactNode;
  paragraphs?: ReactNode[];
  /** Extra classes on the narrative column — used to add left padding/
      margin so the text sits further right with more white space to its
      left, per explicit request, without affecting the default instance. */
  narrativeClassName?: string;
  /** Per-instance photo override — the first About instance uses a baby
      photo instead of brian-photo.png to read as a "story" (baby -> adult)
      across the two sections, per explicit request. width/height must match
      the source file's own aspect ratio (not force a square/stretch), and
      photoClassName's translate offsets are tuned per-photo since each
      image frames its subject differently within its own canvas. */
  photoSrc?: string;
  photoWidth?: number;
  photoHeight?: number;
  photoClassName?: string;
  /** Which side the assembling photo is biased to fall from — "right" (the
      original default) or "left" (brian-photo in About 2/2, per explicit
      "come from up+left instead of just up" request). See the
      dropDirection comment on Tile in tile-image.tsx. */
  dropDirection?: "left" | "right";
  /** How far that bias reaches (px) — default 60 is a slight nudge;
      brian-photo uses a much larger value per explicit "start from way
      more to the left, almost the middle of the screen" follow-up. See the
      dropDistance comment on Tile in tile-image.tsx. */
  dropDistance?: number;
  /** Once the photo finishes assembling, keep going — explode it back
      outward and travel onward (direction set by disperseDirection, see
      DISPERSE_RANGE above), so it reads as morphing onward toward the next
      photo, per explicit request. */
  disperseAfter?: boolean;
  /** Which way the post-assembly disperse travels — "right" (the
      original default, baby photo heading toward the next section which
      sits to ITS right) or "left" (used when the NEXT section's photo
      sits further left/center instead, so the hand-off still reads as
      travelling toward it). Ignored unless disperseAfter is set. */
  disperseDirection?: "left" | "right";
  /** Average horizontal distance (px) the disperse travel covers — default
      600 preserves the original fixed magnitude. Per explicit "particles
      should land at a specific % of the screen" request: measure the
      viewport-width target percentage's px value, subtract this photo's own
      RESTING CENTER x, and the (signed) result's magnitude is this prop —
      sign picks disperseDirection, magnitude is used here directly (this IS
      the average travel, no *1.5 factor — unlike dropDistance's jittered
      dropDistance-to-2x range, travelDistance's own jitter is centered on
      it). Ignored unless disperseAfter is set. See the travelDistance
      comment on Tile in tile-image.tsx. */
  disperseDistance?: number;
  /** Horizontal offset (px) of the techno ring from the photo box's own
      center — the ring is a separate absolutely-centered element, not part
      of the photo's own translated TileImage, so it doesn't automatically
      follow photoClassName's translate-x. Per explicit "the circle behind
      [photo] must move right by Npx" requests. */
  ringOffsetX?: number;
  /** Extends the narrative's own visibility scroll range past its natural
      "section top reaches viewport top" cap (100%) — per explicit "about
      N/3 disappears N scrolls too early" feedback. Since progress can't
      exceed 1 within the default ["start end", "start start"] range (it
      saturates once the section's top passes the viewport's top), delaying
      the 80%-disappear point requires stretching the range itself: this
      many px is added past "start start" (via a "start -Npx" container
      edge), which pushes the 80% breakpoint later by extend*0.8 px (and,
      as a side effect, the 20%-appear breakpoint later by extend*0.2px —
      untested against explicit feedback since only the disappear timing
      was reported wrong, but small enough to be a reasonable trade-off
      vs. building a fully independent second progress source). To solve
      for a target disappear delay in px: extend = delay / 0.8. */
  narrativeExitExtend?: number;
} = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 158%", "start start"],
  });
  // Dedicated progress source for the narrative's own appear/disappear
  // cycle — deliberately NOT scrollYProgress above (that one's 0/1 map to
  // "158% down" / "top of viewport", a nonstandard range already tuned for
  // the photo's assemble timing). "start end" -> "start start" gives the
  // clean 0% (section's top at the viewport's bottom edge) -> 100%
  // (section's top at the viewport's top edge) climb the user described
  // directly, independent of the photo's own timing.
  const { scrollYProgress: visibilityProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", `start -${narrativeExitExtend}px`],
  });
  // Slides in from further right (80 -> 280 -> 360px) and now also scales up
  // from slightly small (0.85 -> 1) for more visible punch as it arrives,
  // per explicit "come in more dramatically" feedback — on
  // NARRATIVE_VISIBLE_RANGE (see above), not the photo's own much longer
  // ASSEMBLE_RANGE. Now symmetric: slides/shrinks back out and fades again
  // approaching 80%, per explicit "declutter, bring attention to the
  // middle" follow-up request (fade + slide/shrink back out, not just a
  // plain fade) — mirrors the entrance's own x/scale values at the far end
  // instead of holding at the settled (0, 1) ones. Both ends of the array
  // already land on genuine "offscreen" values, so this covers the whole
  // [0, 1] domain itself — no separate explicit-hold padding needed (same
  // anti-accelerated-scroll-timeline reasoning as elsewhere in this file/
  // tile-image.tsx).
  const narrativeX = useTransform(
    visibilityProgress,
    [0, NARRATIVE_VISIBLE_RANGE[0], NARRATIVE_VISIBLE_RANGE[1], 1],
    [360, 0, 0, 360],
  );
  const narrativeOpacity = useTransform(
    visibilityProgress,
    [0, NARRATIVE_VISIBLE_RANGE[0], NARRATIVE_VISIBLE_RANGE[1], 1],
    [0, 1, 1, 0],
  );
  const narrativeScale = useTransform(
    visibilityProgress,
    [0, NARRATIVE_VISIBLE_RANGE[0], NARRATIVE_VISIBLE_RANGE[1], 1],
    [0.85, 1, 1, 0.85],
  );

  // See the DISPERSE_RANGE comment above for why this needs its own
  // useScroll (ASSEMBLE_RANGE's progress saturates at 1 too early to drive
  // a "keep going after assembly" effect). Only About 1/2 passes
  // `disperseAfter`, but the hook itself is cheap and unconditional calls
  // keep the hook count stable across renders (conditionally calling
  // useScroll would violate the rules of hooks).
  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ["end end", "end start"],
  });
  // The assembled photo has to actually disappear once the disperse layer
  // takes over, or it'd sit there fully formed underneath the exploding
  // tiles (they're two separate TileImage instances stacked in the same
  // spot — see the render below). Fades out quickly (by 15% into the exit)
  // right as the disperse tiles' own explosion begins, so the handoff reads
  // as one continuous motion rather than a visible duplicate.
  const assembleFadeOpacity = useTransform(exitProgress, [0, 0.15, 1], [1, 0, 0]);

  // Techno ring behind the photo — per explicit "put a light blue techno
  // ring behind the images... they should only fade in as the particles
  // assemble" request. Tracks the exact same ASSEMBLE_RANGE as the tiles:
  // invisible before assembly starts, fades in alongside it, then holds at
  // its own (deliberately low, "not that drastic") target opacity once
  // assembly finishes — it doesn't fade back out, since the ask was only
  // for a fade-IN tied to assembling. The two equal-value flat segments
  // ([0,0] before start, [0.4,0.4] after end) are the same explicit-hold
  // pattern used everywhere else in this file/tile-image.tsx, not just a
  // stray 2-point range trusting out-of-domain clamping.
  const ringOpacity = useTransform(
    scrollYProgress,
    [0, ASSEMBLE_RANGE[0], ASSEMBLE_RANGE[1], 1],
    [0, 0, 0.4, 0.4],
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="scroll-mt-24 flex min-h-dvh flex-col justify-center px-4 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          {/* Photo — assembles from particles as this section scrolls in.
              `mirrored` (the second About instance on the page) swaps this
              to the right via `order`, not by re-arranging the JSX — same
              DOM/animation logic either way, just a visual reorder. */}
          <div className={`lg:col-span-5 ${mirrored ? "lg:order-2" : ""}`}>
            <Reveal>
              <div className="relative mx-auto" style={{ width: 400, height: 371 }}>
                {/* Techno ring — sits behind the photo (first in DOM,
                    nothing after it has a z-index so paint order alone
                    keeps it back). Kept genuinely light per explicit "not
                    that drastic" direction: a thin low-opacity border plus
                    a soft glow, no fill, no motion. */}
                <motion.div
                  aria-hidden
                  className="absolute top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/50 shadow-[0_0_50px_8px_rgba(111,158,255,0.12)]"
                  style={{ opacity: ringOpacity, left: `calc(50% + ${ringOffsetX}px)` }}
                />
                <div
                  aria-hidden
                  className="absolute inset-x-10 bottom-2 h-10 rounded-full bg-accent/20 blur-2xl"
                />
                <motion.div
                  className="absolute inset-0"
                  style={{ opacity: disperseAfter ? assembleFadeOpacity : 1 }}
                >
                  <TileImage
                    src={photoSrc}
                    width={photoWidth}
                    height={photoHeight}
                    variant="assemble"
                    range={ASSEMBLE_RANGE}
                    progress={scrollYProgress}
                    // 28x28 -> 34x34 per "more particles" feedback, then back
                    // to 30x30 once that (plus Hero's own bump) caused a
                    // reported scroll-lag regression — see the perf history
                    // comment on TileImage in tile-image.tsx.
                    cols={30}
                    rows={30}
                    className={photoClassName}
                    dropDirection={dropDirection}
                    dropDistance={dropDistance}
                  />
                </motion.div>
                {disperseAfter && (
                  <div className="absolute inset-0">
                    <TileImage
                      src={photoSrc}
                      width={photoWidth}
                      height={photoHeight}
                      variant="disperse"
                      travelDirection={disperseDirection}
                      travelDistance={disperseDistance}
                      range={DISPERSE_RANGE}
                      progress={exitProgress}
                      // Coarser than the assemble grid (30x30) — this is an
                      // ADDITIONAL tile instance stacked on top of it, so
                      // full density here would be a real added perf cost
                      // for an effect that's scattering/exploding anyway,
                      // not forming a recognizable image that needs fine
                      // detail. See the perf history comment on TileImage.
                      cols={22}
                      rows={22}
                      className={photoClassName}
                    />
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Narrative — slides + scales in from the right on its own short
              NARRATIVE_RANGE (much snappier than the photo's own long
              assemble), not the one-time IntersectionObserver-triggered
              Reveal used elsewhere. */}
          <div className={`lg:col-span-7 ${mirrored ? "lg:order-1" : ""} ${narrativeClassName}`}>
            <motion.div
              style={{ x: narrativeX, opacity: narrativeOpacity, scale: narrativeScale }}
            >
              {titleBlock ?? (
                <>
                  {label && (
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-faint">
                      {label}
                    </p>
                  )}
                  {/* ~20% smaller than the previous text-4xl/sm:text-5xl, per
                      explicit "reduce heading size" feedback — exact rem
                      values rather than the nearest Tailwind presets so the
                      reduction lands precisely at 20%, not whatever the
                      closest step is. */}
                  <h2 className="text-[1.8rem] font-semibold leading-[1.05] tracking-tight text-fg sm:text-[2.4rem]">
                    {heading}
                  </h2>
                </>
              )}

              <div className="mt-9 space-y-5 text-lg leading-relaxed text-fg-muted">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick facts — stats, currently, socials. Off for the first About
            instance (showQuickFacts={false}), per explicit request. */}
        {showQuickFacts && (
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
        )}
      </div>
    </section>
  );
}
