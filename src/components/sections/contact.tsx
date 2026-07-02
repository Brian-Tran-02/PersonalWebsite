import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { PillButton } from "@/components/pill-button";
import { site } from "@/lib/site";
import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 flex min-h-dvh flex-col justify-center px-4 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Invitation */}
        <div className="lg:col-span-5">
          <Reveal>
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl">
              Let&rsquo;s build something.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-fg-muted">
              I&rsquo;m looking for software engineering roles and open to
              interesting freelance work. Have something in mind? Send a note.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <a
              href={site.socials.email}
              className="mt-8 inline-block font-display text-xl font-semibold tracking-tight text-fg underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent sm:text-2xl"
            >
              {site.email}
            </a>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-11 w-11 place-items-center rounded-full border border-border-strong bg-surface text-fg-muted transition-colors duration-300 hover:text-accent"
              >
                <GithubLogo size={20} weight="fill" />
              </a>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-11 w-11 place-items-center rounded-full border border-border-strong bg-surface text-fg-muted transition-colors duration-300 hover:text-accent"
              >
                <LinkedinLogo size={20} weight="fill" />
              </a>
              <PillButton
                href={site.resume}
                variant="ghost"
                icon="download"
                download
                className="ml-1"
              >
                Résumé
              </PillButton>
            </div>
          </Reveal>
        </div>

        {/* Form card (double-bezel) */}
        <div className="lg:col-span-7">
          <Reveal delay={0.12}>
            <div className="glass rounded-[2rem] p-1.5">
              <div className="rounded-[1.6rem] p-6 sm:p-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
