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
import { SparkleIcon } from "@phosphor-icons/react/dist/ssr";

// Shared label+heading block builder — icon badge + accent-blue label, a
// two-tone heading (white first line, glowing blue second line), and a
// short accent underline. Originally built one-off for About 1/2's "origin
// story" look (per explicit "make it look like this [reference image]"
// request), now shared with About 2/2 too (per explicit "use the fonts and
// styles from about 1/2" follow-up) so both instances render the identical
// structure/spacing off just their own label + two heading lines.
function titleBlock(label: string, lineWhite: string, lineAccent: string) {
  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent-soft text-accent">
          <SparkleIcon size={18} weight="fill" />
        </span>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          {label}
        </p>
      </div>
      <h2 className="text-[1.8rem] font-bold leading-[1.05] tracking-tight sm:text-[2.4rem]">
        <span className="block text-fg">{lineWhite}</span>
        <span className="text-glow block text-accent">{lineAccent}</span>
      </h2>
      <div className="mt-5 h-1 w-16 rounded-full bg-accent shadow-[0_0_12px_rgba(111,158,255,0.7)]" />
    </>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        {/* Extra scroll distance between Hero and About — gives the
            robot-to-photo tile transition more room to play out, so it
            doesn't feel rushed. Plain empty space (no content of its own),
            so it's outside SectionFocus's blur/dim treatment on purpose.
            Reduced from 50vh to 40vh per explicit "remove 10vh of the
            padding above about 1/2" request. */}
        <div aria-hidden className="h-[40vh]" />
        {/* Baby photo instead of brian-photo.png here — makes the two About
            instances read as a "story" (baby -> adult) per explicit
            request. Native file is 1236x927 (4:3, much wider than
            brian-photo.png's ~1302x1208) — width kept at the original 800
            (matching brian-photo.png's) with height aspect-corrected off
            that instead of the reverse, so the image doesn't bleed further
            right into the narrative column the way a height-matched width
            (987) did. translate-y scaled down proportionally to the
            shorter height (740 -> 600, so -340 -> ~-276) to keep it
            vertically centered instead of poking up into the navbar. */}
        <SectionFocus>
          <About
            showQuickFacts={false}
            titleBlock={titleBlock("About 1/3", "Brian's", "origin story")}
            paragraphs={[
              // Trimmed the old closing sentence ("Soon enough, I found
              // myself going off to university...") when the teenage-years
              // section was inserted after this one — that beat now
              // belongs to the NEW section's own paragraph instead, so the
              // story doesn't jump straight from childhood to university
              // twice.
              "Ever since I was a little kid, I've always been my parents' little tech guy. Whenever they needed help with the TV, computers, phones, I was always there. I was always the one they relied on, and the feeling of chasing more technical knowledge really stuck with me.",
            ]}
            // Pulled back in from the earlier 33% (tuned back when this was
            // a single 2-column About, before the teenage-years section
            // existed between the photo and the text) — per explicit
            // "move about 1/3's text to the left" follow-up, so it sits
            // closer to its own column's left edge/the photo instead of
            // hugging the far right of the page.
            narrativeClassName="lg:pl-[-10%]"
            photoSrc="/brian-baby.png"
            photoWidth={850}
            photoHeight={630}
            photoClassName="translate-y-[-180px] -translate-x-[400px] mx-auto drop-shadow-[0_30px_60px_rgba(10,16,40,0.5)]"
            // Once assembled, explodes back outward and travels down-right
            // (see DISPERSE_RANGE/disperseAfter in about.tsx) as the user
            // keeps scrolling past this section — per explicit "make the
            // baby picture particles explode out like the robot image but
            // then move down and right so it can morph into [the next
            // photo]" request. Down-RIGHT (the default disperseDirection)
            // because the new teenage-years section sits to ITS right, so
            // this is the direction that visually continues toward it.
            // disperseDistance recalibrated per explicit "particles should
            // land around 25% of the screen instead of 50%" request:
            // resting center measured at x=147 in a 1416px-wide viewport
            // (25% = 354), so disperseDistance=207 (354-147) lands the
            // average travel almost exactly there — About 2/3's own
            // dropDistance below is calibrated to match this same landing
            // point, so the hand-off reads as one continuous point.
            disperseAfter
            disperseDistance={207}
          />
        </SectionFocus>
        {/* Breathing room before the middle (teenage-years) instance — same
            h-40 treatment as the other About-to-About gap below. */}
        <div aria-hidden className="h-40" />
        {/* NEW middle About instance — teenage years, inserted between the
            baby and adult photos per explicit request, so the "story" now
            reads baby -> teen -> adult instead of a single jump. Native
            brian-teen.png is 1086x1448 (0.75 aspect, notably taller/
            narrower than the other two photos) — width sized off height at
            that same ratio (760 * 0.75 = 570) rather than the reverse, to
            avoid the same "wrong dimension drives the aspect correction"
            mistake made with the baby photo early on. */}
        <SectionFocus>
          <About
            showQuickFacts={false}
            titleBlock={titleBlock("About 2/3", "Brian's", "teenage years")}
            paragraphs={[
              "By the time I hit high school, that curiosity had turned into something more hands-on. I was building my first websites, taking apart (and rebuilding) my own computer more times than I'd like to admit, and writing my first real lines of code. It wasn't polished, but it was addictive, and it's what eventually led me to study computer science at university.",
            ]}
            // Text starts a fixed 100px to the right of the photo's own
            // right edge, plus another +100px per explicit "text and titles
            // in about 2/3 must move right by 100px" follow-up request.
            narrativeClassName="lg:pl-[300px]"
            photoSrc="/brian-teen.png"
            photoWidth={460}
            photoHeight={600}
            // Per explicit "the image in about 2/3 should start around 30%
            // of the screen" request: 30% of a 1416px-wide viewport is
            // ~425px, landing on this +320px translate.
            photoClassName="translate-y-[-190px] translate-x-[320px] mx-auto drop-shadow-[0_30px_60px_rgba(10,16,40,0.5)]"
            // Per explicit "circle behind teen image must move right by
            // 180px" request — the techno ring is a separate element
            // centered in its own box, not part of the photo's own
            // translated TileImage, so it needs its own explicit offset to
            // stay visually aligned behind the photo above.
            ringOffsetX={180}
            // Recalibrated to match About 1/3's own newly-recalibrated
            // disperseDistance (see its comment) — both target the same
            // landing point (25% of viewport width = 354px in a 1416px-wide
            // viewport) so the hand-off reads as one continuous point, per
            // explicit "particles from the next section will begin from
            // that point" request. This photo's own resting center (at the
            // +320px translate above) is ~661px, right of that target, so
            // dropDirection="left" + dropDistance=205 (average offset
            // 205*1.5=307.5) pulls the arrival start back to ~354.
            dropDirection="left"
            dropDistance={205}
            // Hands off to the adult photo next, which still sits in the
            // RIGHT column (About 3/3 is still `mirrored`) — now that this
            // photo has moved to the LEFT column, the adult photo is to
            // its right, so the disperse travels down-RIGHT (flipped from
            // the old down-left) to keep reading as heading toward it.
            // disperseDistance recalibrated per explicit "particles are
            // shooting too far right, make them go to 55-60% of the screen"
            // feedback: this photo's resting center is ~661px, target
            // 57.5% of 1416 is ~814px, so disperseDistance=153 (814-661)
            // lands the average travel in that range instead of the
            // default 600's ~89%.
            disperseAfter
            disperseDirection="right"
            disperseDistance={153}
            // Per explicit "about 2/3 disappears 2 scrolls too early"
            // feedback (1 scroll = ~100px, an established convention this
            // session) — see the narrativeExitExtend comment on About in
            // about.tsx: extend = delay/0.8 = 200/0.8 = 250.
            narrativeExitExtend={250}
          />
        </SectionFocus>
        {/* Breathing room before the final (adult) instance. */}
        <div aria-hidden className="h-40" />
        {/* Final About instance — the adult brian-photo. Shares the same
            title-block styling per explicit "use the fonts and styles from
            about 1/2" follow-up (originally applied when this was About
            2/2; still applies now that it's 3/3). Keeps its own
            quick-facts row — only the first instance had that (and its
            separator) removed. pr- instead of pl- since `mirrored` puts
            the narrative column on the LEFT here (photo on the right):
            padding on the side FACING the photo is what actually pushes
            the text away from it. */}
        <SectionFocus>
          <About
            mirrored
            titleBlock={titleBlock("About 3/3", "An engineer,", "Built from the ground up.")}
            // This column already sits flush against its own left edge (no
            // pl- applied, and pr- only narrows wrap width rather than
            // shifting the start position) — so nudging it further left
            // per explicit "move about 3/3's text to the left" follow-up
            // needs a negative left margin to push past that natural edge.
            narrativeClassName="lg:pr-[10%] lg:-ml-[5%]"
            // Arrives from up-and-LEFT — re-measured while recalibrating
            // the whole baby->teen->brian-photo chain after the 2/3 photo/
            // text swap. Resting center measured at x=887 in a 1416px-wide
            // viewport (center 708) — RIGHT of center, so pulling the
            // arrival average toward center needs dropDirection="left"
            // (negative offset), same convention as brian-photo's original
            // calibration (see the dropDistance comment on Tile in
            // tile-image.tsx). dropDistance=119 (average offset
            // 119*1.5=178.5) lands the start almost at viewport center.
            dropDirection="left"
            dropDistance={119}
            // Per explicit "circle behind brian-photo must move right by
            // 80px" request — see the ringOffsetX comment on About 2/3
            // above for why the ring needs its own explicit offset.
            ringOffsetX={80}
            // Per explicit "about 3/3 disappears 1 scroll too early"
            // feedback: extend = delay/0.8 = 100/0.8 = 125.
            narrativeExitExtend={125}
          />
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
