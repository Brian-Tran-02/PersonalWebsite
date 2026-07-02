import { Reveal } from "./reveal";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-fg-muted backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-5 ${alignment} ${className}`}>
      {eyebrow && (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal>
        <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.08}>
          <p
            className={`max-w-[52ch] text-base leading-relaxed text-fg-muted sm:text-lg ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
