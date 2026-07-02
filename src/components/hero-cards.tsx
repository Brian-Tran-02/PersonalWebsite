import Image from "next/image";

/**
 * The 4 floating cards are real designed assets (dropped in `public/hero-*`)
 * rather than hand-built CSS mockups — positioned around the robot,
 * gently floating via the existing `animate-float`/`animate-float-slow`
 * keyframes. `hero-sphere.png` sits behind everything as an ambient glow —
 * a real alpha-transparent PNG (checked its pixels: alpha 0 at the edges,
 * opaque at the globe/glow core), so it's just a normal overlay, no
 * blend-mode or blur tricks needed (an earlier version of this asset had a
 * baked-in near-black background and needed both — no longer applicable).
 */
export function HeroCards() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Behind the robot (rendered after this component in the DOM) — a
          negative z-index keeps it there regardless of stacking order. */}
      <Image
        src="/hero-sphere.png"
        alt=""
        width={1536}
        height={1024}
        className="absolute left-1/2 top-1/2 -z-10 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-90 sm:h-[1040px] sm:w-[1040px]"
      />

      <Image
        src="/hero-code.png"
        alt=""
        width={1448}
        height={1086}
        className="animate-float absolute left-[2%] top-[6%] hidden w-[220px] object-contain drop-shadow-[0_20px_40px_rgba(10,16,40,0.5)] sm:block lg:w-[240px]"
      />

      <Image
        src="/hero-techstack.png"
        alt=""
        width={1448}
        height={1086}
        className="animate-float-slow absolute right-[0%] top-[10%] w-[190px] object-contain drop-shadow-[0_20px_40px_rgba(10,16,40,0.5)] sm:w-[230px] lg:w-[250px]"
      />

      <Image
        src="/hero-experience.png"
        alt=""
        width={1086}
        height={1448}
        className="animate-float-slow absolute bottom-[4%] left-[0%] hidden w-[150px] object-contain drop-shadow-[0_20px_40px_rgba(10,16,40,0.5)] sm:block lg:w-[175px]"
      />

      <Image
        src="/hero-focus.png"
        alt=""
        width={1448}
        height={1086}
        className="animate-float absolute bottom-[2%] right-[4%] w-[200px] object-contain drop-shadow-[0_20px_40px_rgba(10,16,40,0.5)] sm:w-[235px] lg:w-[255px]"
      />
    </div>
  );
}
