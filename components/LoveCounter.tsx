"use client";
import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

const START_DATE = new Date("2025-10-12");

function getDiff() {
  const now = new Date();
  const diff = now.getTime() - START_DATE.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30.44);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return { days, months, hours, minutes: Math.floor(hours * 60) };
}

const counters = [
  { label: "Months Together", getValue: () => getDiff().months, suffix: "", icon: "🗓️", color: "#d4a843" },
  { label: "Days of Love", getValue: () => getDiff().days, suffix: "+", icon: "☀️", color: "#ff6b9d" },
  { label: "Hours of Memories", getValue: () => getDiff().hours, suffix: "+", icon: "⭐", color: "#f0c96a" },
  { label: "Moments Together", getValue: () => getDiff().minutes, suffix: "+", icon: "💛", color: "#ffb3cc" },
];

export default function LoveCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const stars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 53 + 7) % 100}%`,
      opacity: ((i * 0.17) % 0.4) + 0.1,
      delay: `${(i * 0.23) % 3}s`,
    })), []);

  return (
    <section id="counter" style={{ width: "100%", padding: "8rem 1.5rem", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(13,27,62,0.6) 0%, rgba(10,10,26,0.9) 70%)",
      }} />
      {/* Stars */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {stars.map((s) => (
          <div key={s.id} className="animate-twinkle" style={{
            position: "absolute", width: 4, height: 4, borderRadius: "50%",
            left: s.left, top: s.top, background: "#d4a843",
            opacity: s.opacity, animationDelay: s.delay,
          }} />
        ))}
      </div>

      <div ref={ref} style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        {/* Heading */}
        <motion.div style={{ textAlign: "center", marginBottom: "4rem" }}
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "1rem", color: "#d4a843" }}>
            ✦ Our Journey In Numbers ✦
          </p>
          <h2 style={{
            fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700,
            background: "linear-gradient(135deg, #d4a843, #ff6b9d)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            7 Months of Moments
          </h2>
        </motion.div>

        {/* Counter grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
          {counters.map((item, i) => (
            <motion.div key={i}
              style={{
                background: "rgba(212,168,67,0.08)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(212,168,67,0.2)", borderRadius: "1.5rem",
                padding: "2rem 1.5rem", textAlign: "center", position: "relative", overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{item.icon}</div>
              <div style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, marginBottom: "0.5rem", color: item.color, textShadow: `0 0 20px ${item.color}60` }}>
                {inView ? (
                  <CountUp start={0} end={item.getValue()} duration={2.5} delay={i * 0.2} separator="," suffix={item.suffix} />
                ) : "0"}
              </div>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {item.label}
              </p>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${item.color}, transparent)`, opacity: 0.5 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
