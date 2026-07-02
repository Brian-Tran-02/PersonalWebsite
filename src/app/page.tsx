import { Navbar } from "@/components/navbar";
import { SectionFocus } from "@/components/section-focus";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
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
        <Hero />
        <SectionFocus>
          <About />
        </SectionFocus>
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
