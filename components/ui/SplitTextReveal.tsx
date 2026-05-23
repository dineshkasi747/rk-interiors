"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

interface SplitTextRevealProps {
  text: string;
  type?: "words" | "chars" | "lines";
  className?: string;
  delay?: number;
  duration?: number;
  trigger?: HTMLElement | string | null;
  triggerStart?: string;
}

export default function SplitTextReveal({
  text,
  type = "words",
  className = "",
  delay = 0,
  duration = 0.8,
  trigger = null,
  triggerStart = "top 80%"
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const el = containerRef.current;
    if (!el) return;

    const elements = el.querySelectorAll(".reveal-child");
    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { y: "110%", rotateZ: 2 },
        {
          y: "0%",
          rotateZ: 0,
          duration: duration,
          ease: "power4.out",
          delay: delay,
          stagger: 0.04,
          scrollTrigger: trigger
            ? {
                trigger: trigger as any,
                start: triggerStart,
                toggleActions: "play none none none"
              }
            : undefined
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, type, delay, duration, trigger, triggerStart]);

  if (type === "chars") {
    const chars = text.split("");
    return (
      <div ref={containerRef} className={`flex flex-wrap overflow-hidden ${className}`}>
        {chars.map((char, index) => (
          <span key={index} className="inline-block overflow-hidden relative">
            <span className="reveal-child inline-block will-change-transform">
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))}
      </div>
    );
  }

  const words = text.split(" ");
  return (
    <div ref={containerRef} className={`flex flex-wrap overflow-hidden ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden relative mr-[0.25em] py-[0.1em] -my-[0.1em]">
          <span className="reveal-child inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </div>
  );
}
