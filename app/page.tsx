"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamic imports to avoid SSR issues with Three.js and browser APIs
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), { ssr: false });
const MusicPlayer = dynamic(() => import("@/components/MusicPlayer"), { ssr: false });
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: false });
const LoveCounter = dynamic(() => import("@/components/LoveCounter"), { ssr: false });
const Timeline = dynamic(() => import("@/components/Timeline"), { ssr: false });
const PhotoGallery = dynamic(() => import("@/components/PhotoGallery"), { ssr: false });
const MemoryMovie = dynamic(() => import("@/components/MemoryMovie"), { ssr: false });
const HeartUniverse = dynamic(() => import("@/components/HeartUniverse"), { ssr: false });
const LoveLetter = dynamic(() => import("@/components/LoveLetter"), { ssr: false });
const VideoMemories = dynamic(() => import("@/components/VideoMemories"), { ssr: false });
const SpecialSurprise = dynamic(() => import("@/components/SpecialSurprise"), { ssr: false });
const FinalEnding = dynamic(() => import("@/components/FinalEnding"), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main style={{ width: "100%", minHeight: "100vh", background: "#0a0a1a", position: "relative" }}>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {loaded && (
        <div style={{ width: "100%" }}>
          <MusicPlayer />
          <HeroSection />
          <LoveCounter />
          <Timeline />
          <MemoryMovie />
          <PhotoGallery />
          <HeartUniverse />
          <LoveLetter />
          <VideoMemories />
          <SpecialSurprise />
          <FinalEnding />
          <NavDots />
        </div>
      )}
    </main>
  );
}

function NavDots() {
  const sections = [
    { id: "hero", label: "Home" },
    { id: "counter", label: "Numbers" },
    { id: "timeline", label: "Story" },
    { id: "memories", label: "Memories" },
    { id: "gallery", label: "Gallery" },
    { id: "heart-universe", label: "Heart" },
    { id: "letter", label: "Letter" },
    { id: "videos", label: "Videos" },
    { id: "surprise", label: "Surprise" },
    { id: "ending", label: "Forever" },
  ];

  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          className="group flex items-center gap-2 justify-end"
          title={label}
        >
          <span
            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            style={{ color: active === id ? "#d4a843" : "rgba(255,255,255,0.4)" }}
          >
            {label}
          </span>
          <div
            className="rounded-full transition-all duration-300"
            style={{
              width: active === id ? "10px" : "6px",
              height: active === id ? "10px" : "6px",
              background:
                active === id
                  ? "linear-gradient(135deg, #d4a843, #ff6b9d)"
                  : "rgba(255,255,255,0.25)",
              boxShadow: active === id ? "0 0 10px rgba(212,168,67,0.6)" : "none",
            }}
          />
        </button>
      ))}
    </div>
  );
}
