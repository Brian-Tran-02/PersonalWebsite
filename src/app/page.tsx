import { Navbar } from "@/components/navbar";
import { SectionFocus } from "@/components/section-focus";
import { HeroAbout } from "@/components/sections/hero-about";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <HeroAbout />
        <TechMarquee />
        <SectionFocus>
          <Projects />
        </SectionFocus>
        <SectionFocus>
          <Experience />
        </SectionFocus>
        <SectionFocus>
          <Skills />
        </SectionFocus>
        <SectionFocus>
          <Contact />
        </SectionFocus>
      </main>
      <Footer />
    </>
  );
}
