"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

const emptySubscribe = () => () => {};

/**
 * A segmented light/dark control (not the generic switch). The active segment
 * is highlighted with a soft inset surface; icons cross-fade on selection.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // false during SSR/hydration, true on the client — without the
  // setState-in-effect re-render the old `mounted` flag needed.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  const segment =
    "relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300";

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-border-strong bg-surface/70 p-1 backdrop-blur-sm"
      role="group"
      aria-label="Color theme"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Light theme"
        aria-pressed={mounted ? !isDark : undefined}
        className={`${segment} ${
          mounted && !isDark
            ? "bg-accent-soft text-accent shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]"
            : "text-fg-faint hover:text-fg"
        }`}
      >
        <Sun size={15} weight="bold" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Dark theme"
        aria-pressed={mounted ? isDark : undefined}
        className={`${segment} ${
          mounted && isDark
            ? "bg-accent-soft text-accent"
            : "text-fg-faint hover:text-fg"
        }`}
      >
        <Moon size={15} weight="bold" />
      </button>
    </div>
  );
}
