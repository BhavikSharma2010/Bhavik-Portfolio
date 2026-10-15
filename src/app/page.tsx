import { SceneBackground } from "@/components/SceneBackground";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AppLoader } from "@/components/AppLoader";
import { TrackNav } from "@/components/TrackNav";
import { PlayerBar } from "@/components/PlayerBar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Deliverables } from "@/components/sections/Deliverables";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <SceneBackground />
      <AppLoader />
      <SmoothScroll>
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Deliverables />
          <Contact />
        </main>
      </SmoothScroll>
      <TrackNav />
      <PlayerBar />
    </>
  );
}
