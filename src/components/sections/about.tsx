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
// Assembly must finish once About is ~65% scrolled into view while it's
// still rising up from below Hero — "start end" -> "start start" measures
// exactly that entrance (0 = section top just touching the viewport's
// bottom edge, 1 = section top reaching the viewport's top edge), so 0.65
// here means "about 65% of the way through that reveal."
const ASSEMBLE_RANGE: [number, number] = [0, 0.65];

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  // Narrative slides in from the right on the exact same schedule as the
  // photo's assembly (ASSEMBLE_RANGE) so both finish moving at once.
  const narrativeX = useTransform(scrollYProgress, ASSEMBLE_RANGE, [80, 0]);
  const narrativeOpacity = useTransform(scrollYProgress, ASSEMBLE_RANGE, [0, 1]);

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
                  cols={40}
                  rows={40}
                  driftFrom="top"
                  className="translate-y-[-250px] -translate-x-[200px] mx-auto drop-shadow-[0_30px_60px_rgba(10,16,40,0.5)]"
                />
              </div>
            </Reveal>
          </div>

          {/* Narrative — slides in from the right in lockstep with the
              photo's assembly (same ASSEMBLE_RANGE), not the one-time
              IntersectionObserver-triggered Reveal used elsewhere. */}
          <div className="lg:col-span-7">
            <motion.div style={{ x: narrativeX, opacity: narrativeOpacity }}>
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl">
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
