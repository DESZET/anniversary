"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  show: boolean;
  onEnter: () => void;
}

export default function EnterOverlay({ show, onEnter }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          onClick={onEnter}
          style={{
            position: "fixed", inset: 0, zIndex: 9998,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "rgba(10,10,26,0.97)",
            cursor: "pointer",
          }}
        >
          {/* Stars background */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                width: (i % 3) + 1,
                height: (i % 3) + 1,
                borderRadius: "50%",
                background: i % 2 === 0 ? "#d4a843" : "#ff6b9d",
                left: `${(i * 37 + 11) % 100}%`,
                top: `${(i * 53 + 7) % 100}%`,
                opacity: ((i * 0.15) % 0.5) + 0.1,
                animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.2) % 3}s`,
              }} />
            ))}
          </div>

          {/* Heartbeat icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: "4rem", marginBottom: "2rem" }}
          >
            ❤️
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem, 5vw, 3rem)",
              fontWeight: 700, textAlign: "center",
              marginBottom: "0.75rem", padding: "0 1.5rem",
              background: "linear-gradient(135deg, #d4a843, #ff6b9d, #ffffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(212,168,67,0.4))",
            }}
          >
            Happy 7th Month Anniversary
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              color: "rgba(255,255,255,0.45)", fontSize: "1rem",
              marginBottom: "3rem", fontStyle: "italic",
              fontFamily: "Georgia, serif",
            }}
          >
            for you, always ❤️
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: "1rem 3rem", borderRadius: 99,
              background: "linear-gradient(135deg, #d4a843, #ff6b9d)",
              color: "white", fontWeight: 700,
              fontSize: "1.1rem", letterSpacing: "0.1em",
              boxShadow: "0 0 40px rgba(212,168,67,0.4), 0 0 80px rgba(255,107,157,0.2)",
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <span>♪</span>
            <span>Tap to Enter</span>
            <span>❤️</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              color: "rgba(255,255,255,0.2)", fontSize: "0.7rem",
              marginTop: "1.5rem", letterSpacing: "0.1em",
            }}
          >
            Music will play automatically
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
