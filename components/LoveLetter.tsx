"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const LETTER_PARAGRAPHS = [
  "My Dearest Love,",
  "",
  "Seven months ago, the universe decided to weave our stories together — and every single day since, I have fallen more deeply in love with you than I thought humanly possible.",
  "",
  "You are the first thought in my morning and the last smile before I sleep. You are the reason ordinary moments feel extraordinary. The way you laugh, the way you care, the way you look at the world — I never want to stop watching you discover it.",
  "",
  "Through every high and every low, through every adventure and every quiet evening — you have been my home. Not a place. A person. You are where I belong.",
  "",
  "I think about the thousand small moments that don't make it into photos: the inside jokes that only we understand, the way we finish each other's thoughts, the silent understanding that passes between us in a crowded room. Those are the moments I treasure most.",
  "",
  "Seven months is just the beginning. I am so incredibly grateful for every single chapter of our story, and I cannot wait to write the ones yet to come — with you, always with you.",
  "",
  "Thank you for choosing me, every single day.",
  "",
  "Forever and always,",
  "With all my love ❤️",
];

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, text === "" ? 0 : 25);
    return () => clearTimeout(t);
  }, [started, displayed, text]);

  if (!text) return <span ref={ref} className="block h-4" />;

  return (
    <span ref={ref}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="animate-pulse" style={{ color: "#d4a843" }}>|</span>
      )}
    </span>
  );
}

export default function LoveLetter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="letter" className="py-24 px-6 relative overflow-hidden" ref={sectionRef}>
      {/* Ambient light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(26,20,8,0.8) 0%, rgba(10,10,26,0.95) 80%)",
        }}
      />

      {/* Floating candle-like glow orbs */}
      {[
        { top: "15%", left: "10%", size: 200, color: "212,168,67" },
        { top: "70%", right: "8%", size: 150, color: "255,107,157" },
        { top: "40%", left: "85%", size: 180, color: "212,168,67" },
      ].map((orb, i) => (
        <div
          key={i}
          className="absolute pointer-events-none animate-float"
          style={{
            top: orb.top,
            left: "left" in orb ? orb.left : undefined,
            right: "right" in orb ? (orb as typeof orb & { right: string }).right : undefined,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${orb.color},0.08) 0%, transparent 70%)`,
            filter: "blur(20px)",
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: "#d4a843" }}>
            ✦ From My Heart ✦
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{
              fontFamily: "Georgia, serif",
              background: "linear-gradient(135deg, #d4a843, #ff6b9d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            A Love Letter
          </h2>
        </motion.div>

        {/* Letter paper */}
        <motion.div
          className="letter-paper rounded-3xl p-8 md:p-12 relative"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(212,168,67,0.08) inset",
          }}
        >
          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 rounded-3xl opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.5) 27px, rgba(255,255,255,0.5) 28px)",
            }}
          />

          {/* Gold corner ornaments */}
          {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-8 h-8 opacity-30`}
              style={{
                borderTop: i < 2 ? "1px solid #d4a843" : "none",
                borderBottom: i >= 2 ? "1px solid #d4a843" : "none",
                borderLeft: i % 2 === 0 ? "1px solid #d4a843" : "none",
                borderRight: i % 2 === 1 ? "1px solid #d4a843" : "none",
              }}
            />
          ))}

          {/* Letter text */}
          <div
            className="relative z-10"
            style={{
              fontFamily: "'Georgia', serif",
              lineHeight: 1.9,
              color: "rgba(255,255,255,0.82)",
              fontSize: "1.05rem",
            }}
          >
            {LETTER_PARAGRAPHS.map((para, i) => (
              <p
                key={i}
                className={`${
                  i === 0 || i === LETTER_PARAGRAPHS.length - 2 || i === LETTER_PARAGRAPHS.length - 1
                    ? "font-semibold"
                    : "font-light"
                } ${i === LETTER_PARAGRAPHS.length - 2 || i === LETTER_PARAGRAPHS.length - 1 ? "text-right" : ""}`}
                style={{
                  color:
                    i === 0
                      ? "#d4a843"
                      : i >= LETTER_PARAGRAPHS.length - 2
                      ? "#ff6b9d"
                      : "rgba(255,255,255,0.82)",
                  textShadow:
                    i === 0 ? "0 0 20px rgba(212,168,67,0.4)" : "none",
                  marginBottom: para === "" ? "1rem" : "0",
                }}
              >
                <TypewriterText text={para} delay={i * 0.15} />
              </p>
            ))}
          </div>

          {/* Signature wax seal */}
          <div className="flex justify-center mt-10">
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{
                background: "linear-gradient(135deg, #d4a843, #c0392b)",
                boxShadow: "0 0 30px rgba(212,168,67,0.4), 0 4px 20px rgba(0,0,0,0.5)",
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              ❤️
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
