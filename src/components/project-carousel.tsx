"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { projects, type Project } from "@/lib/site";
import {
  CaretLeft,
  CaretRight,
  GithubLogo,
  ArrowSquareOut,
  ImageSquare,
  Fingerprint,
  Lightning,
  Buildings,
  Storefront,
  type Icon,
} from "@phosphor-icons/react";

/* Designed cover art for projects without a screenshot yet — an accent-lit
   field with the project's motif, so nothing on the page reads as unfinished. */
const coverIcons: Record<string, Icon> = {
  "mfa-auth": Fingerprint,
  "autofill-assistant": Lightning,
  rentify: Buildings,
  ecommerce: Storefront,
};

function ProjectCover({ project }: { project: Project }) {
  const CoverIcon = coverIcons[project.slug] ?? ImageSquare;
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(130%_130%_at_50%_-10%,var(--accent-soft),transparent_72%)]">
      <CoverIcon
        aria-hidden
        size={150}
        weight="duotone"
        className="absolute -bottom-8 -right-5 text-accent opacity-[0.09]"
      />
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-border-strong bg-surface/70 text-accent shadow-soft">
        <CoverIcon size={26} weight="duotone" />
      </span>
      <span className="absolute left-4 top-4 font-mono text-[10px] tracking-wide text-fg-faint">
        ~/projects/{project.slug}
      </span>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="glass lift flex h-[450px] w-full flex-col overflow-hidden rounded-[1.75rem]">
      {/* Media / cover art */}
      <div className="relative h-[195px] w-full shrink-0 border-b border-border-hair">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="400px"
            className="object-cover"
          />
        ) : (
          <ProjectCover project={project} />
        )}

        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-bg/75 px-3 py-1.5">
          <span className="font-display text-sm font-semibold text-accent">
            {project.metric.value}
          </span>
          <span className="text-[11px] text-fg-muted">
            {project.metric.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-1 font-display text-lg font-semibold tracking-tight text-fg">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">
          {project.blurb}
        </p>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border-hair bg-surface/50 px-2 py-0.5 font-mono text-[10px] text-fg-muted"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-5 border-t border-border-hair pt-4 text-sm">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-fg-muted transition-colors hover:text-accent"
              >
                <GithubLogo size={16} weight="fill" />
                Code
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-fg-muted transition-colors hover:text-accent"
              >
                <ArrowSquareOut size={16} weight="bold" />
                Live
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

const arrowClass =
  "absolute top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border-strong bg-surface/90 text-fg shadow-soft transition-[color,transform] duration-300 hover:text-accent active:scale-95";

export function ProjectCarousel() {
  const n = projects.length;
  const [[active, dir], setActive] = useState<[number, number]>([0, 0]);

  const go = (d: number) => setActive(([a]) => [(a + d + n) % n, d]);
  const prev = (active - 1 + n) % n;
  const next = (active + 1) % n;

  return (
    <div>
      <div className="relative">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className={`${arrowClass} left-1 md:left-0`}
        >
          <CaretLeft size={18} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className={`${arrowClass} right-1 md:right-0`}
        >
          <CaretRight size={18} weight="bold" />
        </button>

        <div className="flex items-center justify-center gap-6 md:px-14">
          {/* Left peek */}
          <div
            inert
            className="hidden w-[290px] shrink-0 scale-[0.88] opacity-40 transition-all duration-500 md:block"
          >
            <ProjectCard project={projects[prev]} />
          </div>

          {/* Main card */}
          <div className="w-[80vw] max-w-[380px] shrink-0">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: dir >= 0 ? 56 : -56, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={projects[active]} />
            </motion.div>
          </div>

          {/* Right peek */}
          <div
            inert
            className="hidden w-[290px] shrink-0 scale-[0.88] opacity-40 transition-all duration-500 md:block"
          >
            <ProjectCard project={projects[next]} />
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-8 flex items-center justify-center gap-2.5">
        {projects.map((p, i) => (
          <button
            key={p.title}
            type="button"
            onClick={() => setActive(([a]) => [i, i >= a ? 1 : -1])}
            aria-label={`Go to ${p.title}`}
            aria-current={i === active}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 bg-accent"
                : "w-2 bg-fg-faint/40 hover:bg-fg-faint"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
