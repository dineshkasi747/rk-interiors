"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";
import ThreeArchitecturalFragment from "./ThreeArchitecturalFragment";

const SPECS = [
  {
    tag: "GEOMETRY",
    title: "Monolithic Precision",
    desc: "Every line is mathematically mapped to respond to sunlight. The structure serves as an emotional lens, concentrating shadows and focusing illumination throughout the day.",
  },
  {
    tag: "CRAFT",
    title: "Travertine & Bronze",
    desc: "Constructed with porous, light-reflective travertine stone from Italian quarries, bound together by patinated bronze plates that age gracefully with wind and mist.",
  },
  {
    tag: "ATMOSPHERE",
    title: "Floating Harmony",
    desc: "Suspended 800 meters above sea level, the villa acts as a cloud-catcher, trapping moving mists within its open-air courtyards to dissolve the boundary between sky and home.",
  },
];

export default function CraftSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftStickyRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const specRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const container = containerRef.current;
    const leftSticky = leftStickyRef.current;
    if (!container || !leftSticky) return;

    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        pin: leftSticky,
        pinSpacing: false,
      });

      // Individual item opacity fades on scroll
      specRefs.current.forEach((el, index) => {
        if (!el) return;

        gsap.fromTo(
          el,
          { opacity: 0.15, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: el,
              start: "top 65%",
              end: "top 35%",
              scrub: true,
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="craft"
      className="relative min-h-[220vh] bg-[var(--surface)] flex flex-col lg:flex-row"
      aria-label="Architectural Craft"
    >
      {/* Sticky Left: 3D Model */}
      <div
        ref={leftStickyRef}
        className="w-full lg:w-[50%] h-[50vh] lg:h-screen sticky top-0 bg-[var(--surface)] border-b lg:border-b-0 lg:border-r border-[var(--stone)]/20 z-[2]"
      >
        <ThreeArchitecturalFragment />
      </div>

      {/* Scrolling Right: Typography Specifications */}
      <div
        ref={rightScrollRef}
        className="w-full lg:w-[50%] flex flex-col px-8 md:px-20 lg:px-24 py-24 md:py-32 justify-center gap-[40vh]"
      >
        <div className="flex-shrink-0">
          <SectionLabel label="Architectural Craft" number="03" />
        </div>

        {SPECS.map((spec, index) => (
          <div
            key={index}
            ref={(el) => {
              specRefs.current[index] = el;
            }}
            className="flex flex-col gap-6 max-w-lg will-change-transform opacity-25"
          >
            <span className="text-section-label text-[var(--bronze)] tracking-[0.25em] font-semibold">
              {spec.tag}
            </span>
            <h3 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-[var(--ink)] leading-none">
              {spec.title}
            </h3>
            <p className="text-base text-[var(--muted-ink)] leading-relaxed mt-2">
              {spec.desc}
            </p>
          </div>
        ))}
        
        {/* Buffer bottom spacing */}
        <div className="h-[20vh]" />
      </div>
    </section>
  );
}
