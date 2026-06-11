"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  externalAudio?: React.RefObject<HTMLAudioElement | null>;
}

export default function MusicPlayer({ externalAudio }: Props) {
  const [playing, setPlaying] = useState(true); // sudah playing dari enter screen
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(20).fill(0.5));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const isSetup = useRef(false);

  // Gunakan audio dari luar (sudah diplay saat enter)
  const getAudio = () => externalAudio?.current ?? null;

  // Setup Web Audio untuk visualizer
  const setupAnalyser = () => {
    if (isSetup.current) return;
    const audio = getAudio();
    if (!audio) return;
    try {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      ctxRef.current = ctx;
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      isSetup.current = true;
      startVisualizer();
    } catch (e) {
      console.warn("Audio setup:", e);
    }
  };

  const startVisualizer = () => {
    cancelAnimationFrame(rafRef.current);
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const step = Math.floor(data.length / 20);
      setBars(Array.from({ length: 20 }, (_, i) => (data[i * step] || 0) / 255));
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  // Setup visualizer setelah komponen mount
  useEffect(() => {
    const t = setTimeout(() => setupAnalyser(), 500);
    return () => clearTimeout(t);
  }, []);

  // Simulated bars saat visualizer belum setup
  useEffect(() => {
    if (analyserRef.current) return;
    const t = setInterval(() => {
      setBars(Array.from({ length: 20 }, () => Math.random() * (playing ? 0.9 : 0.2) + 0.05));
    }, 120);
    return () => clearInterval(t);
  }, [playing]);

  const togglePlay = async () => {
    const audio = getAudio();
    if (!audio) return;
    if (playing) {
      audio.pause();
      cancelAnimationFrame(rafRef.current);
      setPlaying(false);
    } else {
      setupAnalyser();
      try {
        if (ctxRef.current?.state === "suspended") await ctxRef.current.resume();
        await audio.play();
        setPlaying(true);
        startVisualizer();
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
      style={{ position: "fixed", bottom: 24, left: 24, zIndex: 50, display: "flex", alignItems: "center", gap: 12 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="glass glow-gold" style={{ borderRadius: 16, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>

        {/* Play / Pause */}
        <button onClick={togglePlay}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #d4a843, #ff6b9d)",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <rect x="2" y="1" width="4" height="12" rx="1.5" />
              <rect x="8" y="1" width="4" height="12" rx="1.5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <path d="M3 1.5L12 7L3 12.5V1.5Z" />
            </svg>
          )}
        </button>

        {/* Visualizer bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 24, width: 64 }}>
          {bars.map((h, i) => (
            <motion.div key={i}
              style={{
                flex: 1, borderRadius: 2,
                background: "linear-gradient(to top, #d4a843, #ff6b9d)",
                opacity: playing ? 0.95 : 0.2,
                minHeight: 3,
              }}
              animate={{ height: `${Math.max(3, h * 24)}px` }}
              transition={{ duration: 0.08, ease: "linear" }}
            />
          ))}
        </div>

        {/* Song name */}
        <div style={{ display: "none" }} className="md:block">
          <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Now Playing</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(240,200,106,0.8)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Kamu Cantik
          </div>
        </div>

        {/* Volume */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowVolume(!showVolume)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(212,168,67,0.7)", padding: 4 }}
            title="Volume"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2V5.5z" fill="currentColor" stroke="none" />
              {volume > 0.3 && <path d="M10 5a3 3 0 010 6" />}
              {volume > 0.6 && <path d="M12 3a6 6 0 010 10" />}
            </svg>
          </button>
          <AnimatePresence>
            {showVolume && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 8 }}
                className="glass"
                style={{ position: "absolute", bottom: 44, left: "50%", transform: "translateX(-50%)", borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
              >
                <input type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  style={{ writingMode: "vertical-lr" as React.CSSProperties["writingMode"], direction: "rtl", height: 80, cursor: "pointer", accentColor: "#d4a843" }}
                />
                <span style={{ fontSize: "0.7rem", color: "#d4a843" }}>{Math.round(volume * 100)}%</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Playing indicator */}
      {playing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6b9d", animation: "pulse-glow 1.5s ease-in-out infinite" }} />
          <span className="hidden md:block">♪ Lyla</span>
        </motion.div>
      )}
    </motion.div>
  );
}
