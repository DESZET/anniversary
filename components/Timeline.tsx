"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const months = [
  {
    label: "Month 1", date: "Nov 2024", title: "Where It All Began",
    description: "The first glances, the first smiles, the first moments that made our hearts race. This was the month everything changed — the month I found you.",
    milestone: "First Date", photos: ["/photos/photo-1.jpg", "/photos/photo-2.jpg", "/photos/photo-3.jpg"],
    color: "#d4a843", icon: "✨",
  },
  {
    label: "Month 2", date: "Dec 2024", title: "Growing Together",
    description: "Our roots began to intertwine. Adventures, late nights, and the discovery that every moment is better with you beside me.",
    milestone: "First Trip Together", photos: ["/photos/photo-7.jpg", "/photos/photo-8.jpg", "/photos/photo-9.jpg"],
    color: "#ff6b9d", icon: "🌍",
  },
  {
    label: "Month 3", date: "Jan 2025", title: "Deeper Bonds",
    description: "Through challenges and celebrations, we proved that love isn't just a feeling — it's a choice we make every single day.",
    milestone: "Getting Closer", photos: ["/photos/photo-13.jpg", "/photos/photo-14.jpg", "/photos/photo-15.jpg"],
    color: "#9b6eff", icon: "🏠",
  },
  {
    label: "Month 4", date: "Feb 2025", title: "Milestones Reached",
    description: "A month of achievements, hand in hand. Every success sweeter because you were there to share it.",
    milestone: "Valentine's Day ❤️", photos: ["/photos/photo-19.jpg", "/photos/photo-20.jpg", "/photos/photo-21.jpg"],
    color: "#f0c96a", icon: "💝",
  },
  {
    label: "Month 5", date: "Mar 2025", title: "Through Every Storm",
    description: "Through every challenge we stayed strong. Our love only grew deeper with every test.",
    milestone: "Stronger Than Ever", photos: ["/photos/photo-26.jpg", "/photos/photo-27.jpg", "/photos/photo-28.jpg"],
    color: "#4ecdc4", icon: "🌧️",
  },
  {
    label: "Month 6", date: "Apr 2025", title: "New Beginnings",
    description: "New chapters, new dreams, and the certainty that I want every new chapter to begin with you.",
    milestone: "Half Year Together", photos: ["/photos/photo-33.jpg", "/photos/photo-34.jpg", "/photos/photo-35.jpg"],
    color: "#ff8c42", icon: "🌅",
  },

  {
    label: "Month 7", date: "May 2025", title: "Seven Months of Magic",
    description: "Seven months of waking up grateful. Seven months of choosing you, and knowing you chose me. Here's to forever.",
    milestone: "7th Anniversary ❤️", photos: ["/photos/photo-48.jpg", "/photos/photo-50.jpg", "/photos/photo-54.jpg"],
    color: "#ff6b9d", icon: "❤️",
  },
];

function PhotoItem({ src, label }: { src: string; label: string }) {
  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden">
      <img src={src} alt={label} className="w-full h-full object-cover"
        style={{ filter: "brightness(0.85) saturate(1.1)" }} loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

function MonthCard({ item, i, activeMonth, setActiveMonth }: {
  item: typeof months[0]; i: number;
  activeMonth: number | null; setActiveMonth: (v: number | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isActive = activeMonth === i;

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Dot + connector */}
      <div className="flex flex-col items-center">
        <motion.div
          className="w-6 h-6 rounded-full flex items-center justify-center z-10 relative"
          style={{
            background: inView ? `linear-gradient(135deg, ${item.color}, #ff6b9d)` : "rgba(255,255,255,0.1)",
            border: `2px solid ${item.color}`,
            boxShadow: inView ? `0 0 16px ${item.color}80` : "none",
          }}
          animate={{ scale: inView ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="text-[10px]">{item.icon}</span>
        </motion.div>
        {i < months.length - 1 && (
          <motion.div
            className="w-px"
            style={{ background: `linear-gradient(to bottom, ${item.color}60, ${months[i + 1].color}30)` }}
            initial={{ height: 0 }}
            animate={inView ? { height: 40 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        )}
      </div>

      {/* Card — full centered */}
      <div
        className="w-full max-w-xl cursor-pointer rounded-2xl p-5 mt-3 relative overflow-hidden group text-center"
        style={{
          background: isActive ? `${item.color}10` : "rgba(255,255,255,0.04)",
          border: `1px solid ${isActive ? item.color + "70" : "rgba(255,255,255,0.08)"}`,
          boxShadow: isActive ? `0 0 30px ${item.color}20` : "none",
          transition: "all 0.3s ease",
        }}
        onClick={() => setActiveMonth(isActive ? null : i)}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{ background: `radial-gradient(circle at 50% 30%, ${item.color}12, transparent 70%)` }} />

        {/* Label */}
        <p className="text-xs tracking-[0.4em] uppercase font-medium mb-2" style={{ color: item.color }}>
          {item.icon} {item.label} · {item.date}
        </p>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold mb-2"
          style={{ fontFamily: "Georgia, serif", color: item.color }}>
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-white/55 text-sm leading-relaxed mb-3 max-w-md mx-auto">
          {item.description}
        </p>

        {/* Milestone badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
          style={{ background: `${item.color}15`, border: `1px solid ${item.color}35`, color: item.color }}>
          ✦ {item.milestone}
        </div>

        {/* Click hint */}
        <p className="text-white/20 text-[10px] mt-2 tracking-wider">
          {isActive ? "▲ close" : "▼ see photos"}
        </p>
      </div>

      {/* Photo grid — expands below card */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-2">
              {item.photos.map((src, pi) => (
                <PhotoItem key={pi} src={src} label={`${item.label} photo ${pi + 1}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Timeline() {
  const [activeMonth, setActiveMonth] = useState<number | null>(null);

  return (
    <section id="timeline" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #0a0a1a 0%, rgba(13,27,62,0.25) 50%, #0a0a1a 100%)" }} />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Heading */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: "#d4a843" }}>
            ✦ Our Love Story ✦
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-3"
            style={{
              fontFamily: "Georgia, serif",
              background: "linear-gradient(135deg, #d4a843, #ff6b9d)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
            7 Months of Magic
          </h2>
          <p className="text-white/45 text-sm">Click each month to see our memories</p>
        </motion.div>

        {/* Month selector pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {months.map((m, i) => (
            <motion.button key={i}
              onClick={() => setActiveMonth(activeMonth === i ? null : i)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: activeMonth === i ? `${m.color}25` : "rgba(255,255,255,0.05)",
                border: `1px solid ${activeMonth === i ? m.color : "rgba(255,255,255,0.1)"}`,
                color: activeMonth === i ? m.color : "rgba(255,255,255,0.5)",
                boxShadow: activeMonth === i ? `0 0 14px ${m.color}30` : "none",
              }}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              {m.icon} {m.label}
            </motion.button>
          ))}
        </div>

        {/* Timeline — single centered column */}
        <div className="flex flex-col items-center gap-0">
          {months.map((item, i) => (
            <MonthCard key={i} item={item} i={i} activeMonth={activeMonth} setActiveMonth={setActiveMonth} />
          ))}
        </div>
      </div>
    </section>
  );
}
