"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import {
  CircleNotch,
  PaperPlaneRight,
  CheckCircle,
  ArrowClockwise,
} from "@phosphor-icons/react";

type Status = "idle" | "loading" | "success" | "error";
type Errors = { name?: string; email?: string; message?: string };

const fieldBase =
  "w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-fg-faint transition-colors duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  function validate(data: { name: string; email: string; message: string }) {
    const next: Errors = {};
    if (!data.name.trim()) next.name = "Please add your name.";
    if (!data.email.trim()) next.email = "Please add your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      next.email = "That email doesn't look right.";
    if (!data.message.trim()) next.message = "Tell me a little about it.";
    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const found = validate(data);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[22rem] flex-col items-center justify-center gap-4 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
          <CheckCircle size={28} weight="fill" />
        </span>
        <div>
          <p className="font-display text-xl font-semibold text-fg">
            Message sent.
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            Thanks for reaching out — I&rsquo;ll get back to you soon.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-fg"
        >
          <ArrowClockwise size={15} weight="bold" />
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-fg">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jordan Mensah"
            className={fieldBase}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-fg">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={fieldBase}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-fg">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="What are you working on?"
          className={`${fieldBase} resize-none`}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="text-xs text-red-500 dark:text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-500 dark:text-red-400">
          Something went wrong sending that. Email me directly at{" "}
          <a href={site.socials.email} className="underline">
            {site.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="group inline-flex items-center justify-center gap-3 self-start rounded-full bg-accent-solid py-2 pl-6 pr-2 text-sm font-semibold text-accent-fg shadow-soft transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lift active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Sending" : "Send message"}
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[2px]">
          {status === "loading" ? (
            <CircleNotch size={16} weight="bold" className="animate-spin" />
          ) : (
            <PaperPlaneRight size={16} weight="bold" />
          )}
        </span>
      </button>
    </form>
  );
}
