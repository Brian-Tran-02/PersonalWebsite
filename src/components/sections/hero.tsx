import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { PillButton } from "@/components/pill-button";
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
 * Text-only content block — the right-column avatar now lives outside this
 * component, shared with About via the merged HeroAbout stage. `mediaSlot`
 * is the mobile-only fallback image, hidden at `lg:` where the stage's own
 * sticky avatar takes over.
 */
export function Hero({ mediaSlot }: { mediaSlot?: ReactNode }) {
  return (
    <div
      id="top"
      className="flex min-h-dvh flex-col items-start justify-center gap-7 lg:col-span-7 lg:row-start-1"
    >
      <Reveal>
        <span className="inline-flex items-center gap-2.5 rounded-full border border-border-strong bg-surface/60 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-fg-muted backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {site.available}
        </span>
      </Reveal>

      {mediaSlot && (
        <Reveal delay={0.08} className="w-full lg:hidden">
          {mediaSlot}
        </Reveal>
      )}

      <Reveal delay={0.05}>
        <p className="font-mono text-sm text-fg-muted">
          {site.name} — {site.role}
        </p>
        <h1 className="mt-3 text-[clamp(2.25rem,4.2vw,2.75rem)] font-semibold leading-[1.05] tracking-tight text-fg">
          I build production
          <br />
          <span className="text-accent">systems, front to back.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="max-w-[46ch] text-lg leading-relaxed text-fg-muted">
          {site.summary}
        </p>
      </Reveal>

      <Reveal delay={0.16}>
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
      </Reveal>

      <Reveal delay={0.2}>
        <p className="text-sm text-fg-muted">
          <span className="text-fg-faint">Currently — </span>
          <span className="font-medium text-fg">
            Co-founder & Full-Stack Dev · Weblume
          </span>
        </p>
      </Reveal>

      <Reveal delay={0.24}>
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

      <Reveal delay={0.3}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2 text-sm text-fg-muted">
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
      </Reveal>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to the About section"
        className="group mt-4 hidden w-max flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-faint transition-colors duration-300 group-hover:text-fg-muted">
          Scroll
        </span>
        <span className="h-10 w-px overflow-hidden rounded-full bg-border-strong">
          <span className="block h-full w-full animate-scroll-line bg-accent" />
        </span>
      </a>
    </div>
  );
}
