/* ============================================================
   SITE CONTENT — pulled from Brian Tran's resume.
   Values marked `PLACEHOLDER` need your real links.
   Search this file for "PLACEHOLDER" to fill them in.
   ============================================================ */

export const site = {
  name: "Brian Tran",
  role: "Full-Stack Engineer",
  // Deployed domain — change to your real domain before launch.
  url: "https://briantran.dev", // PLACEHOLDER
  location: "Ottawa, ON",
  email: "briankhoitran02@gmail.com",
  phone: "647-721-0872",
  available: "Open to SWE roles · New grad 2026",
  tagline: "I build production systems, front to back.",
  summary:
    "Full-stack engineer working across React, Node.js, and Python. I ship production systems end to end — web apps, APIs, and cross-platform tools — with an eye for performance and the details that make software feel finished.",
  // Drop your PDF into /public and keep this filename (or update it).
  resume: "/Brian-Tran-Resume.pdf",
  socials: {
    github: "https://github.com/your-handle", // PLACEHOLDER
    linkedin: "https://www.linkedin.com/in/your-handle", // PLACEHOLDER
    email: "mailto:briankhoitran02@gmail.com",
  },
  // Formspree form ID — create a free form at https://formspree.io and paste
  // the ID (the part after formspree.io/f/) here to make the contact form live.
  formspreeId: "PLACEHOLDER", // e.g. "xdorwkgy"
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export type Experience = {
  company: string;
  role: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  metrics: { value: string; label: string }[];
};

export const experience: Experience[] = [
  {
    company: "Weblume",
    role: "Full-Stack Developer & Co-founder",
    location: "Ottawa, ON",
    period: "Jul 2025 — Present",
    current: true,
    summary:
      "Co-founded a web studio building and shipping client sites on React and Node.js.",
    highlights: [
      "Designed and deployed 4+ client websites on React and Node.js, cutting average page load time 35% through lazy loading and image optimization.",
      "Partnered with clients and the sales team to build customer-specific features tied directly to business goals.",
      "Held a 100% reported client-satisfaction record through high-quality delivery and clear communication.",
    ],
    metrics: [
      { value: "4+", label: "client sites shipped" },
      { value: "−35%", label: "avg. page load" },
      { value: "100%", label: "client satisfaction" },
    ],
  },
  {
    company: "Outlier AI",
    role: "Python Code Corrector & AI Model Response Trainer",
    location: "Remote",
    period: "Jun 2024 — Jul 2025",
    summary:
      "Improved model reliability by reviewing code and grading AI-generated responses.",
    highlights: [
      "Reviewed and corrected large volumes of Python code for accuracy and adherence to standards.",
      "Evaluated AI-generated responses and delivered structured feedback that improved model output reliability.",
    ],
    metrics: [
      { value: "1yr+", label: "model training" },
      { value: "Python", label: "code review focus" },
    ],
  },
];

export type Project = {
  title: string;
  slug: string;
  blurb: string;
  period?: string;
  stack: string[];
  highlights: string[];
  metric: { value: string; label: string };
  featured?: boolean;
  // Add a screenshot: drop the file in public/projects/<slug>.png and set
  // image: "/projects/<slug>.png". Leave undefined to show the placeholder.
  image?: string;
  links: { live?: string; github?: string }; // PLACEHOLDER urls below
};

export const projects: Project[] = [
  {
    title: "Auth System with MFA (TOTP)",
    slug: "mfa-auth",
    blurb:
      "A production-ready multi-factor auth service that took simulated brute-force success from 100% to 0%.",
    stack: ["TypeScript", "Node.js", "Speakeasy", "Docker", "CI"],
    highlights: [
      "TOTP + bcrypt hardening dropped simulated brute-force success from 100% to 0%.",
      "TOTP with Speakeasy and QR-code provisioning, shipped via Docker and an automated CI pipeline.",
      "Migrated JavaScript to TypeScript with typed API routes for maintainability and type safety.",
    ],
    metric: { value: "100%→0%", label: "brute-force success" },
    featured: true,
    links: {
      github: "https://github.com/your-handle/mfa-auth", // PLACEHOLDER
      live: undefined,
    },
  },
  {
    title: "Job Application Autofill",
    slug: "autofill-assistant",
    blurb:
      "A Chrome extension that reads a form's DOM and fills repetitive job applications in seconds.",
    stack: ["JavaScript", "Chrome Extension API", "Regex"],
    highlights: [
      "Intelligent field detection via DOM parsing and regex-based input classification across platforms.",
      "Cut application time by roughly 60–80% while keeping a manual-verification step for accuracy.",
    ],
    metric: { value: "60–80%", label: "less time per application" },
    featured: true,
    links: {
      github: "https://github.com/your-handle/autofill-assistant", // PLACEHOLDER
      live: undefined,
    },
  },
  {
    title: "Rentify",
    slug: "rentify",
    blurb:
      "A rental platform connecting renters and lessors, built with a team of four and scored 98/100.",
    stack: ["Java", "Android Studio", "SQL"],
    highlights: [
      "Built front-end features and optimized database interactions for a 20% measured speed gain.",
      "Delivered a polished final product that earned a 98/100 evaluation.",
    ],
    metric: { value: "98/100", label: "final evaluation" },
    links: {
      github: "https://github.com/your-handle/rentify", // PLACEHOLDER
      live: undefined,
    },
  },
  {
    title: "E-Commerce Platform",
    slug: "ecommerce",
    blurb:
      "A full storefront with search, filters, cart management, and feedback — 93% user satisfaction.",
    stack: ["React", "JavaScript", "CSS", "HTML"],
    highlights: [
      "Search, filtering, cart management, and feedback submission in one responsive storefront.",
      "Client-side state management with async data fetching for a snappier experience.",
    ],
    metric: { value: "93%", label: "user satisfaction" },
    links: {
      github: "https://github.com/your-handle/ecommerce", // PLACEHOLDER
      live: undefined,
    },
  },
];

export const stack: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Java", "C", "C++", "Go", "SQL", "Scheme", "Prolog"],
  },
  {
    group: "Frontend",
    items: ["React", "HTML", "CSS", "Bootstrap", "Tailwind"],
  },
  {
    group: "Backend & Data",
    items: ["Node.js", "Express.js", "REST API Design", "JSON", "MySQL", "PostgreSQL"],
  },
  {
    group: "Tooling",
    items: ["Git", "Docker", "CI", "Google Analytics", "Copilot", "Claude"],
  },
];

export const education = {
  school: "University of Ottawa",
  degree: "Honours BSc, Computer Science",
  location: "Ottawa, ON",
  period: "Expected Apr 2026",
  coursework: [
    "Data Structures & Algorithms",
    "Databases",
    "Cryptography",
    "Artificial Intelligence",
    "Machine Learning",
    "Operating Systems",
    "Data Communications & Networking",
    "Software Engineering",
  ],
};
