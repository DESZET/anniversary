"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const years = [
  {
    year: "Year 1", date: "2016", title: "Where It All Began",
    description: "The first glances, the first smiles, the first moments that made our hearts race. This was the year everything changed — the year I found you.",
    milestone: "First Date", photos: ["/photos/photo-1.jpg", "/photos/photo-2.jpg", "/photos/photo-3.jpg"],
    color: "#d4a843", icon: "✨",
  },
  {
    year: "Year 2", date: "2017", title: "Growing Together",
    description: "Our roots began to intertwine. Adventures, late nights, and the discovery that every moment is better with you beside me.",
    milestone: "First Trip Together", photos: ["/photos/photo-7.jpg", "/photos/photo-8.jpg", "/photos/photo-9.jpg"],
    color: "#ff6b9d", icon: "🌍",
  },
  {
    year: "Year 3", date: "2018", title: "Deeper Bonds",
    description: "Through challenges and celebrations, we proved that love isn't just a feeling — it's a choice we make every single day.",
    milestone: "Moved In Together", photos: ["/photos/photo-13.jpg", "/photos/photo-14.jpg", "/photos/photo-15.jpg"],
    color: "#9b6eff", icon: "🏠",
  },
  {
    year: "Year 4", date: "2019", title: "Milestones Reached",
    description: "A year of achievements, hand in hand. Every success sweeter because you were there to share it.",
    milestone: "Major Milestone", photos: ["/photos/photo-19.jpg", "/photos/photo-20.jpg", "/photos/photo-21.jpg"],
    color: "#f0c96a", icon: "🏆",
  },
  {
    year: "Year 5", date: "2020", title: "Through The Storm",
    description: "The world changed, but we didn't. Locked in with you was the greatest adventure of my life.",
    milestone: "Stronger Than Ever", photos: ["/photos/photo-26.jpg", "/photos/photo-27.jpg", "/photos/photo-28.jpg"],
    color: "#4ecdc4", icon: "🌧️",
  },
  {
    year: "Year 6", date: "2021", title: "New Beginnings",
    description: "Emerging into a new world, hand in hand. New chapters, new dreams, and the certainty that I want every new chapter to begin with you.",
    milestone: "New Adventures", photos: ["/photos/photo-33.jpg", "/photos/photo-34.jpg", "/photos/photo-35.jpg"],
    color: "#ff8c42", icon: "🌅",
  },
  {
    year: "Year 7", date: "2022", title: "Dreams Come True",
    description: "The year our dreams started becoming reality. Every goal feels achievable when you're my partner.",
    milestone: "Dreams Realized", photos: ["/photos/photo-40.jpg", "/photos/photo-41.jpg", "/photos/photo-42.jpg"],
    color: "#a8e6cf", icon: "🌠",
  },
  {
    year: "Year 8", date: "2024", title: "Eight Years of Magic",
    description: "Eight years of waking up grateful. Eight years of choosing you, and knowing you chose me.",
    milestone: "8th Anniversary ❤️", photos: ["/photos/photo-48.jpg", "/photos/photo-50.jpg", "/photos/photo-54.jpg"],
    color: "#ff6b9d", icon: "❤️",
  },
];

function PhotoItem({ src, label }: { src: string; label: string }) {
  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden">
      <img
        src={src}
        alt={label}
        className="w-full h-full object-cover"
        style={{ filter: "brightness(0.85) saturate(1.1)" }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

// Extracted as its own component so hooks are called at the top level
function YearItem({
  item,
  i,
  activeYear,
  setActiveYear,
}: {
  item: (typeof years)[0];
  i: number;
  activeYear: number | null;
  setActiveYear: (v: number | null) => void;
}) {
  const isLeft = i % 2 === 0;
  const isActive = activeYear === i;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div key={i} ref={ref} className="relative">
      {/* Timeline dot */}
      <motion.div
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-8 w-5 h-5 rounded-full items-center justify-center z-10"
        style={{
          background: isActive ? `linear-gradient(135deg, ${item.color}, #ff6b9d)` : "rgba(255,255,255,0.1)",
          border: `2px solid ${isActive ? item.color : "rgba(255,255,255,0.2)"}`,
          boxShadow: isActive ? `0 0 20px ${item.color}80` : "none",
        }}
        animate={{ scale: inView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      <div className={`md:grid md:grid-cols-2 md:gap-12`}>
        {/* Content */}
        <motion.div
          className={`${isLeft ? "md:text-right md:pr-12" : "md:col-start-2 md:pl-12"}`}
          initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className="glass rounded-2xl p-6 cursor-pointer relative overflow-hidden group"
            style={{
              border: `1px solid ${isActive ? item.color + "60" : "rgba(255,255,255,0.08)"}`,
              background: isActive ? `${item.color}08` : "rgba(255,255,255,0.03)",
            }}
            onClick={() => setActiveYear(isActive ? null : i)}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
              style={{ background: `radial-gradient(circle at 50% 50%, ${item.color}10, transparent)` }}
            />

            <div className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: item.color }}>
                {item.year} · {item.date}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: item.color }}>
              {item.title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">{item.description}</p>

            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
              style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}
            >
              ✦ {item.milestone}
            </div>
          </div>
        </motion.div>

        {/* Photos */}
        <motion.div
          className={`hidden md:block ${isLeft ? "md:col-start-2 md:pl-12" : "md:col-start-1 md:row-start-1 md:pr-12"}`}
          initial={{ opacity: 0, x: isLeft ? 60 : -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-3 gap-2 overflow-hidden"
              >
                {item.photos.map((src, pi) => (
                  <PhotoItem key={pi} src={src} label={`${item.year} memory ${pi + 1}`} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {!isActive && (
            <div className="grid grid-cols-3 gap-2 opacity-20">
              {item.photos.map((src, pi) => (
                <PhotoItem key={pi} src={src} label={`${item.year} memory ${pi + 1}`} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function Timeline() {
  const [activeYear, setActiveYear] = useState<number | null>(null);

  return (
    <section id="timeline" className="py-24 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #0a0a1a 0%, rgba(13,27,62,0.3) 50%, #0a0a1a 100%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: "#d4a843" }}>
            ✦ Our Love Story ✦
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
            Eight Chapters
          </h2>
          <p className="text-white/50 mt-4 text-lg">Click each year to relive the memory</p>
        </motion.div>

        {/* Year selector buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {years.map((y, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveYear(activeYear === i ? null : i)}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeYear === i ? `linear-gradient(135deg, ${y.color}30, ${y.color}20)` : "rgba(255,255,255,0.05)",
                border: `1px solid ${activeYear === i ? y.color : "rgba(255,255,255,0.1)"}`,
                color: activeYear === i ? y.color : "rgba(255,255,255,0.6)",
                boxShadow: activeYear === i ? `0 0 20px ${y.color}30` : "none",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {y.icon} {y.year}
            </motion.button>
          ))}
        </div>

        {/* Timeline items */}
        <div className="relative">
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(212,168,67,0.3), rgba(255,107,157,0.3), transparent)" }}
          />
          <div className="flex flex-col gap-16">
            {years.map((item, i) => (
              <YearItem key={i} item={item} i={i} activeYear={activeYear} setActiveYear={setActiveYear} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
