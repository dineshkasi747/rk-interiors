"use client";

import React, { useRef, useEffect } from "react";
import { prefersReducedMotion } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export default function MagneticButton({
  children,
  strength = 35,
  className = "",
  ...props
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const el = containerRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Translate coordinates to a ratio
      const tx = (x / rect.width) * strength;
      const ty = (y / rect.height) * strength;

      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };

    const onMouseLeave = () => {
      el.style.transform = "translate3d(0px, 0px, 0)";
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [strength]);

  return (
    <button
      ref={containerRef}
      className={`magnetic-area transition-transform duration-500 ease-[var(--ease-out-aureon)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
