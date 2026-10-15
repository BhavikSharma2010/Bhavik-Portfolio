/**
 * ⭐ SINGLE SOURCE OF TRUTH for all site content.
 * Swap the data below for your own — every scene reads from this file.
 * Data sourced from Bhavik Sharma's CV (latest, updated).
 */

export interface Project {
  title: string;
  description: string;
  tags: string[];
  year: string;
  link: string;
  repo?: string;
  /** Which poster palette to use: 1 | 2 | 3 | 4 | 5 | 6 */
  cover: 1 | 2 | 3 | 4 | 5 | 6;
  /** Playful film runtime shown on the poster slate */
  runtime: string;
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
  /** Featured cast: skill name -> short tagline shown on the wide "starring" card. */
  featured?: Record<string, string>;
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
    phone: string;
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

export const portfolio: Portfolio = {
  profile: {
    name: "Bhavik Sharma",
    roles: ["Frontend Developer", "React.js Developer", "Storyteller"],
    tagline:
      "I build clean, easy-to-use web applications with React.js — and I believe a portfolio should prove it, not just say it. So here's my story, shot like a film.",
    location: "Nagpur, India",
    email: "bhaviksharma260@gmail.com",
    phone: "+91 8668607671",
    resumeUrl: "/bhavik-sharma-cv.pdf",
    socials: [
      { label: "GitHub", url: "https://github.com/BhavikSharma2010" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/bhaviksharma260/" },
    ],
  },
  about: {
    heading: "The story behind the screen",
    paragraphs: [
      "I'm Bhavik Sharma — a frontend developer from Nagpur, India, skilled in React.js and modern JavaScript, and currently levelling up my TypeScript. I care about writing clean code and building web apps that are genuinely easy to use.",
      "I'm currently shooting my first production scenes as a Software Developer Intern at AmbuFast, where I build reusable React components for healthcare applications and ship features that real users depend on.",
      "Off set, I'm finishing my Bachelor of Computer Applications at G H Raisoni University (2023–2026), and turning ideas into personal films — voice-controlled tools, management dashboards, and privacy-first apps.",
    ],
    stats: [
      { value: "3", label: "years writing code" },
      { value: "3", label: "films shipped" },
      { value: "1", label: "studio internship" },
      { value: "∞", label: "midnight builds" },
    ],
  },
  skills: [
    {
      name: "Frontend",
      skills: ["React.js", "HTML5", "CSS3", "Tailwind CSS", "Responsive Design"],
      featured: {
        "React.js": "The leading role — component architecture, hooks and performance.",
        "Tailwind CSS": "Design systems at utility-belt speed.",
      },
    },
    {
      name: "Languages",
      skills: ["JavaScript (ES6+)", "TypeScript"],
      featured: {
        "TypeScript": "Types that keep every scene in focus.",
      },
    },
    {
      name: "Backend & Databases",
      skills: ["Node.js", "REST APIs", "MongoDB", "Supabase", "PostgreSQL"],
      featured: {
        "Node.js": "The engine room — servers, APIs and realtime backends.",
      },
    },
    {
      name: "Tools & AI",
      skills: ["Git", "GitHub", "VS Code", "Cursor", "Netlify", "Vercel", "Claude Code", "Generative AI", "Prompt Engineering"],
      featured: {
        "Claude Code": "AI pair-programmer on the call sheet, every single day.",
        "Generative AI": "Directing models to ship real product work.",
      },
    },
  ],
  projects: [
    {
      title: "Prachlit Consulting",
      description:
        "A production website for a Gurgaon technology-consulting firm serving enterprises like Adani ConneX and Times of India — unified communications, cloud, security and energy solutions. Client marquees, a custom admin backend, and every page designed and built end-to-end with Next.js.",
      tags: ["Next.js", "React.js", "Client Project"],
      year: "2026",
      link: "https://www.prachlit.in",
      cover: 5,
      runtime: "6 min",
    },
    {
      title: "Virtual Photo Booth",
      description:
        "A privacy-first photo booth that never saves your pictures — photos live only in your browser. Dynamic 3-photo strips and 4-photo grids with vintage and B&W filters, wrapped in a clean off-white interface.",
      tags: ["React.js", "Tailwind CSS", "react-webcam", "LocalStorage"],
      year: "2026",
      link: "#",
      cover: 1,
      runtime: "4 min",
    },
    {
      title: "Employee Management System",
      description:
        "A management dashboard with role-based access control — administrators assign and monitor employee tasks, with full task-status tracking and responsive interfaces built on Tailwind CSS.",
      tags: ["React.js", "Tailwind CSS", "LocalStorage"],
      year: "2026",
      link: "#",
      cover: 2,
      runtime: "5 min",
    },
    {
      title: "Voice Command Stopwatch",
      description:
        "A stopwatch that listens — hands-free lap control through the Web Speech API, with dark/light themes and MongoDB storing every lap history between sessions.",
      tags: ["JavaScript", "Web Speech API", "Node.js", "MongoDB"],
      year: "2025",
      link: "#",
      cover: 4,
      runtime: "3 min",
    },
  ],
  experience: [
    {
      role: "Software Developer Intern — Hospital Management System",
      company: "AmbuFast, Nagpur",
      period: "Apr 2026 — Present",
      summary:
        "Building the frontend of a hospital management platform with reusable React.js components.",
      highlights: [
        "Developed reusable React.js components, improving overall code maintainability",
        "Built the queue management and laboratory analytics modules",
        "Collaborated with developers to test, debug, and optimize frontend performance",
      ],
    },
    {
      role: "Software Developer Intern — JotFlow",
      company: "AmbuFast, Nagpur",
      period: "Apr 2026 — Present",
      summary:
        "An approval-tracking dashboard that streamlines workflows from submission to sign-off.",
      highlights: [
        "Built the approval-tracking dashboard with ReactJS, Node.js, and PostgreSQL",
        "Integrated the Jotform API to automatically sync user form submissions into the platform",
        "Engineered a real-time tracker managing multi-step approvals from start to completion",
      ],
    },
  ],
  deliverables: [
    { take: "An idea or a rough feature brief", deliver: "Clean, reusable React.js components" },
    { take: "A workflow drowning in manual steps", deliver: "A dashboard that tracks it in real time" },
    { take: "A third-party API to wire in", deliver: "A seamless integration that just works" },
    { take: "Users on every screen size", deliver: "Responsive interfaces with Tailwind CSS" },
    { take: "A frontend that feels slow", deliver: "Tested, debugged, and optimized performance" },
  ],
  contact: {
    heading: "Catch the premiere",
    blurb:
      "Got a project, a role, or just an idea that won't leave you alone? The studio door is open — email me, call the studio, or find me on GitHub and LinkedIn.",
  },
};
