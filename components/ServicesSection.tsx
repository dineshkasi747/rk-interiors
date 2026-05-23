"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";
import Image from "next/image";

const SERVICES = [
  {
    id: "01",
    tag: "ACQUISITION",
    title: "Bespoke Acquisition",
    desc: "Acquire an engineered private world. Our acquisitions team handles private contracting, customized land selections, and custom drafting tailored to your exact specifications.",
    img: "/images/services/buy.png",
  },
  {
    id: "02",
    tag: "LEASING",
    title: "Seasonal Retreats",
    desc: "Experience impossible structures temporarily. Secure lease privileges for select seasonal estates in our world-wide portfolio, fully staffed with dedicated services.",
    img: "/images/services/rent.png",
  },
  {
    id: "03",
    tag: "MANAGEMENT",
    title: "Private Portfolio",
    desc: "Maintain asset excellence. From geostatic structural health checks to fine art collection humidity maintenance, we preserve the value of your private world in perpetuity.",
    img: "/images/services/sell.png",
  },
];

export default function ServicesSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="relative min-h-screen bg-[var(--background)] flex flex-col justify-between py-24 select-none z-10 border-t border-[var(--stone)]/20"
      aria-label="Core Services"
    >
      {/* Section Header */}
      <div className="px-8 md:px-24">
        <SectionLabel label="Exclusive Services" number="05" />
        <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--ink)] tracking-tight mt-6">
          Architectural stewardship <br />
          <span className="font-editorial italic font-normal text-[var(--bronze)]">
            aligned with legacy.
          </span>
        </h2>
      </div>

      {/* 3-Column Interactive Accordion */}
      <div className="flex-grow flex flex-col lg:flex-row gap-0 mt-16 border-t border-b border-[var(--stone)]/20 h-[65vh] overflow-hidden bg-[var(--surface)]">
        {SERVICES.map((srv, idx) => {
          const isHovered = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;
          const flexClass = isHovered
            ? "lg:flex-[2.2] bg-[var(--surface)]"
            : isAnyHovered
            ? "lg:flex-[0.6] bg-[var(--background)]/30 opacity-60"
            : "lg:flex-[1]";

          return (
            <div
              key={srv.id}
              className={cn(
                "flex-grow flex flex-col justify-between p-8 md:p-12 relative overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer group border-b lg:border-b-0 lg:border-r border-[var(--stone)]/20 last:border-r-0",
                flexClass
              )}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Background Image Reveal (Visible on Hover) */}
              <div
                className={cn(
                  "absolute inset-0 z-0 transition-opacity duration-1000 ease-[var(--ease-out-aureon)] pointer-events-none",
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/85 via-[var(--ink)]/45 to-transparent z-[1]" />
                <Image
                  src={srv.img}
                  alt={srv.title}
                  fill
                  className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              {/* Service Number & Tag */}
              <div className="flex justify-between items-baseline z-10 relative">
                <span
                  className={cn(
                    "text-[10px] font-sans font-semibold tracking-[0.25em] transition-colors duration-500",
                    isHovered ? "text-[var(--champagne)]" : "text-[var(--muted-ink)]"
                  )}
                >
                  {srv.tag}
                </span>
                <span
                  className={cn(
                    "font-mono text-xs transition-colors duration-500",
                    isHovered ? "text-white/40" : "text-[var(--stone)]"
                  )}
                >
                  {srv.id}
                </span>
              </div>

              {/* Title & Description Column */}
              <div className="z-10 relative mt-auto flex flex-col gap-4">
                <h3
                  className={cn(
                    "text-2xl md:text-3xl font-display font-bold tracking-tight transition-colors duration-500 leading-tight",
                    isHovered ? "text-white" : "text-[var(--ink)]"
                  )}
                >
                  {srv.title}
                </h3>
                
                {/* Description - Slides Open smoothly on Hover */}
                <div
                  className={cn(
                    "grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isHovered ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                      {srv.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom spacer */}
      <div className="px-8 md:px-24 flex justify-between items-center text-[9px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--muted-ink)] mt-6">
        <span>AUREON STEWARDSHIP</span>
        <span>HOVER ANY COLUMN TO EXPAND</span>
      </div>
    </section>
  );
}
