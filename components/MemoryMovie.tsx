"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const memories = [
  {
    caption: "It all started here...",
    sub: "The moment that changed everything",
    photo: "/photos/photo-4.jpg",
    align: "left",
    color: "#d4a843",
  },
  {
    caption: "Our first adventure...",
    sub: "Chasing horizons, discovering us",
    photo: "/photos/photo-10.jpg",
    align: "right",
    color: "#ff6b9d",
  },
  {
    caption: "The laughs...",
    sub: "The ones that made us cry",
    photo: "/photos/photo-17.jpg",
    align: "left",
    color: "#f0c96a",
  },
  {
    caption: "The quiet moments...",
    sub: "When words weren't needed",
    photo: "/photos/photo-29.jpg",
    align: "right",
    color: "#ffb3cc",
  },
  {
    caption: "The challenges...",
    sub: "That made us unbreakable",
    photo: "/photos/photo-36.jpg",
    align: "left",
    color: "#9b6eff",
  },
  {
    caption: "The victories...",
    sub: "Sweeter because we shared them",
    photo: "/photos/photo-44.jpg",
    align: "right",
    color: "#4ecdc4",
  },
  {
    caption: "The love that never faded...",
    sub: "Eight years and still burning bright",
    photo: "/photos/photo-52.jpg",
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const textX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    memory.align === "left" ? ["-5%", "0%", "5%"] : ["5%", "0%", "-5%"]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic full-bleed photo */}
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        <img
          src={memory.photo}
          alt={memory.caption}
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.5) saturate(1.15)" }}
          loading="lazy"
        />
      </motion.div>

      {/* Cinematic letterbox bars */}
      <div
        className="absolute top-0 inset-x-0 h-16 z-10"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-32 z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}
      />

      {/* Side gradient */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            memory.align === "left"
              ? "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
              : "linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
        }}
      />

      {/* Text overlay */}
      <motion.div
        className={`relative z-20 px-8 md:px-20 max-w-7xl mx-auto w-full flex ${
          memory.align === "right" ? "justify-end" : "justify-start"
        }`}
        style={{ x: textX, opacity }}
      >
        <div className={`max-w-lg ${memory.align === "right" ? "text-right" : "text-left"}`}>
          <p
            className="text-xs tracking-[0.5em] uppercase mb-4 opacity-70"
            style={{ color: memory.color }}
          >
            Chapter {index + 1}
          </p>

          <h2
            className="text-4xl md:text-6xl font-bold leading-tight mb-4"
            style={{
              fontFamily: "Georgia, serif",
              color: memory.color,
              textShadow: `0 0 40px ${memory.color}60`,
            }}
          >
            {memory.caption}
          </h2>

          <p
            className="text-lg md:text-xl text-white/70 font-light italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {memory.sub}
          </p>

          <div
            className={`mt-6 h-px w-24 ${memory.align === "right" ? "ml-auto" : ""}`}
            style={{
              background: `linear-gradient(${memory.align === "right" ? "to left" : "to right"}, ${memory.color}, transparent)`,
            }}
          />
        </div>
      </motion.div>

      {/* Chapter dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 opacity-50">
        {memories.map((_, j) => (
          <div
            key={j}
            className="rounded-full transition-all"
            style={{
              width: j === index ? "20px" : "6px",
              height: "6px",
              background: j === index ? memory.color : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function MemoryMovie() {
  return (
    <section id="memories" className="relative">
      {/* Section header */}
      <div className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: "#d4a843" }}>
            ✦ Memory Reel ✦
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold"
            style={{
              fontFamily: "Georgia, serif",
              background: "linear-gradient(135deg, #d4a843, #ff6b9d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Our Story Unfolds
          </h2>
          <p className="text-white/40 mt-3 italic" style={{ fontFamily: "Georgia, serif" }}>
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
