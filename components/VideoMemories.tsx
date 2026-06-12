"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

const videos = [
  { id: 1, title: "Our First Chapter", sub: "The Beginning", duration: "∞", year: "2016", color: "#d4a843", src: "/videos/video1.mp4" },
  { id: 2, title: "Adventures Together", sub: "Road Trips & Discoveries", duration: "∞", year: "2017–18", color: "#ff6b9d", src: "/videos/video2.mp4" },
  { id: 3, title: "Laughter & Light", sub: "The Bright Moments", duration: "∞", year: "2019–20", color: "#9b6eff", src: "/videos/video3.mp4" },
  { id: 4, title: "Unbreakable", sub: "Through Every Storm", duration: "∞", year: "2021–22", color: "#4ecdc4", src: "/videos/video4.mp4" },
  { id: 5, title: "Eight Beautiful Years", sub: "A Love Story", duration: "∞", year: "2024", color: "#f0c96a", src: "/videos/video5.mp4" },
];

function VideoCard({ video, index }: { video: typeof videos[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  // Pastikan muted selalu true via property (iOS Safari fix)
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  const playVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = true; // force muted sebelum play
    videoRef.current.play().catch(() => {});
  };

  const pauseVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <motion.div
      ref={ref}
      className="video-card relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        aspectRatio: "16/9",
        border: `1px solid ${hovered ? video.color + "60" : "rgba(255,255,255,0.06)"}`,
        transition: "border-color 0.3s",
        boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${video.color}20` : "0 10px 30px rgba(0,0,0,0.4)",
      }}
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => { setHovered(true); playVideo(); }}
      onMouseLeave={() => { setHovered(false); pauseVideo(); }}
      onTouchStart={() => {
        const isPlaying = !videoRef.current?.paused;
        if (isPlaying) { pauseVideo(); setHovered(false); }
        else { playVideo(); setHovered(true); }
      }}
    >
      {/* Video element (muted preview) */}
      <video
        ref={videoRef}
        src={video.src}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-60 transition-opacity duration-500"
      />

      {/* Poster/placeholder */}
      <div
        className="absolute inset-0 photo-placeholder"
        style={{
          background: `linear-gradient(${index * 30 + 45}deg, rgba(10,10,26,0.9), rgba(${
            index % 2 === 0 ? "13,27,62" : "26,10,38"
          },0.7), rgba(10,10,26,0.9))`,
        }}
      >
        {/* Play icon */}
        <motion.div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: hovered
              ? `linear-gradient(135deg, ${video.color}, #ff6b9d)`
              : "rgba(255,255,255,0.1)",
            boxShadow: hovered ? `0 0 30px ${video.color}60` : "none",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <path d="M6 4L16 10L6 16V4Z" />
          </svg>
        </motion.div>
      </div>

      {/* Netflix-style bottom overlay */}
      <div
        className="absolute inset-x-0 bottom-0 p-4"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
        }}
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs mb-1 font-medium" style={{ color: video.color }}>
              {video.year}
            </p>
            <h3 className="font-bold text-white text-sm md:text-base leading-tight">
              {video.title}
            </h3>
            <p className="text-white/50 text-xs mt-0.5">{video.sub}</p>
          </div>
          <div
            className="text-xs px-2 py-1 rounded-md"
            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
          >
            {video.duration}
          </div>
        </div>

        {/* Progress bar on hover */}
        <motion.div
          className="mt-3 h-0.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.1)" }}
          animate={{ opacity: hovered ? 1 : 0 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(to right, ${video.color}, #ff6b9d)` }}
            initial={{ width: "0%" }}
            animate={{ width: hovered ? "40%" : "0%" }}
            transition={{ duration: 3 }}
          />
        </motion.div>
      </div>

      {/* Top badge */}
      <div
        className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `${video.color}30`,
          border: `1px solid ${video.color}40`,
          color: video.color,
        }}
      >
        ▶ PLAY
      </div>
    </motion.div>
  );
}

export default function VideoMemories() {
  return (
    <section id="videos" className="py-24 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0a1a, rgba(8,5,15,0.95), #0a0a1a)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: "#d4a843" }}>
            ✦ Video Memories ✦
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
            Our Movie
          </h2>
          <p className="text-white/40 mt-3 text-sm">Hover to preview · Add your videos</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>
        <p className="text-center mt-6 text-white/25 text-xs tracking-wider">
          {videos.length} video memories · Hover to preview
        </p>
      </div>
    </section>
  );
}
