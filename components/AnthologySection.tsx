"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";
import Image from "next/image";

const PROJECTS = [
  {
    id: "01",
    title: "VILLA CLIFTON",
    location: "Amalfi Coast, Italy",
    desc: "A monolithic travertine structure suspended between absolute cliffs and endless oceans.",
    img: "/images/projects/villa-01.webp",
    specs: ["Travertine Stone", "1,850 m²", "Infinity Pool", "Helipad"],
  },
  {
    id: "02",
    title: "AUREON TOWER",
    location: "Tokyo, Japan",
    desc: "A high-rise monument in bronze and black obsidian, defying weight and redefining gravity.",
    img: "/images/projects/tower-01.webp",
    specs: ["Bronze Lattice", "45 Floors", "Sky Garden", "Observation Deck"],
  },
  {
    id: "03",
    title: "THE OAK ESTATE",
    location: "St. Moritz, Switzerland",
    desc: "A winter sanctuary of dark oak, raw stone, and architectural bronze set against pristine snows.",
    img: "/images/projects/estate-01.webp",
    specs: ["Smoked Oak", "2,400 m²", "Private Spa", "Art Vault"],
  },
];

export default function AnthologySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const scrollEl = scrollRef.current;
    const triggerEl = triggerRef.current;
    if (!scrollEl || !triggerEl) return;

    // Calculate total horizontal scroll width
    const scrollWidth = scrollEl.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      // Horizontal translate scroll trigger
      gsap.to(scrollEl, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top",
          end: `+=${scrollEl.scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Individual image parallax shifts
      const items = scrollEl.querySelectorAll(".project-image");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { x: "-8%" },
          {
            x: "8%",
            ease: "none",
            scrollTrigger: {
              trigger: item,
              containerAnimation: gsap.getById("horizontal-scroll") as any, // sync with main tween
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }, triggerEl);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} id="anthology" className="relative bg-[var(--background)]">
      <div className="w-full h-screen overflow-hidden flex flex-col justify-between py-12">
        {/* Section Label */}
        <div className="px-8 md:px-24">
          <SectionLabel label="Anthology of Worlds" number="02" />
        </div>

        {/* Horizontal Container */}
        <div className="flex-grow flex items-center relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-20 px-8 md:px-24 py-6 select-none will-change-transform h-[70vh] items-center"
            style={{ width: `${PROJECTS.length * 100}vw` }}
          >
            {PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="w-[85vw] md:w-[65vw] lg:w-[48vw] h-full flex flex-col justify-between group relative flex-shrink-0"
              >
                {/* Image Wrapper */}
                <div className="w-full h-[75%] rounded-3xl overflow-hidden relative shadow-[0_24px_64px_rgba(23,19,15,0.06)] border border-[var(--stone)]/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/40 to-transparent z-[1]" />
                  
                  {/* Floating Number */}
                  <div className="absolute top-6 left-6 font-mono text-sm font-semibold tracking-wider text-[var(--surface)] bg-black/35 px-4 py-2 rounded-full backdrop-blur-xs border border-white/10 z-[2]">
                    {proj.id}
                  </div>

                  {/* Parallax Image */}
                  <div className="relative w-[116%] h-full -left-[8%] project-image will-change-transform">
                    <Image
                      src={proj.img}
                      alt={proj.title}
                      fill
                      className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-aureon)] group-hover:scale-105"
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 65vw, 48vw"
                    />
                  </div>
                </div>

                {/* Specs Info Panel (Reveals on hover) */}
                <div className="flex flex-col gap-2 mt-6">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-[var(--ink)]">
                      {proj.title}
                    </h3>
                    <span className="font-editorial italic text-lg text-[var(--bronze)]">
                      {proj.location}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-[var(--stone)]/20 pt-4 mt-2">
                    <p className="max-w-md text-sm text-[var(--muted-ink)] leading-relaxed">
                      {proj.desc}
                    </p>
                    <div className="hidden md:flex gap-2">
                      {proj.specs.slice(0, 3).map((spec, sidx) => (
                        <span
                          key={sidx}
                          className="text-[9px] font-sans font-medium uppercase tracking-wider text-[var(--muted-ink)] border border-[var(--stone)]/30 rounded-full px-3 py-1 bg-[var(--surface)]/50 backdrop-blur-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="px-8 md:px-24 flex justify-between items-center text-[9px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--muted-ink)]">
          <span>SUMMONED STRUCTURES 01-03</span>
          <span className="animate-pulse">SCROLL VERTICALLY →</span>
        </div>
      </div>
    </div>
  );
}
