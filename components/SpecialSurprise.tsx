"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number; x: number; y: number;
  vx: number; vy: number; color: string; size: number; life: number;
}
interface Firework { id: number; x: string; y: string; color: string; }

// Canvas-based particle renderer — zero React re-renders per frame
function CanvasParticles({ particles, fireworks }: { particles: Particle[]; fireworks: Firework[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      const x = (p.x / 100) * canvas.width;
      const y = (p.y / 100) * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, p.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, "0");
      ctx.fill();
    });
  }, [particles]);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 40, pointerEvents: "none" }} />;
}

export default function SpecialSurprise() {
  const [opened, setOpened] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const rafRef = useRef<number>(0);

  const colors = ["#d4a843", "#ff6b9d", "#ffffff", "#ffb3cc", "#f0c96a", "#ff4466"];

  // Deterministic stars — no Math.random in render
  const stars = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 11) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    w: (i % 3) + 1,
    color: i % 2 === 0 ? "#d4a843" : "#ff6b9d",
    opacity: ((i * 0.15) % 0.5) + 0.1,
    duration: `${2 + (i % 3)}s`,
    delay: `${(i * 0.2) % 3}s`,
  })), []);

  const triggerExplosion = () => {
    setOpened(true);

    // Heartbeat sound simulation via oscillator
    try {
      const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const playBeat = (time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(80, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        osc.start(time);
        osc.stop(time + 0.2);
      };
      const now = ctx.currentTime;
      playBeat(now);
      playBeat(now + 0.3);
      playBeat(now + 1.0);
      playBeat(now + 1.3);
    } catch {}

    // Generate explosion particles
    const newParticles: Particle[] = Array.from({ length: 200 }, (_, i) => {
      const angle = (i / 200) * Math.PI * 2 + Math.random() * 0.5;
      const speed = Math.random() * 8 + 2;
      return {
        id: i,
        x: 50, y: 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        life: 1,
      };
    });
    setParticles(newParticles);

    // Fireworks
    setFireworks(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: `${10 + Math.random() * 80}%`,
        y: `${5 + Math.random() * 60}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    );

    // Show message after delay
    setTimeout(() => setShowMessage(true), 1200);
  };

  // Animate particles
  useEffect(() => {
    if (!opened || particles.length === 0) return;
    let frame = 0;
    const tick = () => {
      frame++;
      if (frame > 120) return;
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.8,
            y: p.y + p.vy * 0.8,
            vy: p.vy + 0.15,
            life: p.life - 0.012,
          }))
          .filter((p) => p.life > 0)
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [opened, particles.length]);

  return (
    <section id="surprise" className="py-32 px-6 relative overflow-hidden flex items-center justify-center min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(20,5,30,0.9) 0%, rgba(10,10,26,1) 70%)",
        }}
      />

      {/* Stars — deterministic */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((s) => (
          <div key={s.id} className="absolute rounded-full animate-twinkle"
            style={{ left: s.left, top: s.top, width: s.w, height: s.w, background: s.color, opacity: s.opacity, animationDelay: s.delay, animationDuration: s.duration }} />
        ))}
      </div>

      {/* Canvas for particles — pakai canvas bukan DOM supaya tidak freeze di HP */}
      {opened && particles.length > 0 && (
        <CanvasParticles particles={particles} fireworks={fireworks} />
      )}

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm tracking-[0.4em] uppercase mb-8" style={{ color: "#d4a843" }}>
                ✦ A Special Moment ✦
              </p>

              <motion.button
                onClick={triggerExplosion}
                className="relative group px-12 py-6 rounded-full text-xl font-bold overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #d4a843, #ff6b9d, #d4a843)",
                  backgroundSize: "200% 200%",
                  animation: "aurora 3s ease infinite",
                  boxShadow: "0 0 40px rgba(212,168,67,0.4), 0 0 80px rgba(255,107,157,0.2)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.08, boxShadow: "0 0 60px rgba(212,168,67,0.6), 0 0 100px rgba(255,107,157,0.3)" }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 40px rgba(212,168,67,0.4)",
                    "0 0 60px rgba(255,107,157,0.6)",
                    "0 0 40px rgba(212,168,67,0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-2xl animate-heartbeat">❤️</span>
                  Open My Heart
                  <span className="text-2xl animate-heartbeat">❤️</span>
                </span>

                {/* Ripple effect */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                  }}
                />
              </motion.button>

              <p className="mt-6 text-white/30 text-sm italic">Click to reveal a special message</p>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Dark overlay when opened */}
              <motion.div
                className="fixed inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                style={{ background: "#000", zIndex: 35 }}
              />

              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    className="relative z-50"
                    initial={{ opacity: 0, scale: 0.5, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    {/* Best photo */}
                    <div className="w-48 h-48 rounded-full mx-auto mb-8 overflow-hidden"
                      style={{
                        border: "3px solid rgba(212,168,67,0.5)",
                        boxShadow: "0 0 60px rgba(212,168,67,0.3), 0 0 100px rgba(255,107,157,0.2)",
                      }}
                    >
                      <img
                        src="/photos/photo-53.jpg"
                        alt="Us"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <motion.h2
                      className="text-4xl md:text-5xl font-bold mb-8"
                      style={{
                        fontFamily: "Georgia, serif",
                        background: "linear-gradient(135deg, #d4a843, #ff6b9d, #ffffff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 0 20px rgba(212,168,67,0.4))",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      ❤️
                    </motion.h2>

                    <motion.p
                      className="text-lg md:text-2xl text-white/90 leading-relaxed max-w-xl mx-auto"
                      style={{ fontFamily: "Georgia, serif" }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Thank you for every smile, every laugh, every memory, and every moment.
                    </motion.p>

                    <motion.p
                      className="text-2xl md:text-3xl font-bold mt-6"
                      style={{
                        fontFamily: "Georgia, serif",
                        color: "#ff6b9d",
                        textShadow: "0 0 30px rgba(255,107,157,0.6)",
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      I love you today, tomorrow, and for every month yet to come.
                    </motion.p>

                    <motion.button
                      className="mt-10 px-8 py-3 rounded-full text-sm"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "rgba(255,255,255,0.7)",
                        cursor: "pointer",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      onClick={() => { setOpened(false); setShowMessage(false); setParticles([]); setFireworks([]); }}
                      whileHover={{ background: "rgba(255,255,255,0.15)" }}
                    >
                      ← Continue the journey
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
