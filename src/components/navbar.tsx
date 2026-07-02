"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { nav, site } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Scrollspy: a section becomes active while it crosses a thin band around
  // the middle of the viewport.
  useEffect(() => {
    const els = nav
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = `#${entry.target.id}`;
          if (entry.isIntersecting) {
            setActive(href);
          } else {
            setActive((prev) => (prev === href ? "" : prev));
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent"
      />
      <header className="fixed inset-x-0 top-4 z-40 px-4">
        <nav className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-border-strong bg-surface/80 py-2 pl-5 pr-2 shadow-soft backdrop-blur-md">
          <a
            href="#top"
            className="font-display text-sm font-semibold tracking-tight text-fg"
          >
            Brian Tran<span className="text-accent">.</span>
          </a>

          <div className="hidden items-center gap-0.5 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 ${
                  active === item.href
                    ? "bg-bg-soft text-fg"
                    : "text-fg-muted hover:bg-bg-soft hover:text-fg"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden rounded-full bg-accent-solid px-4 py-2 text-sm font-semibold text-accent-fg shadow-soft transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lift active:scale-[0.98] md:inline-flex"
            >
              Let&rsquo;s talk
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative grid h-9 w-9 place-items-center rounded-full border border-border-strong bg-surface/70 md:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-4 rounded-full bg-fg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "rotate-45" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-4 rounded-full bg-fg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "-rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-30 bg-bg/80 backdrop-blur-2xl md:hidden"
          >
            <div className="flex h-[100dvh] flex-col justify-center gap-2 px-8">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.08 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-display text-4xl font-semibold tracking-tight text-fg"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 + nav.length * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-6 inline-flex w-max rounded-full bg-accent-solid px-6 py-3 text-base font-semibold text-accent-fg"
              >
                {site.email}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
