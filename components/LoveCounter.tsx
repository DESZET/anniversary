"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

// Set your anniversary start date
const START_DATE = new Date("2016-06-11");

function getDiff() {
  const now = new Date();
  const diff = now.getTime() - START_DATE.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30.44);
  const years = 8;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return { days, months, years, hours };
}

const counters = [
  { label: "Years Together", getValue: () => getDiff().years, suffix: "", icon: "💍", color: "#d4a843" },
  { label: "Months Together", getValue: () => getDiff().months, suffix: "+", icon: "🗓️", color: "#ff6b9d" },
  { label: "Days of Love", getValue: () => getDiff().days, suffix: "+", icon: "☀️", color: "#f0c96a" },
  { label: "Hours of Memories", getValue: () => getDiff().hours, suffix: "+", icon: "⭐", color: "#ffb3cc" },
];

export default function LoveCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative overflow-hidden" id="counter">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(13,27,62,0.6) 0%, rgba(10,10,26,0.9) 70%)",
        }}
      />
      {/* Subtle stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: "#d4a843",
              opacity: Math.random() * 0.4 + 0.1,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: "#d4a843" }}>
            ✦ Our Journey In Numbers ✦
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
            A Lifetime of Moments
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {counters.map((item, i) => (
            <motion.div
              key={i}
              className="glass-gold rounded-3xl p-8 text-center relative overflow-hidden group"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              {/* Glow overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background: `radial-gradient(circle at center, ${item.color}15, transparent)`,
                }}
              />
              {/* Icon */}
              <div className="text-4xl mb-4">{item.icon}</div>
              {/* Number */}
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: item.color, textShadow: `0 0 20px ${item.color}60` }}
              >
                {inView ? (
                  <CountUp
                    start={0}
                    end={item.getValue()}
                    duration={2.5}
                    delay={i * 0.2}
                    separator=","
                    suffix={item.suffix}
                  />
                ) : (
                  "0"
                )}
              </div>
              {/* Label */}
              <p className="text-sm text-white/60 tracking-wider uppercase font-light">
                {item.label}
              </p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50"
                style={{ background: `linear-gradient(to right, transparent, ${item.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
