"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 54 foto tersedia
const PHOTOS = Array.from({ length: 54 }, (_, i) => ({
  id: i,
  src: `/photos/photo-${i + 1}.jpg`,
  label: [
    "First Adventure", "Summer Vibes", "City Lights", "Cozy Moments",
    "Golden Hour", "Sweet Memories", "Together Always", "Midnight Magic",
    "Laughter & Love", "Beach Bliss", "Mountain High", "Autumn Walk",
    "Home Is You", "Dancing Stars", "Forever Smiles", "Pure Joy",
    "Best Friend", "My Everything", "Endless Love", "Happy Days",
    "Our World", "Timeless", "Heart Full", "Golden Memories", "Forever Us",
    "Just Us Two", "Morning Light", "Chasing Sunsets", "Silly Moments",
    "Deep Talks", "Warm Hugs", "Road Trips", "Coffee & You",
    "Rainy Days", "Stargazing", "Hand in Hand", "Secret Smiles",
    "Long Walks", "Our Song", "Favorite Feeling", "Always You",
    "Still Falling", "Every Day", "Side by Side", "Never Letting Go",
    "Trust & Love", "Growing Up Together", "Making Memories",
    "Our Happy Place", "Perfectly Us", "Worth Every Moment",
    "Eight Years", "Grateful Hearts", "Infinite Love",
  ][i],
}));

interface CardProps {
  photo: typeof PHOTOS[0];
  index: number;
  onClick: () => void;
  mouseX: number;
  mouseY: number;
}

function FloatingCard({ photo, index, onClick, mouseX, mouseY }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const getTransform = () => {
    if (!ref.current) return {};
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (mouseX - cx) / window.innerWidth;
    const dy = (mouseY - cy) / window.innerHeight;
    return {
      rotateY: dx * 12,
      rotateX: -dy * 12,
    };
  };

  // Stagger float animation offset
  const floatDelay = index * 0.4;
  const floatDuration = 3 + (index % 3);

  return (
    <motion.div
      ref={ref}
      className="relative cursor-pointer group"
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      initial={{ opacity: 0, scale: 0.6, y: 80 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      animate={{
        y: [0, -12, 0, -6, 0],
        ...getTransform(),
      }}
      whileHover={{ scale: 1.08, zIndex: 20 }}
      onClick={onClick}
    >
      {/* Glass card */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
        }}
      >
        {/* Photo */}
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img
            src={photo.src}
            alt={photo.label}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ filter: "brightness(0.85) saturate(1.1)" }}
            loading="lazy"
          />
        </div>

        {/* Reflection effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
          }}
        />

        {/* Label overlay on hover */}
        <motion.div
          className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
          }}
        >
          <p className="text-xs text-white/80 text-center tracking-wider">{photo.label}</p>
        </motion.div>
      </div>

      {/* Depth shadow */}
      <div
        className="absolute inset-0 rounded-2xl -z-10 opacity-0 group-hover:opacity-60 transition-opacity duration-500"
        style={{
          background: "rgba(0,0,0,0.4)",
          filter: "blur(20px)",
          transform: "translateY(10px) scale(0.95)",
        }}
      />
    </motion.div>
  );
}

export default function PhotoGallery() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (selected === null) return;
    if (e.key === "Escape") setSelected(null);
    if (e.key === "ArrowRight") setSelected((s) => s !== null ? Math.min(s + 1, PHOTOS.length - 1) : null);
    if (e.key === "ArrowLeft") setSelected((s) => s !== null ? Math.max(s - 1, 0) : null);
  }, [selected]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <section id="gallery" className="py-24 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(212,168,67,0.05) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,107,157,0.05) 0%, transparent 60%), #0a0a1a",
        }}
      />

      <div className="relative z-10 max-w-8xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: "#d4a843" }}>
            ✦ Our Gallery ✦
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
            Frozen Moments
          </h2>
          <p className="text-white/40 mt-3 text-sm">Hover · Click · Explore</p>
        </motion.div>

        {/* 3D perspective gallery */}
        <div
          style={{ perspective: "2000px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {PHOTOS.map((photo, i) => (
            <FloatingCard
              key={photo.id}
              photo={photo}
              index={i}
              onClick={() => setSelected(i)}
              mouseX={mousePos.x}
              mouseY={mousePos.y}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)" }}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] w-full mx-6"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo */}
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden"
                style={{
                  boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
                  border: "1px solid rgba(212,168,67,0.2)",
                }}
              >
                <img
                  src={PHOTOS[selected].src}
                  alt={PHOTOS[selected].label}
                  className="w-full h-full object-contain bg-black/80"
                  loading="lazy"
                />
              </div>

              {/* Label */}
              <div className="text-center mt-4">
                <p className="text-xl font-light text-white/80" style={{ fontFamily: "Georgia, serif" }}>
                  {PHOTOS[selected].label}
                </p>
              </div>

              {/* Nav arrows — inside modal, not outside */}
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors disabled:opacity-20"
                  disabled={selected === 0}
                  onClick={(e) => { e.stopPropagation(); setSelected((s) => s !== null ? Math.max(s - 1, 0) : s); }}
                >←</button>
                <span className="text-white/40 text-sm">{selected + 1} / {PHOTOS.length}</span>
                <button
                  className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors disabled:opacity-20"
                  disabled={selected === PHOTOS.length - 1}
                  onClick={(e) => { e.stopPropagation(); setSelected((s) => s !== null ? Math.min(s + 1, PHOTOS.length - 1) : s); }}
                >→</button>
              </div>

              {/* Close */}
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
