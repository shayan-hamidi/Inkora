"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const lines = [
  "Browse by style, placement, and mood.",
  "Save what resonates. Build collections later.",
  "Turn a feeling into a concept with AI Studio.",
];

export function LandingScrollStory() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) {
      return;
    }

    let context: { revert: () => void } | undefined;
    let cancelled = false;

    async function setup() {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !sectionRef.current) {
        return;
      }

      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        gsap.fromTo(
          "[data-story-line]",
          { opacity: 0.25, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              end: "bottom 55%",
              scrub: true,
            },
          },
        );
      }, sectionRef);
    }

    void setup();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="surface-paper border-y border-border/60"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-meta">How INKORA helps</p>
        <div className="max-w-3xl space-y-6">
          {lines.map((line) => (
            <p
              key={line}
              data-story-line
              className="font-heading text-3xl leading-tight text-ink sm:text-4xl"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
