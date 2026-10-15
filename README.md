# Bhavik Studios 🎬

A cinematic single-page portfolio: software developer Bhavik's story presented
as a feature film — **Now Showing** (projects as movies), **The Origin Story**,
**Cast & Crew** (a scrolling credits roll), **Press Tour**, **The Pitch**, and
**Premiere Night** (contact).

Built with Next.js (App Router) + framer-motion. No Tailwind, no 3D deps —
just design tokens, CSS Modules and scroll-driven animation.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## The intro

On first visit a film-leader countdown (3-2-1, viewfinder, REC) plays over the
hero image at `public/intro/hero-face.jpg` — swap that file to change the face.
It shows **once per browser session** (sessionStorage key
`bhavik-studios-intro-seen`). Delete that key (or open a fresh session) to
replay it. If the image is missing, a typographic title card plays instead.

## ✍️ Swap the content

**Everything on the page — bio, skills, projects, experience, deliverables,
socials — lives in one file: [`src/content/portfolio.ts`](src/content/portfolio.ts).**
Replace the demo data there and the whole site updates. Project `cover` (1–6)
picks a poster palette and `runtime` shows on the film slate.

## Structure

```
src/
├── app/            # layout, page, global styles (design tokens in globals.css)
├── content/        # ⭐ portfolio.ts — all site content
├── components/
│   ├── chrome/     # TopNav (wordmark + REC), ScrollProgress (projector line)
│   ├── scenes/     # Hero, Marquee, NowShowing, PosterRow
│   ├── sections/   # About, Skills (credits roll), Experience, Deliverables, Contact
│   └── hero/       # Magnetic (magnetic buttons)
├── hooks/          # useActiveScene (nav highlight via IntersectionObserver)
└── lib/            # motion.ts (shared framer-motion variants)
```

## Verify

```bash
npm run build            # must be green
node scripts/check-site.mjs    # intro-once, anchors, nav highlight, progress, a11y
node scripts/shoot-page.mjs    # screenshot sweep of every scene (desktop + mobile)
```

Both scripts expect a server on `localhost:3000` (`npm run start`).
