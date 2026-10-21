import { TopNav } from "@/components/chrome/TopNav";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { Hero } from "@/components/scenes/Hero";
import { Marquee } from "@/components/scenes/Marquee";
import { NowShowing } from "@/components/scenes/NowShowing";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Deliverables } from "@/components/sections/Deliverables";
import { Contact } from "@/components/sections/Contact";

/** Bhavik Studios — one continuous feature presentation. */
export default function Page() {
  return (
    <>
      <ScrollProgress />
      <TopNav />
      <main>
        <Hero />
        <Marquee
          items={["Now Showing", "4 Films", "Showtimes · Daily", "One Night Only", "Rated S — Seriously Serious Code"]}
        />
        <NowShowing />
        <About />
        <Skills />
        <Experience />
        <Marquee
          items={["The Pitch", "You Bring The Idea", "I Bring The Film", "Every Time"]}
          reverse
          gold
        />
        <Deliverables />
        <Contact />
      </main>
    </>
  );
}
