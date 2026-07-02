import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCarousel } from "@/components/project-carousel";

export function Projects() {
  return (
    <section
      id="work"
      className="scroll-mt-24 flex min-h-dvh flex-col justify-center overflow-hidden px-4 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Personal projects"
          description="A few things I've built on my own — where I got to go deep on security, performance, and developer experience."
        />

        <Reveal delay={0.1} className="mt-14">
          <ProjectCarousel />
        </Reveal>
      </div>
    </section>
  );
}
