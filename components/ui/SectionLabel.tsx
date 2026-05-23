"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  label: string;
  number?: string;
  className?: string;
}

export default function SectionLabel({ label, number, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-4 text-section-label tracking-[0.2em] font-medium font-sans mb-8 select-none", className)}>
      {number && (
        <span className="text-[var(--champagne)] font-mono text-[9px] border border-[var(--champagne)]/20 rounded px-1.5 py-0.5 leading-none">
          {number}
        </span>
      )}
      <span>{label}</span>
      <div className="h-[1px] flex-grow bg-[var(--stone)]/30 max-w-[48px]" />
    </div>
  );
}
