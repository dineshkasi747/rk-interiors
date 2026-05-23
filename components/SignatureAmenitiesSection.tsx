"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";
import Image from "next/image";

const AMENITIES = [
  {
    id: "01",
    tag: "WELLNESS",
    title: "The Basalt Stone Spa",
    desc: "An underground oasis carved entirely from dark vulcanized basalt, hosting mineral pools, floating therapy domes, and treatment rooms aligned with absolute silence.",
    img: "/images/amenities/spa.png",
  },
  {
    id: "02",
    tag: "COLLECTIONS",
    title: "Climate-Controlled Art Vault",
    desc: "A secure, biometric-monitored gallery vault with isolated atmosphere controls to house, display, and preserve irreplaceable high-value canvases and sculptures.",
    img: "/images/amenities/vault.png",
  },
  {
    id: "03",
    tag: "INFINITY",
    title: "Horizon Zero-Edge Pool",
    desc: "A 50-meter cantilevered infinity pool dissolving seamlessly into the sky. Heated with geothermal energy and bordered by light-colored travertine stone decks.",
    img: "/images/amenities/pool.png",
  },
];

export default function SignatureAmenitiesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const curtainRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      AMENITIES.forEach((_, idx) => {
        const card = cardsRef.current[idx];
        const curtain = curtainRefs.current[idx];
        const img = imgRefs.current[idx];

        if (!card || !curtain || !img) return;

        // Timeline for curtain reveal + image parallax scale
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 30%",
            scrub: true,
          },
        });

        // Lift the curtain (reveal image)
        tl.fromTo(
          curtain,
          { yPercent: 0 },
          { yPercent: -100, ease: "none", duration: 1 },
          0
        );

        // Slow down-scale/shift image for parallax
        tl.fromTo(
          img,
          { scale: 1.15, yPercent: -5 },
          { scale: 1.0, yPercent: 5, ease: "none", duration: 1 },
          0
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="amenities"
      className="relative bg-[var(--surface)] px-8 md:px-24 py-32 z-10 border-t border-[var(--stone)]/20"
      aria-label="Signature Amenities"
    >
      <div className="max-w-6xl w-full mx-auto">
        {/* Section Label */}
        <SectionLabel label="Signature Amenities" number="04" />

        {/* Amenities Grid */}
        <div className="flex flex-col gap-32 mt-20">
          {AMENITIES.map((amenity, idx) => (
            <div
              key={amenity.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className={`flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image Curtain Reveal Frame */}
              <div className="w-full lg:w-[50%] h-[400px] md:h-[520px] rounded-3xl overflow-hidden relative border border-[var(--stone)]/20 shadow-[0_24px_48px_rgba(138,106,62,0.05)] bg-[var(--stone)]/10">
                {/* Image Curtain Cover */}
                <div
                  ref={(el) => {
                    curtainRefs.current[idx] = el;
                  }}
                  className="absolute inset-0 bg-[#EDE3D2] z-[2] origin-top will-change-transform"
                />

                {/* Parallax Image */}
                <Image
                  ref={(el: any) => {
                    imgRefs.current[idx] = el;
                  }}
                  src={amenity.img}
                  alt={amenity.title}
                  fill
                  className="object-cover will-change-transform origin-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Specs Text Details */}
              <div className="w-full lg:w-[45%] flex flex-col gap-6">
                <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[var(--bronze)] bg-[var(--stone)]/10 px-4 py-1.5 rounded-full w-fit">
                  {amenity.tag}
                </span>
                <h3 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-[var(--ink)] leading-tight">
                  {amenity.title}
                </h3>
                <p className="text-base text-[var(--muted-ink)] leading-relaxed">
                  {amenity.desc}
                </p>
                <div className="border-t border-[var(--stone)]/20 pt-6 mt-4 flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-sans tracking-widest text-[var(--muted-ink)] uppercase">
                      Access
                    </span>
                    <span className="font-editorial italic text-base text-[var(--ink)] font-semibold mt-1">
                      Private Reservation
                    </span>
                  </div>
                  <div className="w-[1px] h-8 bg-[var(--stone)]/20" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-sans tracking-widest text-[var(--muted-ink)] uppercase">
                      Availability
                    </span>
                    <span className="font-editorial italic text-base text-[var(--ink)] font-semibold mt-1">
                      24/7 Concierge
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
