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
 *
 * Each card is a wrapper div (position + z-index + the static 3D tilt) around
 * an inner Image (the float animation + opacity + hover). Splitting them
 * avoids a real conflict: the float keyframes animate `transform:
 * translateY(...)` on whichever element they're applied to, and a CSS
 * animation always wins over any other transform declared on that SAME
 * element — so a perspective/rotateY tilt set alongside animate-float on one
 * element would just get silently overridden every frame. Putting the tilt
 * on the wrapper and the float on the child lets both compose normally.
 *
 * Cards sit at reduced opacity and behind the robot (z-0, vs. the robot's
 * z-10 in hero.tsx) by default. The wrapper carries `pointer-events-auto`
 * (carving an exception out of the root's `pointer-events-none`) and `group`
 * so hovering it brings the card to full opacity and z-20 (above the robot),
 * dropping back the moment the pointer leaves.
 *
 * The code and experience cards are the exception — they stay z-20 (above
 * the robot) permanently, not just on hover, per explicit request.
 *
 * The tilt itself is a perspective + rotateY, not a flat Z-axis rotate —
 * "tilt right" means the right edge recedes (turns away, reads smaller),
 * "tilt left" the opposite, so the cards read as curving around the robot
 * rather than sitting flat and spinning in place.
 */
const wrapperClass = "group pointer-events-auto absolute z-0 hover:z-20";
const wrapperClassFront = "group pointer-events-auto absolute z-20";
const imgClass =
  "block w-full opacity-75 transition-opacity duration-300 ease-out group-hover:opacity-100 object-contain drop-shadow-[0_20px_40px_rgba(10,16,40,0.5)]";
// Code and experience (the always-foreground cards) are fully opaque and a
// touch darker/moodier than the other two, per explicit request. The
// darkening is a plain translucent-black overlay (see `darkOverlay` below),
// not a CSS `filter` — filters are markedly more expensive to composite,
// especially stacked on an element that's already animating every frame via
// `animate-float`, and this was a real, measured perf regression.
const imgClassFront =
  "block w-full opacity-100 object-contain drop-shadow-[0_20px_40px_rgba(10,16,40,0.5)]";
const darkOverlay = "pointer-events-none absolute inset-0 bg-black/10";

// rotateY(+deg) recedes the right edge (smaller/farther) and advances the
// left; rotateY(-deg) is the mirror. (Flipped from an earlier attempt that
// had these backwards per user feedback.)
const tiltRight = { transform: "perspective(1000px) rotateY(24deg)" };
const tiltLeft = { transform: "perspective(1000px) rotateY(-24deg)" };
// Experience sits further around the curve than the other cards, so it
// gets a bit more tilt than the shared tiltRight — part of reading as cards
// arranged in a circle around the robot, not just angled in place. (Dialed
// back from an earlier 42deg that read as too extreme.)
const tiltRightStrong = { transform: "perspective(1000px) rotateY(30deg)" };

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
        className="absolute left-3/7 top-4/7 -z-10 h-[820px] w-[820px] max-w-none -translate-x-1/2 -translate-y-[670px] object-contain opacity-90 sm:h-[1400px] sm:w-[1400px]"
      />

      <div
        className={`left-[-20%] bottom-[-10%] hidden w-[220px] sm:block lg:w-[440px] ${wrapperClassFront}`}
        style={tiltLeft}
      >
        {/* The overlay has to move with the float animation, so it's nested
            inside the same `animate-float` element as the image, not a
            sibling of it — otherwise it'd sit static while the image floats
            underneath it. */}
        <div className="animate-float relative">
          <Image
            src="/hero-code.png"
            alt=""
            width={1448}
            height={1086}
            className={imgClassFront}
          />
          <div className={darkOverlay} />
        </div>
      </div>

      <div
        className={`left-[-24%] top-[-10%] w-[190px] sm:w-[230px] lg:w-[450px] ${wrapperClass}`}
        style={tiltRight}
      >
        <Image
          src="/hero-techstack.png"
          alt=""
          width={1448}
          height={1086}
          className={`animate-float-slow ${imgClass}`}
        />
      </div>

      <div
        className={`top-[-10%] right-[-16%] hidden w-[150px] sm:block lg:w-[400px] ${wrapperClassFront}`}
        style={tiltRightStrong}
      >
        <div className="animate-float-slow relative">
          <Image
            src="/hero-experience.png"
            alt=""
            width={1086}
            height={1448}
            className={imgClassFront}
          />
          <div className={darkOverlay} />
        </div>
      </div>

      <div
        className={`bottom-[-25%] right-[-15%] w-[200px] sm:w-[235px] lg:w-[455px] ${wrapperClass}`}
        style={tiltLeft}
      >
        <Image
          src="/hero-focus.png"
          alt=""
          width={1448}
          height={1086}
          className={`animate-float ${imgClass}`}
        />
      </div>
    </div>
  );
}
