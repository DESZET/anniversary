"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  externalAudio?: React.RefObject<HTMLAudioElement | null>;
}

export default function MusicPlayer({ externalAudio }: Props) {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(20).fill(0.4));
  const rafRef = useRef<number>(0);

  const getAudio = () => externalAudio?.current ?? null;

  // Simulated visualizer — tidak pakai Web Audio API supaya tidak ada grasak-gresek
  useEffect(() => {
    const tick = () => {
      if (playing) {
        setBars(Array.from({ length: 20 }, (_, i) => {
          const base = 0.3 + Math.sin(Date.now() / 300 + i * 0.7) * 0.25;
          const rand = Math.random() * 0.2;
          return Math.max(0.1, Math.min(1, base + rand));
        }));
      } else {
        setBars(Array(20).fill(0.12));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const togglePlay = async () => {
    const audio = getAudio();
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {
        console.warn("Play failed:", e);
      }
    }
  };

  useEffect(() => {
    const audio = getAudio();
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <motion.div
      style={{ position: "fixed", bottom: 16, left: 16, zIndex: 50, display: "flex", alignItems: "center", gap: 8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="glass glow-gold" style={{ borderRadius: 14, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10 }}>

        {/* Play / Pause */}
        <button onClick={togglePlay}
          style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #d4a843, #ff6b9d)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
              <rect x="1.5" y="1" width="3.5" height="10" rx="1.5" />
              <rect x="7" y="1" width="3.5" height="10" rx="1.5" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
              <path d="M2.5 1.5L11 6L2.5 10.5V1.5Z" />
            </svg>
          )}
        </button>

        {/* Visualizer bars — smooth sine wave */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 22, width: 60 }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: 2,
              background: "linear-gradient(to top, #d4a843, #ff6b9d)",
              height: `${Math.max(3, h * 22)}px`,
              opacity: playing ? 0.9 : 0.2,
              transition: "height 0.15s ease",
            }} />
          ))}
        </div>

        {/* Volume button */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowVolume(!showVolume)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(212,168,67,0.75)", padding: 4, display: "flex" }}
            title="Volume"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 5h2.5L7.5 2v11L4.5 10H2V5z" fill="currentColor" stroke="none" />
              {volume > 0.3 && <path d="M9.5 4.5a3 3 0 010 6" />}
              {volume > 0.65 && <path d="M11.5 2.5a6 6 0 010 10" />}
            </svg>
          </button>

          <AnimatePresence>
            {showVolume && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 6 }}
                className="glass"
                style={{
                  position: "absolute", bottom: 46, left: "50%", transform: "translateX(-50%)",
                  borderRadius: 12, padding: "10px 8px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  minWidth: 40,
                }}
              >
                <input type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  style={{
                    writingMode: "vertical-lr" as React.CSSProperties["writingMode"],
                    direction: "rtl", height: 72, cursor: "pointer", accentColor: "#d4a843",
                  }}
                />
                <span style={{ fontSize: "0.65rem", color: "#d4a843" }}>{Math.round(volume * 100)}%</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Playing dot */}
      {playing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%", background: "#ff6b9d",
            animation: "pulse-glow 1.5s ease-in-out infinite", flexShrink: 0,
          }} />
        </motion.div>
      )}
    </motion.div>
  );
}
