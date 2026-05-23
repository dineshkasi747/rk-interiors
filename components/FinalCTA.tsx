"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";
import { motion, AnimatePresence } from "framer-motion";

export default function FinalCTA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Atmospheric amber particle canvas effect
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; r: number; d: number; speed: number }[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate floating amber dust particles
    const count = 45;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        d: Math.random() * count,
        speed: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(200, 169, 106, 0.4)"; // warm champagne

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        ctx.fill();

        // Drift slowly upwards and sideways
        p.y -= p.speed;
        p.x += Math.sin(p.y / 30) * 0.2;

        // Reset if particles go off-screen
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setFormSubmitted(false);
    }, 2000);
  };

  return (
    <section
      id="cta"
      className="relative min-h-[90vh] bg-[var(--ink)] flex flex-col justify-between pt-32 pb-16 px-8 md:px-24 overflow-hidden z-10"
      aria-label="Consultation Booking"
    >
      {/* Particle Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[0] opacity-40"
      />

      <div className="max-w-6xl w-full mx-auto flex flex-col justify-between h-full z-10 relative">
        <div className="text-[var(--stone)]/80">
          <SectionLabel label="Consultation" number="07" />
        </div>

        {/* CTA Heading & Button */}
        <div className="my-auto py-12 max-w-4xl">
          <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-display text-[var(--surface)] font-light leading-[0.9] tracking-tight">
            Summon your <br />
            <span className="font-editorial italic text-[var(--champagne)]">
              private world.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--stone)]/80 max-w-xl leading-relaxed mt-8">
            Let us begin drafting your impossible estate. Coordinate an initial portfolio review with our architectural directors.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-5 rounded-full text-xs font-semibold uppercase tracking-[0.25em] bg-[var(--champagne)] text-[var(--ink)] hover:bg-[var(--surface)] hover:scale-105 transition-all duration-300 mt-10 shadow-[0_16px_32px_rgba(200,169,106,0.15)]"
          >
            Arrange Private Review
          </button>
        </div>

        {/* Modular luxury Footer */}
        <div className="border-t border-[var(--stone)]/10 pt-16 mt-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-[var(--stone)]/40 text-[10px] font-sans font-medium uppercase tracking-[0.2em]">
          <div className="flex flex-col gap-2">
            <span className="text-[var(--stone)]/80 font-display tracking-[0.25em] font-light text-sm">
              AUREON
            </span>
            <span className="mt-1">© {new Date().getFullYear()} — PRIVATE ARCHITECTURAL WORLDS.</span>
          </div>

          <div className="flex gap-8">
            <a href="#hero" className="hover:text-[var(--champagne)] transition-colors duration-300">
              TOP
            </a>
            <a href="#manifesto" className="hover:text-[var(--champagne)] transition-colors duration-300">
              MANIFESTO
            </a>
            <a href="#anthology" className="hover:text-[var(--champagne)] transition-colors duration-300">
              WORLDS
            </a>
            <a href="#craft" className="hover:text-[var(--champagne)] transition-colors duration-300">
              CRAFT
            </a>
          </div>

          <div className="text-right">
            <span>OFFICE: TOKYO — AMALFI — ST. MORITZ</span>
          </div>
        </div>
      </div>

      {/* Luxury Consultation Scheduling Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#17130F] border border-[var(--champagne)]/20 p-8 md:p-12 rounded-3xl max-w-lg w-full relative z-10 shadow-[0_32px_64px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-[var(--stone)] hover:text-white transition-colors text-lg"
                aria-label="Close form"
              >
                ✕
              </button>

              <div className="flex flex-col gap-6 text-center md:text-left">
                <span className="text-[9px] font-sans font-semibold tracking-[0.2em] text-[var(--champagne)] uppercase">
                  SUMMONING FORM
                </span>
                <h3 className="text-3xl font-display font-light text-[var(--surface)] leading-tight tracking-tight">
                  Arrange Private <br />
                  <span className="font-editorial italic text-[var(--champagne)]">
                    Stewardship.
                  </span>
                </h3>

                <AnimatePresence mode="wait">
                  {!formSubmitted ? (
                    <motion.form
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleFormSubmit}
                      className="flex flex-col gap-5 mt-4"
                    >
                      {/* Name input */}
                      <div className="flex flex-col text-left">
                        <label className="text-[9px] text-[var(--stone)]/60 font-sans tracking-widest uppercase mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          className="bg-[#1f1914] border border-[var(--stone)]/20 text-white rounded-lg px-4 py-3 text-sm focus:border-[var(--champagne)] focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Email input */}
                      <div className="flex flex-col text-left">
                        <label className="text-[9px] text-[var(--stone)]/60 font-sans tracking-widest uppercase mb-1">
                          Private Email
                        </label>
                        <input
                          type="email"
                          required
                          className="bg-[#1f1914] border border-[var(--stone)]/20 text-white rounded-lg px-4 py-3 text-sm focus:border-[var(--champagne)] focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Project selector */}
                      <div className="flex flex-col text-left">
                        <label className="text-[9px] text-[var(--stone)]/60 font-sans tracking-widest uppercase mb-1">
                          Project Intent
                        </label>
                        <select className="bg-[#1f1914] border border-[var(--stone)]/20 text-white rounded-lg px-4 py-3 text-sm focus:border-[var(--champagne)] focus:outline-none transition-colors">
                          <option>Acquisition Contract</option>
                          <option>Seasonal leasing Retreat</option>
                          <option>Portfolio Management</option>
                        </select>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full bg-[var(--champagne)] text-[var(--ink)] py-4 rounded-xl text-xs font-semibold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300 mt-4"
                      >
                        Submit Intent
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-4 py-12 text-center"
                    >
                      <div className="text-[var(--champagne)] text-4xl">✓</div>
                      <h4 className="text-xl text-white font-medium">Intent Summoned</h4>
                      <p className="text-sm text-[var(--stone)]/60 leading-relaxed max-w-xs">
                        Our architectural directors will establish communication via secure channels shortly.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
