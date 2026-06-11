"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const LoadingScreen   = dynamic(() => import("@/components/LoadingScreen"),   { ssr: false });
const EnterOverlay    = dynamic(() => import("@/components/EnterOverlay"),    { ssr: false });
const MusicPlayer     = dynamic(() => import("@/components/MusicPlayer"),     { ssr: false });
const HeroSection     = dynamic(() => import("@/components/HeroSection"),     { ssr: false });
const LoveCounter     = dynamic(() => import("@/components/LoveCounter"),     { ssr: false });
const Timeline        = dynamic(() => import("@/components/Timeline"),        { ssr: false });
const PhotoGallery    = dynamic(() => import("@/components/PhotoGallery"),    { ssr: false });
const MemoryMovie     = dynamic(() => import("@/components/MemoryMovie"),     { ssr: false });
const HeartUniverse   = dynamic(() => import("@/components/HeartUniverse"),   { ssr: false });
const LoveLetter      = dynamic(() => import("@/components/LoveLetter"),      { ssr: false });
const VideoMemories   = dynamic(() => import("@/components/VideoMemories"),   { ssr: false });
const SpecialSurprise = dynamic(() => import("@/components/SpecialSurprise"), { ssr: false });
const FinalEnding     = dynamic(() => import("@/components/FinalEnding"),     { ssr: false });

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [entered,     setEntered]     = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Buat audio element sekali
  useEffect(() => {
    const audio = new Audio("/music/song.mp3");
    audio.loop   = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    return () => { audio.pause(); };
  }, []);

  // Klik "Tap to Enter" → play musik sekaligus buka website
  const handleEnter = async () => {
    setEntered(true);
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (e) {
        console.warn("Autoplay blocked:", e);
      }
    }
  };

  return (
    <main style={{ width: "100%", minHeight: "100vh", background: "#0a0a1a", position: "relative" }}>

      {/* 1. Loading screen */}
      {!loadingDone && (
        <LoadingScreen onComplete={() => setLoadingDone(true)} />
      )}

      {/* 2. Tap to Enter overlay */}
      {loadingDone && (
        <EnterOverlay show={!entered} onEnter={handleEnter} />
      )}

      {/* 3. Main content */}
      {entered && (
        <div style={{ width: "100%" }}>
          <MusicPlayer externalAudio={audioRef} />
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
    { id: "hero",          label: "Home"     },
    { id: "counter",       label: "Numbers"  },
    { id: "timeline",      label: "Story"    },
    { id: "memories",      label: "Memories" },
    { id: "gallery",       label: "Gallery"  },
    { id: "heart-universe",label: "Heart"    },
    { id: "letter",        label: "Letter"   },
    { id: "videos",        label: "Videos"   },
    { id: "surprise",      label: "Surprise" },
    { id: "ending",        label: "Forever"  },
  ];

  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.3 }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{
      position: "fixed", right: 12, top: "50%",
      transform: "translateY(-50%)", zIndex: 40,
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      {sections.map(({ id, label }) => (
        <button key={id} title={label}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          style={{
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            background: "none", border: "none", cursor: "pointer",
            // 44x44 touch target minimum
            width: 44, height: 44, padding: 0,
          }}
        >
          <div style={{
            borderRadius: "50%", transition: "all 0.3s",
            width:  active === id ? 10 : 6,
            height: active === id ? 10 : 6,
            background: active === id
              ? "linear-gradient(135deg, #d4a843, #ff6b9d)"
              : "rgba(255,255,255,0.25)",
            boxShadow: active === id ? "0 0 10px rgba(212,168,67,0.6)" : "none",
          }} />
        </button>
      ))}
    </div>
  );
}
