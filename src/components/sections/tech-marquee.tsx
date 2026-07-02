import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiPostgresql,
  SiMysql,
  SiDocker,
  SiTailwindcss,
  SiGit,
  SiGo,
} from "react-icons/si";

// `color: null` means "use the current text color" — for brands whose logo is
// black/white (Next.js, Express), so they stay visible in both themes.
type Logo = { name: string; Icon: IconType; color: string | null };

const logos: Logo[] = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: null },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Express", Icon: SiExpress, color: null },
  { name: "Python", Icon: SiPython, color: "#4B8BBE" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "Go", Icon: SiGo, color: "#00ADD8" },
];

export function TechMarquee() {
  return (
    <section
      aria-label="Technologies I work with"
      className="relative border-y border-border-hair bg-surface/40 py-12"
    >
      <p className="px-4 text-center font-mono text-xs uppercase tracking-[0.24em] text-fg-faint">
        Technologies I work with
      </p>

      <div className="mask-fade-x mt-9 overflow-hidden">
        <div className="flex w-max animate-marquee items-start gap-12 pr-12 hover:[animation-play-state:paused] sm:gap-16 sm:pr-16">
          {[...logos, ...logos].map(({ name, Icon, color }, i) => (
            <div
              key={`${name}-${i}`}
              className="flex shrink-0 flex-col items-center gap-3"
            >
              <Icon
                aria-hidden
                className={`h-12 w-12 sm:h-14 sm:w-14 ${
                  color ? "" : "text-fg"
                }`}
                style={color ? { color } : undefined}
              />
              <span className="whitespace-nowrap text-sm font-medium text-fg-muted">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
