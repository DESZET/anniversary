"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Floating particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? "#d4a843" : "#ff6b9d",
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 180).toString(16).padStart(2, "0");
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // Mouse parallax on lens flare
  const flareRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!flareRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      flareRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 60, filter: "blur(10px)" },
    visible: (i: number) => ({
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { delay: i * 0.25, duration: 1, ease: "easeOut" as const },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background photo with parallax */}
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        {/* Hero photo — uses photo-1 as the main cinematic backdrop */}
        <img
          src="/photos/photo-4.jpg"
          alt="Our love story"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.55) saturate(1.1)" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#0a0a1a]/40 to-[#0a0a1a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/50 via-transparent to-[#0a0a1a]/50" />
      </motion.div>

      {/* Lens flare */}
      <div
        ref={flareRef}
        className="absolute top-1/4 right-1/3 pointer-events-none transition-transform duration-300"
        style={{ willChange: "transform" }}
      >
        <div
          className="w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(240,200,120,0.15) 0%, rgba(212,168,67,0.05) 40%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent)" }}
        />
      </div>

      {/* Light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[15, 30, 45, 60, 75].map((angle, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 origin-top"
            style={{
              width: "2px",
              height: "100vh",
              background: "linear-gradient(to bottom, rgba(212,168,67,0.08), transparent)",
              transform: `rotate(${angle - 45}deg)`,
              opacity: 0.4 + i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Text content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ opacity }}
      >
        {/* Eyebrow */}
        <motion.p
          className="text-xs md:text-sm tracking-[0.5em] uppercase mb-6"
          style={{ color: "#d4a843" }}
          custom={0}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          ✦ A Love Story ✦
        </motion.p>

        {/* Main headline */}
        <motion.h1
          className="text-5xl md:text-8xl lg:text-9xl font-bold leading-tight mb-8"
          style={{
            fontFamily: "Georgia, serif",
            background: "linear-gradient(135deg, #d4a843, #ff6b9d, #ffffff, #d4a843)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 30px rgba(212,168,67,0.4))",
          }}
          custom={1}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Happy 7th Month
          <br />
          Anniversary ❤️
        </motion.h1>

        {/* Divider */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-400/60" />
          <span className="text-yellow-400/60 text-lg">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-400/60" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-2xl font-light text-white/80 leading-relaxed max-w-2xl mx-auto"
          style={{ fontFamily: "Georgia, serif" }}
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Eight beautiful months.
          <br />
          <span style={{ color: "#ff6b9d" }}>One incredible journey.</span>
          <br />
          A lifetime still ahead.
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          custom={5}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-white/30">Scroll to explore</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-yellow-400/60 to-transparent"
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
