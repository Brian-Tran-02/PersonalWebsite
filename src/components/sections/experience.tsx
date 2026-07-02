import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { experience } from "@/lib/site";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 flex min-h-dvh flex-col justify-center px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Where I've done the work." />

        <div className="mt-12">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.05}>
              <div className="grid gap-6 border-t border-border-strong py-10 lg:grid-cols-12 lg:gap-10">
                {/* Meta */}
                <div className="lg:col-span-4">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-fg-faint">
                    {job.period}
                  </p>
                  <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg">
                    {job.company}
                  </p>
                  <p className="mt-1 text-sm text-fg-muted">{job.location}</p>
                  {job.current && (
                    <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Present
                    </span>
                  )}
                </div>

                {/* Detail */}
                <div className="lg:col-span-8">
                  <h3 className="font-display text-lg font-semibold text-fg">
                    {job.role}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">
                    {job.summary}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {job.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-3 text-[15px] leading-relaxed text-fg-muted"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {job.metrics.map((m) => (
                      <span
                        key={m.label}
                        className="inline-flex items-baseline gap-1.5 rounded-2xl border border-border-hair bg-surface px-3.5 py-2"
                      >
                        <span className="font-display text-base font-semibold text-fg">
                          {m.value}
                        </span>
                        <span className="text-xs text-fg-muted">{m.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
