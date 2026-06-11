"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

const PHRASES = [
  "8 Years...",
  "Countless Memories...",
  "Endless Love...",
  "Happy 8th Anniversary ❤️",
];

export default function LoadingScreen({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);
  const animRef = useRef<number>(0);

  // Canvas starfield + shooting stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // Stars
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.01 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    }));

    // Particles
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? "#d4a843" : "#ff6b9d",
    }));

    // Shooting stars
    let shootingStars: {
      x: number; y: number; vx: number; vy: number;
      len: number; alpha: number; life: number; maxLife: number;
    }[] = [];

    const spawnShooting = () => {
      shootingStars.push({
        x: Math.random() * W * 0.7,
        y: Math.random() * H * 0.4,
        vx: 8 + Math.random() * 4,
        vy: 3 + Math.random() * 2,
        len: 120 + Math.random() * 80,
        alpha: 1,
        life: 0,
        maxLife: 60,
      });
    };

    let frame = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(10,10,26,0.25)";
      ctx.fillRect(0, 0, W, H);

      // Moonlight glow
      const moonGrad = ctx.createRadialGradient(W * 0.8, H * 0.1, 0, W * 0.8, H * 0.1, 200);
      moonGrad.addColorStop(0, "rgba(240,200,120,0.12)");
      moonGrad.addColorStop(1, "transparent");
      ctx.fillStyle = moonGrad;
      ctx.fillRect(0, 0, W, H);

      // Stars
      stars.forEach((s) => {
        s.alpha += s.speed * s.twinkleDir;
        if (s.alpha >= 1 || s.alpha <= 0.1) s.twinkleDir *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      });

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      // Shooting stars
      if (frame % 90 === 0) spawnShooting();
      shootingStars = shootingStars.filter((s) => s.life < s.maxLife);
      shootingStars.forEach((s) => {
        s.life++;
        s.alpha = 1 - s.life / s.maxLife;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 10, s.y - s.vy * 10);
        grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
        ctx.stroke();
        // Sparkle at head
        const sparkGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
        sparkGrad.addColorStop(0, `rgba(255,255,200,${s.alpha})`);
        sparkGrad.addColorStop(1, "transparent");
        ctx.fillStyle = sparkGrad;
        ctx.fillRect(s.x - 8, s.y - 8, 16, 16);
        s.x += s.vx;
        s.y += s.vy;
      });

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Phrase cycling
  useEffect(() => {
    if (phraseIndex < PHRASES.length - 1) {
      const t = setTimeout(() => setPhraseIndex((i) => i + 1), 1800);
      return () => clearTimeout(t);
    } else {
      // Last phrase shown — wait then exit
      const t = setTimeout(() => {
        setDone(true);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 700);
        }, 1200);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [phraseIndex, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-overlay"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Moonlight glow */}
          <div
            className="absolute top-[8%] right-[18%] w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(240,200,120,0.18) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={phraseIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {phraseIndex < 3 ? (
                  <p
                    className="text-4xl md:text-6xl font-light tracking-widest"
                    style={{
                      fontFamily: "Georgia, serif",
                      color:
                        phraseIndex === 0
                          ? "#f0c96a"
                          : phraseIndex === 1
                          ? "#ffb3cc"
                          : "#ffffff",
                      textShadow:
                        phraseIndex === 0
                          ? "0 0 40px rgba(212,168,67,0.8)"
                          : phraseIndex === 1
                          ? "0 0 40px rgba(255,107,157,0.8)"
                          : "0 0 40px rgba(255,255,255,0.4)",
                    }}
                  >
                    {PHRASES[phraseIndex]}
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <motion.p
                      className="text-3xl md:text-5xl font-bold"
                      style={{
                        fontFamily: "Georgia, serif",
                        background: "linear-gradient(135deg, #d4a843, #ff6b9d, #d4a843)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textShadow: "none",
                        filter: "drop-shadow(0 0 20px rgba(212,168,67,0.6))",
                      }}
                    >
                      Happy 8th Anniversary ❤️
                    </motion.p>
                    {done && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        className="h-px w-48 bg-gradient-to-r from-transparent via-gold to-transparent"
                        style={{ background: "linear-gradient(to right, transparent, #d4a843, transparent)" }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Subtitle loader dots */}
            <div className="mt-12 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#d4a843" }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
