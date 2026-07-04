"use client";

import Image from "next/image";
import { motion, type MotionValue } from "framer-motion";
import type { CSSProperties } from "react";

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
 * Each card is a wrapper motion.div (position + z-index + the static 3D tilt
 * + the shared scroll-linked `opacity`) around an inner Image (the float
 * animation + its own opacity/hover). Splitting them avoids a real
 * conflict: the float keyframes animate `transform: translateY(...)` on
 * whichever element they're applied to, and a CSS animation always wins
 * over any other transform declared on that SAME element — so a
 * perspective/rotateY tilt set alongside animate-float on one element would
 * just get silently overridden every frame. Putting the tilt on the
 * wrapper and the float on the child lets both compose normally.
 *
 * `opacity` is passed in (the same MotionValue hero.tsx uses to fade the
 * rest of Hero) and applied directly on each card's own wrapper — NOT via
 * an outer `<motion.div style={{opacity}}>` wrapping this whole component,
 * which was the previous (broken) approach. Framer Motion adds
 * `will-change: opacity` to elements with an animated opacity, and
 * `will-change` referencing a stacking-context property forces a stacking
 * context regardless of the opacity's actual value — so that one shared
 * wrapper was silently trapping every card's z-index inside its own
 * context, below the robot's z-10 sibling in hero.tsx, no matter what
 * z-index the cards themselves had. That broke both the "always in front"
 * cards and the hover-to-front behavior on the other two. Applying opacity
 * per-card instead means each card is a direct sibling of the robot, so its
 * own z-index competes with the robot's normally.
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
// darkening is a translucent-black overlay, not a CSS `filter` — filters
// are markedly more expensive to composite, especially stacked on an
// element that's already animating every frame via `animate-float`, and
// this was a real, measured perf regression. There's also no `drop-shadow`
// here (unlike `imgClass`) — combined with the perspective/rotateY tilt,
// the shadow filter rendered as a flat, boxy silhouette that didn't match
// the tilted card's shape.
const imgClassFront = "block w-full opacity-100 object-contain";

// The overlay is masked to the SAME source image's own alpha shape —
// these card PNGs have transparent padding around the visible card
// graphic, so a plain full-rectangle overlay darkened that padding too,
// showing up as a visible box behind the card. Masking it to the image
// means it only darkens pixels the image itself actually paints.
function darkOverlayStyle(src: string): CSSProperties {
  return {
    maskImage: `url(${src})`,
    maskSize: "contain",
    maskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskImage: `url(${src})`,
    WebkitMaskSize: "contain",
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
  } as CSSProperties;
}
const darkOverlayClass = "pointer-events-none absolute inset-0 bg-black/25";

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

export function HeroCards({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Behind the robot (rendered after this component in the DOM) — a
          negative z-index keeps it there regardless of stacking order.
          Safe to keep in its own opacity wrapper (unlike the cards below) —
          the sphere never needs to compete above the robot. */}
      <motion.div style={{ opacity }}>
        <Image
          src="/hero-sphere.png"
          alt=""
          width={1536}
          height={1024}
          className="absolute left-3/7 top-4/7 -z-10 h-[820px] w-[820px] max-w-none -translate-x-1/2 -translate-y-[670px] object-contain opacity-90 sm:h-[1400px] sm:w-[1400px]"
        />
      </motion.div>

      <motion.div
        className={`left-[-18%] bottom-[-10%] hidden w-[220px] sm:block lg:w-[440px] ${wrapperClassFront}`}
        style={{ ...tiltLeft, opacity }}
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
          <div
            className={darkOverlayClass}
            style={darkOverlayStyle("/hero-code.png")}
          />
        </div>
      </motion.div>

      <motion.div
        className={`left-[-24%] top-[-5%] w-[190px] sm:w-[230px] lg:w-[450px] ${wrapperClass}`}
        style={{ ...tiltRight, opacity }}
      >
        <Image
          src="/hero-techstack.png"
          alt=""
          width={1448}
          height={1086}
          className={`animate-float-slow ${imgClass}`}
        />
      </motion.div>

      <motion.div
        className={`top-[-10%] right-[-18%] hidden w-[150px] sm:block lg:w-[400px] ${wrapperClassFront}`}
        style={{ ...tiltRightStrong, opacity }}
      >
        <div className="animate-float-slow relative">
          <Image
            src="/hero-experience.png"
            alt=""
            width={1086}
            height={1448}
            className={imgClassFront}
          />
          <div
            className={darkOverlayClass}
            style={darkOverlayStyle("/hero-experience.png")}
          />
        </div>
      </motion.div>

      <motion.div
        className={`bottom-[-25%] right-[-15%] w-[200px] sm:w-[235px] lg:w-[455px] ${wrapperClass}`}
        style={{ ...tiltLeft, opacity }}
      >
        <Image
          src="/hero-focus.png"
          alt=""
          width={1448}
          height={1086}
          className={`animate-float ${imgClass}`}
        />
      </motion.div>
    </div>
  );
}
