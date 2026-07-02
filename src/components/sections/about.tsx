import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

/**
 * Text-only content block — the right-column photo now lives outside this
 * component, shared with Hero via the merged HeroAbout stage. `mediaSlot` is
 * the mobile-only fallback image, hidden at `lg:` where the stage's own
 * sticky avatar (already dissolved into the photo by this point) takes over.
 */
export function About({ mediaSlot }: { mediaSlot?: ReactNode }) {
  return (
    <div
      id="about"
      className="scroll-mt-24 flex min-h-dvh flex-col justify-center gap-9 lg:col-span-7 lg:row-start-2"
    >
      <Reveal>
        <h2 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl">
          An engineer who ships, not just builds.
        </h2>
      </Reveal>

      {mediaSlot && (
        <Reveal delay={0.1} className="w-full lg:hidden">
          {mediaSlot}
        </Reveal>
      )}

      <Reveal delay={0.08}>
        <div className="space-y-5 text-lg leading-relaxed text-fg-muted">
          <p>
            I&rsquo;m a full-stack engineer finishing my Honours BSc in
            Computer Science at the University of Ottawa, expected April 2026.
            Most of what I know came from shipping — co-founding{" "}
            <span className="font-medium text-fg">Weblume</span>, where client
            work means real deadlines, real users, and code that has to hold
            up in production.
          </p>
          <p>
            I move across the stack comfortably: React and TypeScript on the
            front, Node and Express on the back, Python and SQL when the
            problem calls for it. What I care about most is the part users
            actually feel — fast loads, clear states, and interfaces that stay
            out of the way.
          </p>
          <p>
            Coursework that shaped how I think about problems: data structures
            &amp; algorithms, databases, cryptography, artificial intelligence
            and machine learning, operating systems, networking, and software
            engineering.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
