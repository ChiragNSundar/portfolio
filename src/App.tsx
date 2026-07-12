import React, { useState, useEffect, useRef } from "react";
import { AudioEngineCard } from "./components/AudioEngineCard";
import { YoutubeCoversCard } from "./components/YoutubeCoversCard";
import { DeveloperResumeCard } from "./components/DeveloperResumeCard";
import { PolaroidCertificates } from "./components/PolaroidCertificates";
import type { Track } from "./data/tracks";
import { mixAndOriginalTracks } from "./data/tracks";
import { audioEngine } from "./audio/audioEngine";

// Scrambled text animation component for high-quality transitions
const ScrambledText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    let frame = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&";
    const targetText = text.toUpperCase();
    const length = targetText.length;
    
    const interval = setInterval(() => {
      frame++;
      const current = targetText.split("").map((char, index) => {
        if (char === "\n" || char === " ") return char;
        if (index > frame / 2.5) {
          return chars[Math.floor(Math.random() * chars.length)];
        }
        return targetText[index];
      }).join("");

      setDisplayedText(current);

      if (frame >= length * 2.5) {
        clearInterval(interval);
        setDisplayedText(text);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  return <>{displayedText}</>;
};

export const App: React.FC = () => {
  // Console Role Mode: 'select' = Decision screen, 'engineer' = Coding portfolio, 'producer' = Audio mixing portfolio
  const [mode, setMode] = useState<'select' | 'engineer' | 'producer'>('select');
  const [isDark, setIsDark] = useState(false);

  // Load theme from localStorage or system settings
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && preferDark)) {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setIsDark(false);
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const toggleDarkMode = () => {
    playBipSound();
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mixRatio, setMixRatio] = useState(1.0);
  const [volume, setVolume] = useState(0.85);

  // Active section tracking (0 = Intro, 1 = Content section A, 2 = Content section B)
  const [activeSection, setActiveSection] = useState(0);

  // 3D Parallax Tilt state per section
  const [tilts, setTilts] = useState<Record<number, { rx: number; ry: number }>>({
    0: { rx: 0, ry: 0 },
    1: { rx: 0, ry: 0 },
    2: { rx: 0, ry: 0 }
  });
  const [unlocked, setUnlocked] = useState(false);

  // Section Refs for scroll-trigger navigation
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];

  // Synchronise state with the audio engine
  useEffect(() => {
    audioEngine.init(() => {
      const state = audioEngine.getState();
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.currentTrack);
      setMixRatio(state.mixRatio);
      setVolume(state.volume);
    });

    return () => {
      audioEngine.stop();
    };
  }, []);

  // Setup IntersectionObserver using direct DOM queries to bypass conditional mount ref gotchas
  useEffect(() => {
    if (mode === 'select') return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0.1
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-section-idx") || "0");
          setActiveSection(index);
        }
      });
    };

    const observer = new IntersectionObserver(callback, observerOptions);
    const elements = document.querySelectorAll("section[data-section-idx]");
    elements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [mode]);

  // Fallback scroll listener to force-activate the last section when user reaches page end
  useEffect(() => {
    if (mode === 'select') return;

    const handleScroll = () => {
      const bottomThreshold = 60; // pixels from the bottom
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - bottomThreshold);
      if (isAtBottom) {
        setActiveSection(2); // index 2 is always the last section (Certificates or YouTube Covers)
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mode]);

  // Mouse parallax movement tracking
  useEffect(() => {
    if (mode === 'select') return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;

      setTilts(prev => ({
        ...prev,
        [activeSection]: {
          rx: -y * 6,
          ry: x * 6
        }
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeSection, mode]);

  const handleTrackSelect = (track: Track) => {
    setUnlocked(true);
    audioEngine.play(track);
  };

  const handlePlayToggle = () => {
    setUnlocked(true);
    if (isPlaying) {
      audioEngine.stop();
    } else if (currentTrack) {
      audioEngine.play(currentTrack);
    } else {
      audioEngine.play(mixAndOriginalTracks[0]);
    }
  };

  const handleStop = () => {
    audioEngine.stop();
  };

  const handleMixRatioChange = (ratio: number) => {
    audioEngine.setMixRatio(ratio);
  };

  const handleVolumeChange = (vol: number) => {
    audioEngine.setVolume(vol);
  };

  const unlockAudioContext = () => {
    if (!unlocked) {
      audioEngine.init();
      setUnlocked(true);
    }
  };

  const scrollToSection = (idx: number) => {
    playBipSound();
    const el = document.querySelector(`section[data-section-idx="${idx}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const playBipSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };

  // Coordinated scroll transitions style generator
  const getSectionStyles = (idx: number) => {
    const isActive = activeSection === idx;
    const tilt = tilts[idx] || { rx: 0, ry: 0 };
    
    return {
      opacity: isActive ? 1 : 0.6,
      filter: "none",
      transform: isActive 
        ? `perspective(1600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(0) scale(1)` 
        : `perspective(1600px) rotateX(8deg) rotateY(-3deg) translateY(40px) scale(0.96)`,
      transition: isActive 
        ? "transform 0.15s ease-out, opacity 0.6s ease" 
        : "transform 0.9s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s ease",
      transformStyle: "preserve-3d" as const,
      backfaceVisibility: "hidden" as const
    };
  };

  // Navigation menu items mapped based on active view console role
  const getMenuItems = () => {
    if (mode === 'engineer') {
      return [
        { label: "01 INTRO", index: 0, color: "var(--color-amber-accent)" },
        { label: "02 PROFILES", index: 1, color: "var(--color-amber-accent)" },
        { label: "03 CERTIFICATES", index: 2, color: "var(--color-rose-accent)" }
      ];
    } else {
      return [
        { label: "01 INTRO", index: 0, color: "var(--color-lavender-accent)" },
        { label: "02 STEM MIXES", index: 1, color: "var(--color-lavender-accent)" },
        { label: "03 COVERS", index: 2, color: "var(--color-mint-accent)" }
      ];
    }
  };

  return (
    <div 
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-cream)",
        color: "var(--text-dark)",
        overflowX: "hidden",
        position: "relative",
        backgroundImage: "radial-gradient(#e4e4e7 1.2px, transparent 0)",
        backgroundSize: "32px 32px"
      }}
      onClick={unlockAudioContext}
    >
      {/* DECISION SPLASH VIEW: Mode Selector */}
      {mode === 'select' && (
        <div 
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 20px",
            gap: "36px",
            position: "relative"
          }}
        >
          {/* Top-Right Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            className="analog-btn"
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              padding: "6px 14px",
              fontSize: "0.75rem",
              zIndex: 10
            }}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? "☀️ LIGHT" : "🌙 DARK"}
          </button>
          {/* Top Header Section */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "12px" }}>
            <div 
              style={{
                background: "#ffffff",
                border: "1.5px solid #18181b",
                borderRadius: "12px",
                padding: "6px 14px",
                fontFamily: "var(--font-lcd)",
                fontSize: "0.75rem",
                color: "var(--color-amber-accent)",
                fontWeight: "bold",
                marginBottom: "16px",
                boxShadow: "3px 3px 0px #18181b"
              }}
            >
              PORTFOLIO WEBSITE: ACTIVE CONSOLE <span className="bouncy-emoji">👋</span>
            </div>

            <h1 
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "4.8rem",
                fontWeight: "900",
                lineHeight: "1.0",
                letterSpacing: "-2px",
                color: "var(--text-dark)",
                marginBottom: "12px",
                textTransform: "uppercase"
              }}
            >
              CHIRAG N SUNDAR
            </h1>

            <p 
              style={{
                fontFamily: "var(--font-lcd)",
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                letterSpacing: "1.5px"
              }}
            >
              // PORTFOLIO WEBSITE: CODES & AUDIO SYSTEMS //
            </p>
          </div>

          {/* Cards Split Wrapper */}
          <div 
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "32px",
              width: "100%"
            }}
          >
            {/* Split 1: Software Engineer */}
            <div 
              className="creative-card"
              onClick={() => { playBipSound(); setMode('engineer'); }}
              style={{
                flex: "1 1 350px",
                maxWidth: "440px",
                height: "440px",
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                borderColor: "#18181b",
                boxShadow: "10px 10px 0px rgba(245, 159, 0, 0.15), 10px 10px 0px #18181b"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "3.2rem" }} className="bouncy-emoji">💻</div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "900", textTransform: "uppercase", lineHeight: 1.1 }}>
                  Software<br/>Engineering<br/>Dossier
                </h2>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  Review my Computer Science degree from RNSIT (8.89 GPA), WhatDigital Tech Data Science internship, detailed project technical sheets (RoadWatch, Harmony Hub), and query my local AI chatbot.
                </p>
              </div>
              
              <button className="analog-btn active" style={{ padding: "12px 24px", justifyContent: "center" }}>
                LOAD DOSSIER CONSOLE &rarr;
              </button>
            </div>

            {/* Split 2: Music Producer */}
            <div 
              className="creative-card"
              onClick={() => { playBipSound(); setMode('producer'); }}
              style={{
                flex: "1 1 350px",
                maxWidth: "440px",
                height: "440px",
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                borderColor: "#18181b",
                boxShadow: "10px 10px 0px rgba(147, 51, 234, 0.15), 10px 10px 0px #18181b"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "3.2rem" }} className="bouncy-emoji">🎚️</div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "900", textTransform: "uppercase", lineHeight: 1.1 }}>
                  Music<br/>Production &<br/>Mixing Studio
                </h2>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  Step inside the audio mixing studio. Interact with my live synchronized before/after multitrack stems player and watch YouTube video covers demonstrating my mixing capabilities.
                </p>
              </div>
              
              <button className="analog-btn active" style={{ padding: "12px 24px", justifyContent: "center" }}>
                ENTER AUDIO STUDIO &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO CONSOLE VIEWS (Rendered when a mode is active) */}
      {mode !== 'select' && (
        <>
          {/* Mobile top bar navigation */}
          <nav 
            className="mobile-nav" 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              background: "var(--card-bg)",
              borderBottom: "2px solid var(--border-color)",
              padding: "8px 16px",
              display: "none",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 100,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => { playBipSound(); setMode('select'); setActiveSection(0); }}
                className="analog-btn"
                style={{ padding: "4px 8px", fontSize: "0.58rem" }}
              >
                🔄 ROLE
              </button>
              <button
                onClick={toggleDarkMode}
                className="analog-btn"
                style={{ padding: "4px 8px", fontSize: "0.58rem" }}
              >
                {isDark ? "☀️" : "🌙"}
              </button>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {getMenuItems().map((item) => {
                const isActive = activeSection === item.index;
                return (
                  <button
                    key={item.index}
                    onClick={() => scrollToSection(item.index)}
                    className={`analog-btn ${isActive ? "active" : ""}`}
                    style={{ padding: "4px 8px", fontSize: "0.58rem" }}
                  >
                    {item.label.split(" ")[1] || item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Floating Navigation panel with switch console selector */}
          <nav
            className="sidebar-nav"
            style={{
              position: "fixed",
              right: "30px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "var(--card-bg)",
              border: "2px solid var(--border-color)",
              borderRadius: "16px",
              padding: "18px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "6px 6px 0px var(--card-shadow)",
              zIndex: 100
            }}
          >
            {/* Dark Mode toggle inside navigation */}
            <button
              onClick={toggleDarkMode}
              className="analog-btn"
              style={{
                padding: "6px 10px",
                fontSize: "0.58rem",
                justifyContent: "center",
                fontWeight: "900"
              }}
              aria-label="Toggle Dark Mode"
            >
              {isDark ? "☀️ LIGHT" : "🌙 DARK"}
            </button>

            {/* Back to Console choice selector */}
            <button
              onClick={() => { playBipSound(); setMode('select'); setActiveSection(0); }}
              className="analog-btn"
              style={{
                padding: "6px 10px",
                fontSize: "0.58rem",
                justifyContent: "center",
                fontWeight: "900"
              }}
            >
              🔄 SWITCH ROLE
            </button>

            <div style={{ borderBottom: "1.5px solid var(--border-color)", margin: "4px 0" }} />

            {getMenuItems().map((item) => {
              const isActive = activeSection === item.index;
              return (
                <div 
                  key={item.index}
                  onClick={() => scrollToSection(item.index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer"
                  }}
                >
                  <span 
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: isActive ? item.color : "var(--card-bg-muted)",
                      boxShadow: isActive ? `0 0 10px ${item.color}, 0 0 4px ${item.color}` : "inset 0 1px 2px rgba(0,0,0,0.1)",
                      border: "1.5px solid var(--border-color)",
                      transition: "all 0.25s ease"
                    }}
                  />
                  <span 
                    style={{
                      fontFamily: "var(--font-lcd)",
                      fontSize: "0.65rem",
                      color: isActive ? "var(--text-dark)" : "var(--text-muted)",
                      fontWeight: isActive ? "bold" : "normal",
                      transition: "color 0.25s"
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </nav>

          {/* Main Content Sections Wrapper */}
          <div 
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "140px",
              padding: "80px 20px"
            }}
          >
            
            {/* SECTION 1: HERO LANDING (Customized based on active mode) */}
            <section 
              ref={sectionRefs[0]}
              data-section-idx="0"
              style={{
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                maxWidth: "800px",
                zIndex: 10,
                ...getSectionStyles(0)
              }}
            >
              <div 
                style={{
                  background: "var(--card-bg)",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "6px 14px",
                  fontFamily: "var(--font-lcd)",
                  fontSize: "0.8rem",
                  color: mode === 'engineer' ? "var(--color-amber-accent)" : "var(--color-lavender-accent)",
                  fontWeight: "bold",
                  marginBottom: "24px",
                  boxShadow: "3px 3px 0px var(--card-shadow)"
                }}
              >
                ROLE: {mode === 'engineer' ? "SOFTWARE ENGINEER" : "MUSIC PRODUCER"} CONSOLE <span className="bouncy-emoji">{mode === 'engineer' ? "💻" : "🎚️"}</span>
              </div>
              
              <h1 
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "5.5rem",
                  fontWeight: "900",
                  lineHeight: "1.0",
                  letterSpacing: "-2px",
                  color: "var(--text-dark)",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  whiteSpace: "pre-line"
                }}
              >
                <ScrambledText text={mode === 'producer' ? "HAZARD\nCHIRAG" : "CHIRAG N\nSUNDAR"} />
              </h1>

              <p 
                style={{
                  fontFamily: "var(--font-lcd)",
                  fontSize: "1.1rem",
                  color: "var(--text-muted)",
                  letterSpacing: "1.5px",
                  marginBottom: "36px"
                }}
              >
                {mode === 'engineer' 
                  ? "// WEB APP DEVELOPER // DATA ANALYTICS & GEN-AI //" 
                  : "// AUDIO MIXING & POST PRODUCTION SPECIALIST //"
                }
              </p>

              <div style={{ display: "flex", gap: "16px" }}>
                <button className="analog-btn active" onClick={() => scrollToSection(1)} style={{ padding: "12px 24px" }}>
                  {mode === 'engineer' ? "LOAD INTERVIEW DOSSIER 📂" : "LAUNCH MIXER DECK 🎛️"}
                </button>
                <button 
                  className="analog-btn" 
                  onClick={() => { playBipSound(); setMode('select'); setActiveSection(0); }} 
                  style={{ padding: "12px 24px" }}
                >
                  🔄 SWITCH PORTFOLIO
                </button>
              </div>

              <div 
                style={{
                  marginTop: "80px",
                  animation: "float 2.5s ease-in-out infinite",
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  opacity: 0.6
                }}
                onClick={() => scrollToSection(1)}
              >
                👇
              </div>
            </section>

            {/* SECTION 2 & 3: Mode Conditional Display */}
            {mode === 'engineer' ? (
              <>
                {/* Software Engineer: Resume & QA Chatbot */}
                <section 
                  ref={sectionRefs[1]}
                  data-section-idx="1"
                  style={{
                    width: "100%",
                    maxWidth: "850px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    ...getSectionStyles(1)
                  }}
                >
                  <DeveloperResumeCard onInteract={unlockAudioContext} />
                </section>

                {/* Software Engineer: Polaroid Certifications */}
                <section 
                  ref={sectionRefs[2]}
                  data-section-idx="2"
                  style={{
                    width: "100%",
                    maxWidth: "850px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    ...getSectionStyles(2)
                  }}
                >
                  <PolaroidCertificates />
                </section>
              </>
            ) : (
              <>
                {/* Music Producer: Audio Stems Mixer */}
                <section 
                  ref={sectionRefs[1]}
                  data-section-idx="1"
                  style={{
                    width: "100%",
                    maxWidth: "750px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    ...getSectionStyles(1)
                  }}
                >
                  <AudioEngineCard 
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    mixRatio={mixRatio}
                    volume={volume}
                    onTrackSelect={handleTrackSelect}
                    onPlayToggle={handlePlayToggle}
                    onMixRatioChange={handleMixRatioChange}
                    onVolumeChange={handleVolumeChange}
                    onInteract={unlockAudioContext}
                    onStop={handleStop}
                  />
                </section>

                {/* Music Producer: Youtube Cover Videos */}
                <section 
                  ref={sectionRefs[2]}
                  data-section-idx="2"
                  style={{
                    width: "100%",
                    maxWidth: "750px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    ...getSectionStyles(2)
                  }}
                >
                  <YoutubeCoversCard onInteract={unlockAudioContext} />
                </section>
              </>
            )}

            {/* Scroll bottom spacer to provide scrolling headroom */}
            <div style={{ height: "160px" }} />

          </div>

          {/* Persistent Bottom Ticker Strip */}
          <div 
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100vw",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              borderTop: "3.5px solid #18181b",
              background: "#ffffff",
              zIndex: 90,
              padding: "10px 24px",
              boxShadow: "0 -4px 15px rgba(0,0,0,0.03)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span 
                style={{ 
                  width: "10px", 
                  height: "10px", 
                  borderRadius: "50%", 
                  background: isPlaying ? "var(--color-lavender-accent)" : "#d4d4d8", 
                  boxShadow: isPlaying ? "0 0 6px var(--color-lavender-accent)" : "none" 
                }} 
              />
              <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "bold" }}>
                {isPlaying ? "AUDIO STREAMING ACTIVE" : "SIGNAL STANDBY"}
              </span>
            </div>

            <div 
              style={{
                flexGrow: 1,
                maxWidth: "500px",
                background: "#f4f4f5",
                border: "1.5px solid #18181b",
                borderRadius: "8px",
                height: "28px",
                padding: "2px 8px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center"
              }}
            >
              <span 
                className="scrolling-text"
                style={{ 
                  fontFamily: "var(--font-lcd)", 
                  fontSize: "0.6rem", 
                  color: "var(--text-dark)",
                  fontWeight: "bold"
                }}
              >
                CHIRAG N SUNDAR PORTFOLIO ENGINE // ACTIVE ROLE: {mode.toUpperCase()} // DEPLOYMENT BAY ONLINE // CREATIVE GRID LOADED // LOCKSTEP SIGNAL READY
              </span>
            </div>

            <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.65rem", color: "var(--text-muted)", display: "flex", gap: "12px", fontWeight: "bold" }}>
              <span>BAUD: 9600</span>
              <span>&copy; 2026</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
