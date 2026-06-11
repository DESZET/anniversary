"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function FinalEnding() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [showFinal, setShowFinal] = useState(false);
  const [shootingStarDone, setShootingStarDone] = useState(false);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (inView) {
      const t1 = setTimeout(() => setShootingStarDone(true), 3000);
      const t2 = setTimeout(() => setShowFinal(true), 4500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [inView]);

  // Galaxy canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    // Stars
    const stars = Array.from({ length: 400 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.3,
      alpha: Math.random(),
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.7 ? "#d4a843" : Math.random() > 0.5 ? "#ff6b9d" : "#ffffff",
    }));

    // Galaxy spiral particles
    const spiralCount = 150;
    const spiralParticles = Array.from({ length: spiralCount }, (_, i) => {
      const angle = (i / spiralCount) * Math.PI * 6;
      const radius = (i / spiralCount) * Math.min(W, H) * 0.4;
      return {
        baseX: W / 2 + Math.cos(angle) * radius,
        baseY: H / 2 + Math.sin(angle) * radius * 0.5,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        offset: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.005 + 0.002,
      };
    });

    // Aurora streaks
    const auroraColors = [
      ["rgba(13,27,62,0)", "rgba(100,50,200,0.15)", "rgba(13,27,62,0)"],
      ["rgba(13,27,62,0)", "rgba(255,107,157,0.1)", "rgba(13,27,62,0)"],
      ["rgba(13,27,62,0)", "rgba(80,200,180,0.12)", "rgba(13,27,62,0)"],
    ];

    let t = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(8,5,15,0.25)";
      ctx.fillRect(0, 0, W, H);

      // Aurora bands
      auroraColors.forEach((colors, i) => {
        const grad = ctx.createLinearGradient(0, H * (0.1 + i * 0.15), W, H * (0.3 + i * 0.15));
        colors.forEach((c, j) => grad.addColorStop(j / 2, c));
        ctx.fillStyle = grad;
        const yOff = Math.sin(t * 0.3 + i) * 20;
        ctx.beginPath();
        ctx.ellipse(W / 2, H * (0.2 + i * 0.15) + yOff, W * 0.8, H * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spiral particles
      spiralParticles.forEach((p) => {
        const pulse = Math.sin(t * p.speed * 10 + p.offset) * 3;
        ctx.beginPath();
        ctx.arc(p.baseX + pulse, p.baseY + pulse * 0.5, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,168,67,${p.alpha * 0.4})`;
        ctx.fill();
      });

      // Stars
      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha >= 1) { s.alpha = 1; s.twinkleDir = -1; }
        if (s.alpha <= 0.1) { s.alpha = 0.1; s.twinkleDir = 1; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + Math.floor(s.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      t += 0.01;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ending"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Radial dark center overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(5,2,10,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Shooting star SVG */}
      {inView && (
        <motion.div
          className="absolute top-1/4 left-0 pointer-events-none z-10"
          initial={{ x: "-10vw", y: "0vh", opacity: 0 }}
          animate={{ x: "110vw", y: "40vh", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        >
          <div
            className="w-32 h-0.5 rounded-full"
            style={{
              background: "linear-gradient(to right, transparent, #ffffff, rgba(212,168,67,0.8), transparent)",
              filter: "blur(1px)",
              boxShadow: "0 0 8px rgba(255,255,255,0.8)",
            }}
          />
          <div
            className="w-2 h-2 rounded-full absolute right-0 top-1/2 -translate-y-1/2"
            style={{
              background: "#ffffff",
              boxShadow: "0 0 10px #ffffff, 0 0 20px #d4a843",
            }}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          className="text-xs tracking-[0.5em] uppercase mb-8"
          style={{ color: "#d4a843" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          ✦ The End · And the Beginning ✦
        </motion.p>

        <motion.h1
          className="text-4xl md:text-7xl font-bold leading-tight mb-8"
          style={{
            fontFamily: "Georgia, serif",
            background: "linear-gradient(135deg, #d4a843, #ffffff, #ff6b9d, #ffffff, #d4a843)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 30px rgba(212,168,67,0.3))",
          }}
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Thank You For 7
          <br />
          Beautiful Months ❤️
        </motion.h1>

        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(212,168,67,0.6))" }} />
          <span style={{ color: "#d4a843" }}>✦</span>
          <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(212,168,67,0.6))" }} />
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-white/70 mb-4"
          style={{ fontFamily: "Georgia, serif" }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
        >
          And For Every Year Yet To Come.
        </motion.p>

        {/* Final dramatic text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showFinal ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p
            className="text-5xl md:text-8xl font-bold mt-12"
            style={{
              fontFamily: "Georgia, serif",
              background: "linear-gradient(135deg, #d4a843, #ff6b9d, #ffffff, #d4a843)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              filter: "drop-shadow(0 0 40px rgba(212,168,67,0.5))",
            }}
          >
            Forever Begins Again.
          </p>
        </motion.div>

        {/* Bottom hearts */}
        <motion.div
          className="mt-16 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={showFinal ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {["❤️", "💛", "✨", "💛", "❤️"].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
