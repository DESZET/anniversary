"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onBeat?: (level: number) => void;
}

export default function MusicPlayer({ onBeat }: Props) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(20).fill(0.15));
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const isSetup = useRef(false);

  // Setup Web Audio context (called once)
  const setupAudio = useCallback(() => {
    if (isSetup.current || !audioRef.current) return;
    isSetup.current = true;
    try {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      ctxRef.current = ctx;
      const source = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);
      analyser.connect(ctx.destination);
    } catch (e) {
      console.warn("Audio setup failed:", e);
    }
  }, []);

  // Visualizer loop
  const startVisualizer = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const step = Math.floor(data.length / 20);
      const newBars = Array.from({ length: 20 }, (_, i) => (data[i * step] || 0) / 255);
      setBars(newBars);
      if (onBeat) {
        const avg = newBars.reduce((a, b) => a + b, 0) / newBars.length;
        onBeat(avg);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, [onBeat]);

  // Simulated bars when paused
  useEffect(() => {
    if (playing) return;
    const t = setInterval(() => {
      setBars(Array.from({ length: 20 }, () => Math.random() * 0.25 + 0.05));
    }, 300);
    return () => clearInterval(t);
  }, [playing]);

  // Auto-attempt play on first user interaction with the page
  useEffect(() => {
    if (autoplayAttempted) return;
    const tryPlay = async () => {
      if (!audioRef.current || playing) return;
      setAutoplayAttempted(true);
      setupAudio();
      try {
        if (ctxRef.current?.state === "suspended") {
          await ctxRef.current.resume();
        }
        await audioRef.current.play();
        setPlaying(true);
        startVisualizer();
      } catch {
        // Autoplay blocked by browser policy — user must click play manually
      }
    };

    const events = ["click", "touchstart", "keydown", "scroll"];
    const handler = () => {
      tryPlay();
      events.forEach((e) => window.removeEventListener(e, handler));
    };
    events.forEach((e) => window.addEventListener(e, handler, { once: false, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handler));
  }, [autoplayAttempted, playing, setupAudio, startVisualizer]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      cancelAnimationFrame(rafRef.current);
      setBars(Array(20).fill(0.15));
      setPlaying(false);
    } else {
      setupAudio();
      try {
        if (ctxRef.current?.state === "suspended") {
          await ctxRef.current.resume();
        }
        await audioRef.current.play();
        setPlaying(true);
        startVisualizer();
      } catch (e) {
        console.warn("Play failed:", e);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/music/song.mp3"
      />

      <motion.div
        className="fixed bottom-6 left-6 z-50 flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 glow-gold">
          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{ background: "linear-gradient(135deg, #d4a843, #ff6b9d)" }}
            title={playing ? "Pause music" : "Play music"}
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
          <div className="flex items-end gap-[2px] h-6 w-16">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  background: "linear-gradient(to top, #d4a843, #ff6b9d)",
                  opacity: playing ? 0.95 : 0.25,
                  minHeight: "3px",
                }}
                animate={{ height: `${Math.max(3, h * 24)}px` }}
                transition={{ duration: 0.08, ease: "linear" }}
              />
            ))}
          </div>

          {/* Song title */}
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Now Playing</span>
            <span className="text-xs text-yellow-300/80 truncate max-w-[100px]">Kamu Cantik</span>
          </div>

          {/* Volume control */}
          <div className="relative">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className="text-yellow-400/70 hover:text-yellow-300 transition-colors p-1"
              title="Volume"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2V5.5z" fill="currentColor" stroke="none" />
                {volume > 0.5 && <path d="M10.5 3.5a6 6 0 010 9" />}
                {volume > 0 && <path d="M9 5.5a3 3 0 010 5" />}
              </svg>
            </button>

            <AnimatePresence>
              {showVolume && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 8 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 glass rounded-2xl p-3 flex flex-col items-center gap-2 shadow-xl"
                  style={{ border: "1px solid rgba(212,168,67,0.2)" }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="cursor-pointer"
                    style={{
                      writingMode: "vertical-lr" as React.CSSProperties["writingMode"],
                      direction: "rtl",
                      height: "80px",
                      accentColor: "#d4a843",
                    }}
                  />
                  <span className="text-xs text-yellow-400">{Math.round(volume * 100)}%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Playing indicator */}
        {playing && (
          <motion.div
            className="flex items-center gap-1.5 text-xs text-white/30 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            <span className="hidden md:block">♪ Lyla</span>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
