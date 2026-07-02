import { ArrowUpRight, ArrowRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";

type Icon = "arrow" | "arrow-right" | "download" | "none";

type PillButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  icon?: Icon;
  external?: boolean;
  className?: string;
  download?: boolean;
  ariaLabel?: string;
};

const icons = {
  arrow: ArrowUpRight,
  "arrow-right": ArrowRight,
  download: DownloadSimple,
};

/**
 * The "button-in-button": a rounded pill whose trailing icon lives inside its
 * own circular wrapper, with magnetic hover physics driven purely by transform.
 */
export function PillButton({
  href,
  children,
  variant = "primary",
  icon = "arrow",
  external,
  className = "",
  download,
  ariaLabel,
}: PillButtonProps) {
  const IconCmp = icon !== "none" ? icons[icon] : null;

  const base =
    "group inline-flex items-center gap-3 rounded-full text-sm font-semibold transition-[transform,box-shadow,background-color,color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none";
  const pad = IconCmp ? "py-2 pl-6 pr-2" : "px-6 py-3";

  const variants = {
    primary:
      "bg-accent-solid text-accent-fg shadow-soft hover:shadow-lift hover:brightness-[1.06]",
    ghost:
      "bg-surface text-fg ring-1 ring-border-strong hover:bg-surface-2 hover:ring-border-strong shadow-soft",
  };

  const circle =
    variant === "primary"
      ? "bg-white/15"
      : "bg-accent-soft text-accent";

  const inner = (
    <>
      <span>{children}</span>
      {IconCmp && (
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[2px] ${circle}`}
        >
          <IconCmp size={16} weight="bold" />
        </span>
      )}
    </>
  );

  const cls = `${base} ${pad} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        {...(download ? { download: "" } : {})}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type="submit" className={cls} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
