"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

/* ── Config ── */
const TOTAL_FRAMES = 240;
const FRAME_PATH = "/hero-frames/frame_";
const FRAME_EXT = ".jpg";

const pad = (n: number) => String(n).padStart(6, "0");
const frameUrl = (i: number) => `${FRAME_PATH}${pad(i)}${FRAME_EXT}`;

const COPY_SEQUENCE = [
  { text: "AUREON", type: "title" as const, start: 0, end: 15 },
  { text: "Some structures are built.", type: "line" as const, start: 12, end: 26 },
  { text: "Others are summoned.", type: "line" as const, start: 23, end: 36 },
  { text: "Private worlds.", type: "accent" as const, start: 33, end: 46 },
  { text: "Suspended beyond expectation.", type: "line" as const, start: 43, end: 58 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalTextRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const cloudBackRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const cloudForeRef = useRef<HTMLDivElement>(null);
  const cloudUltraRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrame = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = images.current[index];
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  /* ── Canvas resize + frame preload ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      drawFrame(currentFrame.current);
    };
    resize();
    window.addEventListener("resize", resize);

    let loadedCount = 0;
    let cancelled = false;

    const loadImage = (index: number): Promise<void> =>
      new Promise((resolve) => {
        if (cancelled || images.current[index]) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          if (cancelled) { resolve(); return; }
          images.current[index] = img;
          loadedCount++;
          const currentProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(currentProgress);
          
          // Dispatch global progress event for the Preloader
          window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: currentProgress } }));

          /* Draw immediately if this is the current target frame */
          if (index === currentFrame.current) {
            drawFrame(index);
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(index);
      });

    const indices = (step: number) =>
      Array.from({ length: Math.ceil(TOTAL_FRAMES / step) }, (_, k) => k * step);

    const preload = async () => {
      await loadImage(0);
      drawFrame(0);

      if (cancelled) return;
      await Promise.all(indices(20).map(loadImage));

      if (cancelled) return;
      await Promise.all(indices(10).map(loadImage));

      if (cancelled) return;
      await Promise.all(indices(5).map(loadImage));

      for (let i = 0; i < TOTAL_FRAMES; i += 30) {
        if (cancelled) return;
        await Promise.all(
          Array.from({ length: 15 }, (_, k) => i + k * 2).filter((n) => n < TOTAL_FRAMES).map(loadImage)
        );
      }

      for (let i = 0; i < TOTAL_FRAMES; i += 15) {
        if (cancelled) return;
        await Promise.all(
          Array.from({ length: 15 }, (_, k) => i + k).filter((n) => n < TOTAL_FRAMES).map(loadImage)
        );
      }
    };

    preload();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
    };
  }, [drawFrame]);

  /* ── Scroll-driven animation ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const wrapper = document.getElementById("hero-root");
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    const ctx = gsap.context(() => {
      /* Map scroll progress through hero-root → frame index */
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const frameProgress = self.progress;
          const targetIndex = Math.min(
            Math.floor(frameProgress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          );

          let bestIndex = targetIndex;
          if (!images.current[targetIndex]) {
            bestIndex = 0;
            for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
              const lo = targetIndex - offset;
              const hi = targetIndex + offset;
              if (lo >= 0 && images.current[lo]) { bestIndex = lo; break; }
              if (hi < TOTAL_FRAMES && images.current[hi]) { bestIndex = hi; break; }
            }
          }

          if (bestIndex !== currentFrame.current) {
            currentFrame.current = bestIndex;
            drawFrame(bestIndex);
          }
        },
      });

      /* Golden bloom across first 55% of wrapper scroll */
      if (bloomRef.current) {
        gsap.fromTo(
          bloomRef.current,
          { opacity: 0.05 },
          {
            opacity: 0.45,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top top",
              end: "55% bottom",
              scrub: 1,
            },
          }
        );
      }

      /* Scroll Indicator Fadeout */
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          y: -30,
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "10% top",
            scrub: true
          }
        });
      }

      /* ── Cloud sweep across the screen between 55% and 95% scroll ── */
      if (cloudBackRef.current && cloudMidRef.current && cloudForeRef.current && cloudUltraRef.current && fogRef.current) {
        const cloudTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "55% top", 
            end: "95% top",   
            scrub: true,
          },
        });

        // Layer 1: Back (moves slowest, starts early)
        cloudTl.fromTo(
          cloudBackRef.current,
          { y: "100vh", opacity: 0 },
          { y: "-150vh", opacity: 0.8, duration: 1.5, ease: "none" },
          0
        );
        
        // Layer 2: Mid
        cloudTl.fromTo(
          cloudMidRef.current,
          { y: "100vh", opacity: 0 },
          { y: "-180vh", opacity: 0.9, duration: 1.5, ease: "none" },
          0.15
        );
        
        // Layer 3: Fore
        cloudTl.fromTo(
          cloudForeRef.current,
          { y: "110vh", opacity: 0 },
          { y: "-220vh", opacity: 1, duration: 1.5, ease: "none" },
          0.3
        );

        // Layer 4: Ultra (moves fastest, starts latest)
        cloudTl.fromTo(
          cloudUltraRef.current,
          { y: "120vh", opacity: 0 },
          { y: "-260vh", opacity: 1, duration: 1.5, ease: "none" },
          0.45
        );

        // The fog layer completely obliterates the video background to pure dense mist
        cloudTl.fromTo(fogRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration: 1, ease: "power2.in" }, 
          0.8
        );
      }

      /* ── Final Text Block Entrance (75% to 95%) ── */
      if (finalTextRef.current) {
        gsap.fromTo(
          finalTextRef.current,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: wrapper,
              start: "75% top",
              end: "95% top",
              scrub: true,
            },
          }
        );
      }

      /* ── Copy sequence based on start/end percentages ── */
      copyRefs.current.forEach((el, i) => {
        if (!el) return;

        const { start, end } = COPY_SEQUENCE[i];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: `${start}% top`,
            end: `${end}% top`,
            scrub: 1,
          },
        });

        const entries = [
          { rotationX: 10, rotationY: -5 },
          { rotationX: -5, rotationY: 5 },
          { rotationX: 5, rotationY: -10 },
          { rotationX: 0, rotationY: 10 },
          { rotationX: -10, rotationY: 0 },
        ];
        const entry = entries[i % entries.length];

        if (i === 4) {
          tl.fromTo(
            el,
            { opacity: 0, z: -1000, x: "20vw", scale: 0.8, ...entry },
            { opacity: 1, z: 0, x: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 0.4, ease: "power2.out" }
          );
          tl.to(
            el,
            { opacity: 0, z: 800, x: "-100vw", scale: 1.5, rotationY: -30, duration: 0.6, ease: "power2.in" }
          );
        } else {
          tl.fromTo(
            el,
            { opacity: 0, z: -1500, scale: 0.6, ...entry },
            { opacity: 1, z: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 0.4, ease: "power2.out" }
          );
          tl.to(
            el,
            { opacity: 0, z: 1500, scale: 2.5, duration: 0.6, ease: "power2.in" }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [drawFrame]);

  /* ── Page load entrance ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const tl = gsap.timeline({ delay: 2.0 }); // Wait for preloader to finish

    if (overlayRef.current) {
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0);
    }

    if (copyRefs.current[0]) {
      tl.fromTo(
        copyRefs.current[0],
        { opacity: 0, y: 60, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" },
        0.2
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="sticky top-0 w-full h-screen overflow-hidden bg-[#17130F]"
      style={{ zIndex: 10 }}
      aria-label="Hero — Scroll to explore"
    >
      {/* Frame canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Cinematic vignette */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `
            linear-gradient(180deg, rgba(23,19,15,0.3) 0%, rgba(23,19,15,0.0) 30%, rgba(23,19,15,0.0) 60%, rgba(23,19,15,0.45) 100%),
            linear-gradient(90deg, rgba(23,19,15,0.2) 0%, transparent 25%, transparent 75%, rgba(23,19,15,0.2) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Golden bloom */}
      <div
        ref={bloomRef}
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 25%, rgba(200,169,106,0.18) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Dense Fog Layer - fades in to completely obscure the canvas behind clouds */}
      <div
        ref={fogRef}
        className="absolute inset-0 pointer-events-none z-[4] opacity-0"
        style={{ background: "var(--background)" }}
        aria-hidden="true"
      />

      {/* Clouds Overlay Container */}
      <div 
        className="absolute inset-0 pointer-events-none z-[5] overflow-visible"
        style={{ mixBlendMode: "screen" }}
      >
        {/* Layer 1: Back Cloud */}
        <div
          ref={cloudBackRef}
          className="absolute inset-0 opacity-0 will-change-transform"
          style={{ filter: "blur(8px)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/cloud-overlay.png"
            alt=""
            className="w-full h-full object-cover scale-150 rotate-[10deg]"
          />
        </div>

        {/* Layer 2: Mid Cloud */}
        <div
          ref={cloudMidRef}
          className="absolute inset-0 opacity-0 will-change-transform"
          style={{ filter: "blur(4px)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/cloud-overlay.png"
            alt=""
            className="w-full h-full object-cover scale-[1.75] rotate-[-5deg]"
          />
        </div>

        {/* Layer 3: Fore Cloud */}
        <div
          ref={cloudForeRef}
          className="absolute inset-0 opacity-0 will-change-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/cloud-overlay.png"
            alt=""
            className="w-full h-full object-cover scale-[2] rotate-[15deg]"
          />
        </div>

        {/* Layer 4: Ultra Cloud */}
        <div
          ref={cloudUltraRef}
          className="absolute inset-0 opacity-0 will-change-transform"
          style={{ filter: "blur(2px)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/cloud-overlay.png"
            alt=""
            className="w-full h-full object-cover scale-[2.5] rotate-[-20deg]"
          />
        </div>
      </div>

      {/* 3D Cinematic Texts */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[8]"
        style={{ perspective: 1200 }}
      >
        {COPY_SEQUENCE.map((item, idx) => (
          <div
            key={idx}
            ref={(el) => {
              copyRefs.current[idx] = el;
            }}
            className="absolute opacity-0 flex flex-col items-center justify-center text-center will-change-transform px-6 select-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            {item.type === "title" && (
              <h1 className="text-hero font-display text-[var(--champagne)] font-bold tracking-[0.3em] uppercase drop-shadow-[0_12px_48px_rgba(200,169,106,0.3)]">
                {item.text}
              </h1>
            )}
            {item.type === "line" && (
              <p className="font-editorial italic text-hero-sub text-[var(--surface)] font-light leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                {item.text}
              </p>
            )}
            {item.type === "accent" && (
              <span className="text-section-label text-[var(--champagne)] font-semibold tracking-[0.3em] bg-black/40 px-6 py-2.5 rounded-full border border-[var(--champagne)]/30 backdrop-blur-sm">
                {item.text}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Final Text Block */}
      <div
        ref={finalTextRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-[9] pointer-events-none px-6 opacity-0 will-change-transform"
      >
        <div className="max-w-4xl flex flex-col items-center gap-6">
          <span className="text-section-label text-[var(--bronze)] tracking-[0.25em] font-semibold">
            PRIVATE ARCHITECTURAL WORLDS
          </span>
          <h2 className="text-section-title font-display text-[var(--ink)] font-bold tracking-tight">
            Impossible structures <br />
            <span className="font-editorial italic font-normal text-[var(--bronze)]">precision made emotional.</span>
          </h2>
          <p className="text-section-body max-w-xl text-[var(--muted-ink)] leading-relaxed mt-4">
            AUREON designs impossible villas, towers, and private worlds for those who have seen everything and still expect to be moved.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-[8]"
      >
        <span className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--stone)] animate-pulse">
          Scroll to explore
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[var(--stone)] to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[var(--champagne)] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
