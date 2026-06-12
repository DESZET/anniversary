"use client";
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─────────────────────────────────────────────
// photo          → file foto background
// video          → (opsional) file video — kalau ada, tampil video
// objectPosition → posisi foto: "center top", "center 20%", dll
// scale          → zoom: 1.0=normal, 0.8=zoom out, 1.3=zoom in
// ─────────────────────────────────────────────
const memories = [
  {
    caption: "It all started here...",
    sub: "The moment that changed everything",
    photo: "/photos/photo-4.jpg",
    video: "/videos/video2.mp4", 
    objectPosition: "center center",
    scale: 1.0,
    align: "left",
    color: "#d4a843",
  },
  {
    caption: "Our first adventure...",
    sub: "Chasing horizons, discovering us",
    photo: "/photos/photo-4.jpg",
    video: "",
    objectPosition: "center 15%",
    scale: 1.0,
    align: "right",
    color: "#ff6b9d",
  },
  {
    caption: "The laughs...",
    sub: "The ones that made us cry",
    photo: "/photos/photo-17.jpg",
    video: "",
    objectPosition: "center center",
    scale: 1.0,
    align: "left",
    color: "#f0c96a",
  },
  {
    caption: "The quiet moments...",
    sub: "When words weren't needed",
    photo: "/photos/photo-20.jpg",
    video: "",
    objectPosition: "center center",
    scale: 1.0,
    align: "right",
    color: "#ffb3cc",
  },
  {
    caption: "The challenges...",
    sub: "That made us unbreakable",
    photo: "/photos/photo-44.jpg",
    video: "",
    objectPosition: "center 20%",
    scale: 1.0,
    align: "left",
    color: "#9b6eff",
  },
  // ── 2 slide terakhir pakai VIDEO ──
  {
    caption: "The victories...",
    sub: "Sweeter because we shared them",
    photo: "/photos/photo-36.jpg",
    video: "/videos/video4.mp4",   // ← ganti nama video sesuai file kamu
    objectPosition: "center center",
    scale: 1.0,
    align: "right",
    color: "#4ecdc4",
  },
  {
    caption: "The love that never faded...",
    sub: "Seven months and still burning bright",
    photo: "/photos/photo-52.jpg",
    video: "/videos/video3.mp4",   // ← ganti nama video sesuai file kamu
    objectPosition: "center center",
    scale: 1.0,
    align: "left",
    color: "#ff6b9d",
  },
];

function MemorySlide({
  memory,
  index,
}: {
  memory: (typeof memories)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const textX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    memory.align === "left" ? ["-5%", "0%", "5%"] : ["5%", "0%", "-5%"]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const isVideo = !!memory.video;

  // Auto play/pause video saat masuk/keluar viewport
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVideo]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative", height: "100svh",
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── BACKGROUND MEDIA ── */}
      <motion.div style={{ position: "absolute", inset: 0, y }}>
        {isVideo ? (
          <>
            {/* Blur backdrop dari foto */}
            <img
              src={memory.photo}
              alt=""
              aria-hidden
              style={{
                position: "absolute", width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
                filter: "brightness(0.2) blur(30px) saturate(1.2)",
                transform: "scale(1.1)",
              }}
            />
            {/* Video utama */}
            <video
              ref={videoRef}
              src={memory.video}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              preload="metadata"
              style={{
                position: "relative",
                width: "100%", height: "100%",
                objectFit: "contain",
                objectPosition: "center center",
                filter: "brightness(0.7) saturate(1.1)",
                zIndex: 1,
              }}
            />
          </>
        ) : (
          <>
            {/* Blur backdrop */}
            <img
              src={memory.photo}
              alt=""
              aria-hidden
              style={{
                position: "absolute", width: "100%", height: "100%",
                objectFit: "cover", objectPosition: memory.objectPosition,
                filter: "brightness(0.25) blur(20px) saturate(1.2)",
                transform: "scale(1.1)",
              }}
            />
            {/* Foto utama — contain supaya badan full keliatan */}
            <img
              src={memory.photo}
              alt={memory.caption}
              style={{
                position: "relative",
                width: "100%", height: "100%",
                objectFit: "contain",
                objectPosition: memory.objectPosition,
                filter: "brightness(0.6) saturate(1.15)",
                zIndex: 1,
              }}
              loading="lazy"
            />
          </>
        )}
      </motion.div>

      {/* Letterbox top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 64, zIndex: 10, background: "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)" }} />
      {/* Letterbox bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 140, zIndex: 10, background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }} />
      {/* Side gradient */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        background: memory.align === "left"
          ? "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
          : "linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
      }} />

      {/* Text overlay */}
      <motion.div style={{
        position: "relative", zIndex: 20,
        padding: "0 2rem",
        width: "100%", maxWidth: 1280, margin: "0 auto",
        display: "flex",
        justifyContent: memory.align === "right" ? "flex-end" : "flex-start",
        x: textX, opacity,
      }}>
        <div style={{ maxWidth: 520, textAlign: memory.align === "right" ? "right" : "left" }}>
          {/* Video badge */}
          {isVideo && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 99, marginBottom: 12,
              background: `${memory.color}25`, border: `1px solid ${memory.color}50`,
              fontSize: "0.65rem", letterSpacing: "0.1em", color: memory.color,
            }}>
              ▶ VIDEO
            </div>
          )}
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "1rem", opacity: 0.7, color: memory.color }}>
            Chapter {index + 1}
          </p>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700, lineHeight: 1.2, marginBottom: "1rem",
            color: memory.color, textShadow: `0 0 40px ${memory.color}60`,
          }}>
            {memory.caption}
          </h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
            {memory.sub}
          </p>
          <div style={{
            marginTop: "1.5rem", height: 1, width: 96,
            marginLeft: memory.align === "right" ? "auto" : 0,
            background: `linear-gradient(to right, transparent, ${memory.color}, transparent)`,
          }} />
        </div>
      </motion.div>

      {/* Chapter dots */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: 6, opacity: 0.5 }}>
        {memories.map((_, j) => (
          <div key={j} style={{
            borderRadius: 99, transition: "all 0.3s",
            width: j === index ? 20 : 6, height: 6,
            background: j === index ? memory.color : "rgba(255,255,255,0.3)",
          }} />
        ))}
      </div>
    </div>
  );
}

export default function MemoryMovie() {
  return (
    <section id="memories" style={{ position: "relative", width: "100%" }}>
      <div style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "1rem", color: "#d4a843" }}>
            ✦ Memory Reel ✦
          </p>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700,
            background: "linear-gradient(135deg, #d4a843, #ff6b9d)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Our Story Unfolds
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.75rem", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
            Scroll through our cinematic journey
          </p>
        </motion.div>
      </div>

      {memories.map((memory, i) => (
        <MemorySlide key={i} memory={memory} index={i} />
      ))}
    </section>
  );
}
