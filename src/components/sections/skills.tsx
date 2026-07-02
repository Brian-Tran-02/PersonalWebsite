import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { stack } from "@/lib/site";

export function Skills() {
  return (
    <section id="stack" className="scroll-mt-24 flex min-h-dvh flex-col justify-center px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Tools I reach for."
          description="Comfortable across the stack — these are what I use most, but I pick up new tools as the problem demands."
        />

        <Reveal delay={0.1} className="mt-14">
          <div className="glass rounded-[2rem] p-1.5">
            <div className="rounded-[1.6rem] px-6 py-2 sm:px-8">
              {stack.map((group) => (
                <div
                  key={group.group}
                  className="grid gap-4 border-b border-border-hair py-7 last:border-b-0 md:grid-cols-12 md:items-center"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-faint md:col-span-3">
                    {group.group}
                  </p>
                  <div className="flex flex-wrap gap-2.5 md:col-span-9">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border-hair bg-surface px-3.5 py-1.5 text-sm text-fg-muted transition-colors duration-300 hover:border-border-strong hover:text-fg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
