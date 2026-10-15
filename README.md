# Bhavik — The Portfolio Album

A Spotify-style storytelling portfolio: your story, projects, experience and
work — played like an album, with a 3D avatar, floating vinyl, background
lo-fi and a persistent player bar whose progress bar is the page scrollbar.

Built with **Next.js 16 · React Three Fiber · drei · Lenis · Framer Motion · Howler**.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## 🧑‍🎤 Swap in your real 3D avatar

1. Create your avatar at [readyplayer.me](https://readyplayer.me) (free — takes
   selfies, customize, download as **.glb**). For animations, rig it with
   [Mixamo](https://mixamo.com) and export GLB with an **Idle** clip.
2. Replace `public/avatar/model.glb` with your file. That's it — no code changes.
   - If your model has an `idle`-named clip it plays automatically; otherwise a
     gentle procedural sway is used.
   - If the file is missing or broken, a stylized placeholder figure keeps the
     scene composed.

## 🎵 Swap the music

Replace `public/audio/lofi.wav` with any audio loop (mp3 works too — update the
path in `src/components/PlayerBar.tsx`). Music never autoplays; visitors press
play. The current placeholder was synthesized by `scripts/generate-lofi.mjs`.

## 🖼️ Hero face artwork

The hero background face is **drawn in code** — a procedural wireframe portrait
in `src/components/hero/HeroFaceArt.tsx` (deterministic SVG, no image assets).
Want your real face there instead? Export an image to
`public/hero/avatar-face.jpg` and swap the `<HeroFaceArt />` inside the
`.faceArt` div in `src/components/sections/Hero.tsx` for
`<img src="/hero/avatar-face.jpg" alt="" />` — the parallax, mask and scanline
treatment apply automatically.

## ✍️ Swap the content

**Everything on the page — bio, skills, projects, experience, deliverables,
socials — lives in one file: [`src/content/portfolio.ts`](src/content/portfolio.ts).**
Replace the demo data there and the whole site updates.

## Structure

```
src/
├── app/            # layout, page, global styles (design tokens in globals.css)
├── content/        # ⭐ portfolio.ts — all site content
├── canvas/         # 3D: Scene (camera choreography), Avatar, Vinyl, Backdrop
├── components/     # PlayerBar, TrackNav, AppLoader, sections/
├── hooks/          # useAudioPlayer, useActiveSection
└── lib/            # scrollStore (shared scroll state), motion tokens
```

## Notes

- Music is autoplay-safe (starts only on user gesture); mute preference persists.
- `prefers-reduced-motion`: smooth scroll and the live canvas are disabled,
  replaced by a static gradient stage.
- The player progress bar doubles as a scroll scrubber — click to seek the page.
