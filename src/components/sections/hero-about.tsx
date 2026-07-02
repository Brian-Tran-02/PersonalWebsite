"use client";

import { useRef } from "react";
import Image from "next/image";
import { Hero } from "./hero";
import { About } from "./about";
import { AvatarMorph } from "@/components/avatar-morph";
import { HeroAvatar } from "@/components/hero-avatar";

/**
 * Merges Hero and About into one shared grid so the avatar can feel like a
 * single continuous object: it sits sticky in a column spanning both rows,
 * present the whole way through the Hero->About scroll, dissolving into the
 * real photo near the end (see avatar-morph.tsx). No isolated pinned zone —
 * the scroll distance is just however tall Hero+About's own text is.
 *
 * Below `lg:` this collapses to a plain stacked layout with two simple
 * static images (no sticky, no dissolve) — side-by-side scroll tricks don't
 * apply to a single-column mobile layout anyway.
 */
export function HeroAbout() {
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative isolate overflow-hidden px-4 pb-16 pt-32 sm:pt-36 lg:pb-24">
      <div
        ref={stageRef}
        className="mx-auto grid max-w-6xl lg:grid-cols-12 lg:gap-x-14"
      >
        <Hero mediaSlot={<HeroAvatar />} />
        <About
          mediaSlot={
            <Image
              src="/brian-photo.png"
              alt="Portrait of Brian Tran"
              width={1302}
              height={1208}
              className="mx-auto h-auto w-full max-w-[420px] object-contain"
            />
          }
        />

        {/* Shared sticky avatar/photo column — desktop only.
            `top-[50dvh]`, not `top-1/2`: for a sticky element, a percentage
            `top` resolves against its containing block's height (here, the
            row-span-2 cell spanning ~2 viewport-heights), not the viewport —
            `top-1/2` would park this roughly a full viewport too low. */}
        <div className="relative hidden lg:col-span-5 lg:row-start-1 lg:row-span-2 lg:block">
          <div className="sticky top-[50dvh] -translate-y-1/2">
            <AvatarMorph stageRef={stageRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
