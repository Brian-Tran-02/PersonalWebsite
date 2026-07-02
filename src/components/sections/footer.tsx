import { nav, site } from "@/lib/site";
import { GithubLogo, LinkedinLogo, EnvelopeSimple, ArrowUp } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border-hair px-4 pb-10 pt-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <a
              href="#top"
              className="font-display text-lg font-semibold tracking-tight text-fg"
            >
              Brian Tran<span className="text-accent">.</span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              {site.role} based in {site.location}. {site.available}.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-10 w-10 place-items-center rounded-full border border-border-hair text-fg-muted transition-colors hover:text-accent"
              >
                <GithubLogo size={18} weight="fill" />
              </a>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-10 w-10 place-items-center rounded-full border border-border-hair text-fg-muted transition-colors hover:text-accent"
              >
                <LinkedinLogo size={18} weight="fill" />
              </a>
              <a
                href={site.socials.email}
                aria-label="Email"
                className="grid h-10 w-10 place-items-center rounded-full border border-border-hair text-fg-muted transition-colors hover:text-accent"
              >
                <EnvelopeSimple size={18} weight="fill" />
              </a>
            </div>
          </div>

          <div className="flex gap-16">
            <nav className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-faint">
                Navigate
              </p>
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-faint">
                Elsewhere
              </p>
              <a
                href={site.resume}
                download
                className="text-sm text-fg-muted transition-colors hover:text-fg"
              >
                Résumé
              </a>
              <a
                href={site.socials.email}
                className="text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>

        {/* Ghost wordmark */}
        <p
          aria-hidden
          className="pointer-events-none mt-12 select-none font-display text-[clamp(3.5rem,14vw,11rem)] font-bold leading-none tracking-tighter text-fg/[0.04]"
        >
          Brian Tran
        </p>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-border-hair pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-fg-faint">
            © {year} {site.name}. Built with Next.js &amp; Tailwind.
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted transition-colors hover:text-accent"
          >
            Back to top
            <ArrowUp size={13} weight="bold" />
          </a>
        </div>
      </div>
    </footer>
  );
}
