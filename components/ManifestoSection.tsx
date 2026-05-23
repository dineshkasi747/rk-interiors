"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";

export default function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const el = containerRef.current;
    const textEl = textRef.current;
    if (!el || !textEl) return;

    // Split text into words manually
    const text = textEl.textContent || "";
    const words = text.split(" ");
    textEl.innerHTML = words
      .map(
        (word) =>
          `<span class="manifesto-word inline-block mr-[0.25em] opacity-20 scale-[0.95] origin-bottom will-change-transform">${word}</span>`
      )
      .join("");

    const wordSpans = textEl.querySelectorAll(".manifesto-word");

    const ctx = gsap.context(() => {
      // Pin the section and scrub the word-by-word reveal
      gsap.to(wordSpans, {
        opacity: 1,
        scale: 1,
        color: "var(--ink)",
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="manifesto"
      className="relative min-h-screen bg-[var(--surface)] flex flex-col justify-center px-8 md:px-24 py-32 z-10"
      aria-label="Manifesto"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col justify-between h-full">
        {/* Section Label */}
        <SectionLabel label="Our Manifesto" number="01" />

        {/* Manifesto Content */}
        <div className="my-auto max-w-5xl">
          <p
            ref={textRef}
            className="text-manifesto font-display text-[var(--ink)] leading-[1.05] tracking-tight font-medium"
          >
            Some structures are built. Others are summoned. We do not shape spaces to accommodate bodies; we architecture private worlds that capture the soul. Luxury is not an accumulation of expensive details. It is precision made emotional. A space suspended beyond expectation, carved from travertine, light, and silence. For those who have seen everything and still expect to be moved.
          </p>
        </div>

        {/* Decorative Quote */}
        <div className="flex justify-between items-baseline border-t border-[var(--stone)]/30 pt-8 mt-12">
          <div className="font-editorial italic text-2xl text-[var(--bronze)]">
            "Carving silence out of space"
          </div>
          <div className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-[var(--muted-ink)]">
            AUREON — EST. MMXXVI
          </div>
        </div>
      </div>
    </section>
  );
}
