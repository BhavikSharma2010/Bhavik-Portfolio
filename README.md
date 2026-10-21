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

## Interactions

- **Now Showing filmstrip** — the four films sit side by side in a
  horizontally scrolling strip. Each card shows the project's real,
  full-width landing capture (kept fresh via `npm run shots:projects`)
  with the film title over it; the cursor tilts the art.
- **Trailer modal** — clicking a card (or "Watch trailer") opens a
  letterboxed mock trailer: the real landing capture plays as Ken Burns
  "footage" between kinetic-typography shots, with tech-stack credits and
  the real links. Focus-trapped, Escape/backdrop close. Trailer copy, like
  everything else, lives in `src/content/portfolio.ts` (`trailer` field).
- **Custom cinema cursor** — dot + trailing focus-ring on fine pointers; it
  grows over links and shows cue labels (`data-cursor="play"` on film
  cards). Off entirely on touch and under `prefers-reduced-motion`.
- **Sound design** — synthesized Web Audio (no files): hover ticks, click
  blips, scene-change whooshes, projector hum in the trailer. Off by default;
  enable with the ♪ toggle in the nav (persisted in localStorage).
- **Easter eggs** — Konami code (↑↑↓↓←→←→BA) toggles a "director's cut"
  grade; double-click the wordmark for a film burn. Gold ※ markers in the
  Origin Story open director's-commentary notes.
- Everything animates on transform/opacity only and respects
  `prefers-reduced-motion` in both CSS and JS.

## ✍️ Swap the content

**Everything on the page — bio, skills, projects, experience, deliverables,
socials — lives in one file: [`src/content/portfolio.ts`](src/content/portfolio.ts).**
Replace the demo data there and the whole site updates. Project `cover` (1–6)
picks the gradient palette used as loading art; a project's `still` field
points at its live-capture image in `public/screenshots/` — re-run
`npm run shots:projects` to refresh those captures from the deployed sites.

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
