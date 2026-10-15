/**
 * ⭐ SINGLE SOURCE OF TRUTH for all site content.
 * Swap the demo data below for real data — every section,
 * the tracklist, and the player bar read from this file.
 */

export interface Track {
  id: string;
  number: string;
  title: string;
  /** Playful duration shown Spotify-style in the tracklist */
  duration: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  year: string;
  link: string;
  repo?: string;
  /** Which generated cover palette to use: 1 | 2 | 3 */
  cover: 1 | 2 | 3;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
}

export interface SkillGroup {
  name: string;
  skills: string[];
}

export interface Exchange {
  take: string;
  deliver: string;
}

export interface Portfolio {
  profile: {
    name: string;
    roles: string[];
    tagline: string;
    location: string;
    email: string;
    resumeUrl: string;
    socials: { label: string; url: string }[];
  };
  about: {
    heading: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
  };
  skills: SkillGroup[];
  projects: Project[];
  experience: ExperienceItem[];
  /** "What I take" → "What I deliver" working-style pairs */
  deliverables: Exchange[];
  contact: {
    heading: string;
    blurb: string;
  };
}

export const tracks: Track[] = [
  { id: "intro", number: "01", title: "Intro — Press Play", duration: "0:38" },
  { id: "about", number: "02", title: "Liner Notes (About Me)", duration: "3:12" },
  { id: "skills", number: "03", title: "Liked Sounds (Skills)", duration: "2:47" },
  { id: "projects", number: "04", title: "The Albums (Projects)", duration: "8:56" },
  { id: "experience", number: "05", title: "Tour History (Experience)", duration: "5:04" },
  { id: "deliverables", number: "06", title: "In the Studio (What I Do)", duration: "4:21" },
  { id: "contact", number: "07", title: "Encore (Contact)", duration: "∞" },
];

export const portfolio: Portfolio = {
  profile: {
    name: "Bhavik",
    roles: ["Software Developer", "Problem Solver", "Storyteller"],
    tagline:
      "I build web experiences that feel alive — and I believe a portfolio should prove it, not just say it. So here's my story, played like an album.",
    location: "India · Remote-friendly",
    email: "hello@bhavik.dev",
    resumeUrl: "#",
    socials: [
      { label: "GitHub", url: "https://github.com/bhavik" },
      { label: "LinkedIn", url: "https://linkedin.com/in/bhavik" },
      { label: "X / Twitter", url: "https://x.com/bhavik" },
    ],
  },
  about: {
    heading: "The story behind the sound",
    paragraphs: [
      "I'm Bhavik — a software developer who fell into code through curiosity and stayed for the craft. What started with tinkering on small scripts turned into building real products used by real people.",
      "I care about the details most people scroll past: the 200ms transition that makes a button feel expensive, the empty state that makes a user smile, the query that goes from 4 seconds to 40 milliseconds. Good software is felt before it's understood.",
      "Outside the editor you'll find me lost in music, exploring design, and turning random ideas into weekend builds — some of which sneak into the projects below.",
    ],
    stats: [
      { value: "3+", label: "years writing code" },
      { value: "20+", label: "projects shipped" },
      { value: "10k+", label: "lines deleted (proudly)" },
      { value: "∞", label: "lo-fi hours" },
    ],
  },
  skills: [
    {
      name: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Three.js / R3F", "Tailwind", "Framer Motion"],
    },
    {
      name: "Backend",
      skills: ["Node.js", "Express", "REST APIs", "PostgreSQL", "MongoDB", "Prisma"],
    },
    {
      name: "Tools & Craft",
      skills: ["Git", "Docker", "Vercel", "Figma", "CI/CD", "Testing"],
    },
    {
      name: "Currently Spinning",
      skills: ["WebGL shaders", "Rust", "AI integrations"],
    },
  ],
  projects: [
    {
      title: "Wavelength",
      description:
        "A real-time collaborative music queue where friends vote on what plays next. WebSockets, optimistic UI, and a draggable player that syncs across devices.",
      tags: ["Next.js", "WebSockets", "PostgreSQL"],
      year: "2025",
      link: "#",
      repo: "#",
      cover: 1,
    },
    {
      title: "Orbitfolio",
      description:
        "An interactive 3D portfolio engine — orbiting project planets, scroll-driven camera moves, and a CMS-less content file. This site's cousin.",
      tags: ["Three.js", "R3F", "GSAP"],
      year: "2025",
      link: "#",
      repo: "#",
      cover: 2,
    },
    {
      title: "DevDeck",
      description:
        "A command palette for your whole dev life — search repos, issues, docs and snippets from one keystroke. Built with a Rust indexer and a React shell.",
      tags: ["React", "Rust", "Tauri"],
      year: "2024",
      link: "#",
      repo: "#",
      cover: 3,
    },
    {
      title: "Pulseboard",
      description:
        "Analytics that don't feel like a spreadsheet. Real-time dashboards with animated charts, anomaly flags, and a query builder humans can actually use.",
      tags: ["Next.js", "tRPC", "ClickHouse"],
      year: "2024",
      link: "#",
      repo: "#",
      cover: 1,
    },
    {
      title: "Sketchmate",
      description:
        "An infinite collaborative whiteboard with crisper-than-crisp canvas rendering, multiplayer cursors, and export that survives contact with real teams.",
      tags: ["TypeScript", "Canvas API", "CRDTs"],
      year: "2023",
      link: "#",
      repo: "#",
      cover: 2,
    },
    {
      title: "Midnight Notes",
      description:
        "A distraction-free note app with local-first sync, full-text search, and markdown that renders as you type. Your 3am thoughts deserve good tooling.",
      tags: ["React", "IndexedDB", "PWA"],
      year: "2023",
      link: "#",
      repo: "#",
      cover: 3,
    },
  ],
  experience: [
    {
      role: "Software Developer",
      company: "Freelance / Independent",
      period: "2024 — Present",
      summary:
        "Designing and shipping full-stack products for clients end to end — from first wireframe to production monitoring.",
      highlights: [
        "Shipped 6+ client projects across e-commerce, SaaS and content platforms",
        "Cut a client's page load from 6s to 1.2s, lifting conversions measurably",
        "Own the whole stack: architecture, code, deploy, and the 2am pager",
      ],
    },
    {
      role: "Full-Stack Developer Intern",
      company: "A Product Startup",
      period: "2023 — 2024",
      summary:
        "Joined a small product team and learned what 'production' really means — users, deadlines, and code reviews.",
      highlights: [
        "Built and shipped features used by thousands of daily active users",
        "Introduced TypeScript to the frontend codebase, halving runtime type bugs",
        "Wrote the internal component library the team still uses",
      ],
    },
    {
      role: "The Origin Story",
      company: "Self-taught",
      period: "2022 — 2023",
      summary:
        "Docs, courses, broken builds at 1am, and a hundred small projects that taught me how software actually fits together.",
      highlights: [
        "Went from 'what is a div' to deploying full-stack apps",
        "Built a habit: ship something small every single week",
        "Learned to read other people's code — the real superpower",
      ],
    },
  ],
  deliverables: [
    { take: "An idea, a napkin sketch, or just a vibe", deliver: "A scoped plan with real milestones" },
    { take: "Figma files and a feature brief", deliver: "Pixel-faithful, responsive, animated UI" },
    { take: "A legacy codebase everyone fears", deliver: "Refactored, typed, tested — with docs" },
    { take: "An API that needs to scale", deliver: "Typed endpoints, cached queries, clean errors" },
    { take: "A launch date", deliver: "Shipped on time, monitored, and handed over" },
  ],
  contact: {
    heading: "Let's make your favorite track",
    blurb:
      "Got a project, a role, or just an idea that won't leave you alone? My inbox is always on shuffle — skip the line and drop a message.",
  },
};
