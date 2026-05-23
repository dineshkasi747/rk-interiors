"use client";

import React, { useState, useRef, useEffect } from "react";
import SectionLabel from "./ui/SectionLabel";
import { prefersReducedMotion } from "@/lib/utils";
import Image from "next/image";

export default function PrivateAccessSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Calculate coordinates relative to the container
      const rx = e.clientX - rect.left;
      const ry = e.clientY - rect.top;
      
      setMousePos({ x: rx, y: ry });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      // Fade spotlight out by putting it off-screen
      setMousePos({ x: -500, y: -500 });
    };

    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    // Apply simple smooth lerping on the spotlight positions
    const tick = () => {
      currentPos.current.x += (mousePos.x - currentPos.current.x) * 0.15;
      currentPos.current.y += (mousePos.y - currentPos.current.y) * 0.15;

      if (el) {
        el.style.setProperty("--x", `${currentPos.current.x}px`);
        el.style.setProperty("--y", `${currentPos.current.y}px`);
      }
      
      rafRef.current = requestAnimationFrame(tick);
    };
    
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mousePos]);

  const styleObj = {
    "--x": "-500px",
    "--y": "-500px",
  } as React.CSSProperties;

  return (
    <section
      ref={containerRef}
      id="private-access"
      className="relative min-h-screen bg-[#110e0c] flex flex-col justify-center px-8 md:px-24 py-32 overflow-hidden select-none z-10"
      style={styleObj}
      aria-label="Private Access Only"
    >
      {/* Hidden Spotlight Image Layer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700"
        style={{
          clipPath: `circle(${isHovered ? "180px" : "0px"} at var(--x) var(--y))`,
          WebkitClipPath: `circle(${isHovered ? "180px" : "0px"} at var(--x) var(--y))`,
        }}
      >
        {/* Soft Vignette Overlay on Mansion */}
        <div className="absolute inset-0 bg-[#110e0c]/40 z-[1]" />
        <Image
          src="/private-mansion.png"
          alt="AUREON Dark Mansion Estate"
          fill
          className="object-cover scale-105"
          sizes="100vw"
        />
      </div>

      {/* Main Front Content */}
      <div className="max-w-4xl w-full mx-auto z-10 relative pointer-events-none">
        <div className="text-[var(--stone)]">
          <SectionLabel label="Private Access" number="06" />
        </div>

        <div className="flex flex-col gap-6 mt-16 max-w-2xl">
          <h2 className="text-section-title font-display text-[#FFF8EE] font-bold tracking-tight leading-[0.95]">
            By Invitation <br />
            <span className="font-editorial italic font-normal text-[var(--champagne)]">
              Only.
            </span>
          </h2>
          
          <p className="text-section-body text-[var(--stone)]/80 leading-relaxed mt-4">
            Some worlds are not meant to be witnessed by all. We invite you to unlock the key to AUREON's private vaults—housing unlisted properties, offline architectural studies, and impossible custom blueprints.
          </p>

          <div className="flex items-center gap-4 mt-8 pointer-events-auto w-fit">
            <button className="px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] bg-[var(--champagne)] text-[#17130F] hover:bg-[#FFF8EE] transition-colors duration-300 shadow-[0_12px_24px_rgba(200,169,106,0.15)]">
              Request Private Credentials
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Helper Hint */}
      <div className="absolute bottom-8 left-8 pointer-events-none font-mono text-[9px] text-[var(--stone)]/40 tracking-wider uppercase z-10">
        Move pointer to cast light on the estate
      </div>
    </section>
  );
}
