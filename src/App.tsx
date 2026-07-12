import React, { useState, useEffect, useRef } from "react";
import { TapeDeckUnit } from "./components/TapeDeckUnit";
import { CrtVisualizerUnit } from "./components/CrtVisualizerUnit";
import { CrtTvUnit } from "./components/CrtTvUnit";
import { CrtTerminalUnit } from "./components/CrtTerminalUnit";
import { PolaroidCertificates } from "./components/PolaroidCertificates";
import type { Track } from "./data/tracks";
import { mixAndOriginalTracks } from "./data/tracks";
import { audioEngine } from "./audio/audioEngine";

export const App: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mixRatio, setMixRatio] = useState(1.0);
  const [volume, setVolume] = useState(0.85);

  // Active section tracking (0 = Intro, 1 = Mixes, 2 = Covers, 3 = Profile, 4 = Files)
  const [activeSection, setActiveSection] = useState(0);

  // 3D Parallax Tilt state per section
  const [tilts, setTilts] = useState<Record<number, { rx: number; ry: number }>>({
    0: { rx: 0, ry: 0 },
    1: { rx: 0, ry: 0 },
    2: { rx: 0, ry: 0 },
    3: { rx: 0, ry: 0 },
    4: { rx: 0, ry: 0 }
  });
  const [unlocked, setUnlocked] = useState(false);

  // Section Refs for scroll-trigger navigation
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
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

  // Setup IntersectionObserver to track active scrolling section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px", // triggers when section occupies center 50% viewport
      threshold: 0.2
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
    sectionRefs.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Tracking mouse movements for independent 3D parallax tilt based on active section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;

      setTilts(prev => ({
        ...prev,
        [activeSection]: {
          rx: -y * 8,
          ry: x * 8
        }
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeSection]);

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
    sectionRefs[idx].current?.scrollIntoView({ behavior: "smooth", block: "center" });
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

  const menuItems = [
    { label: "01 INTRO", index: 0 },
    { label: "02 MIXES", index: 1 },
    { label: "03 COVERS", index: 2 },
    { label: "04 PROFILE", index: 3 },
    { label: "05 FILES", index: 4 }
  ];

  return (
    <div 
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #15161b 0%, #030304 100%)",
        color: "#d8d8e2",
        overflowX: "hidden",
        position: "relative"
      }}
      onClick={unlockAudioContext}
    >
      {/* Dynamic Floating Parallax Background Particles */}
      <div 
        style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundImage: "radial-gradient(rgba(197, 160, 89, 0.03) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      {/* Floating Skeuomorphic Navigation LED Panel (Patch Bay style) */}
      <nav
        style={{
          position: "fixed",
          right: "30px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "linear-gradient(135deg, #1b1b1f, #0d0d0f)",
          border: "2.5px solid var(--color-gold-dark)",
          borderRadius: "6px",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          zIndex: 100
        }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.55rem", color: "var(--color-gold)", fontWeight: "bold", borderBottom: "1px solid var(--color-gold-dark)", paddingBottom: "4px", textAlign: "center" }}>
          PATCH-BAY
        </div>

        {menuItems.map((item) => {
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
              {/* Glowing LED Socket Light */}
              <span 
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: isActive ? "rgb(0, 255, 120)" : "#222",
                  boxShadow: isActive ? "0 0 10px rgb(0, 255, 120), 0 0 4px rgb(0, 255, 120)" : "inset 0 1px 2px rgba(0,0,0,0.8)",
                  border: isActive ? "1px solid #fff" : "1px solid #444",
                  transition: "all 0.25s ease"
                }}
              />
              <span 
                style={{
                  fontFamily: "var(--font-lcd)",
                  fontSize: "0.65rem",
                  color: isActive ? "#ffffff" : "#666",
                  textShadow: isActive ? "0 0 4px rgba(255,255,255,0.4)" : "none",
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

      {/* Main Scrolling Content Sections Wrapper */}
      <div 
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "120px", // gap between sections
          padding: "60px 20px"
        }}
      >
        
        {/* SECTION 1: HERO LANDING */}
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
            transform: `perspective(1000px) rotateX(${tilts[0].rx}deg) rotateY(${tilts[0].ry}deg)`,
            transition: "transform 0.15s ease-out",
            zIndex: 10
          }}
        >
          {/* Glowing Retro Badge */}
          <div 
            style={{
              border: "1.5px solid var(--color-gold)",
              borderRadius: "4px",
              padding: "4px 12px",
              fontFamily: "var(--font-lcd)",
              fontSize: "0.75rem",
              color: "var(--color-gold)",
              textShadow: "var(--glow-gold)",
              marginBottom: "20px",
              boxShadow: "0 0 10px rgba(197, 160, 89, 0.1)"
            }}
          >
            SYS STATUS: ONLINE
          </div>
          
          <h1 
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "4.5rem",
              fontWeight: "900",
              lineHeight: "1.0",
              letterSpacing: "4px",
              background: "linear-gradient(135deg, #ffffff 30%, #c5a059 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "12px",
              textTransform: "uppercase"
            }}
          >
            CHIRAG N<br/>SUNDAR
          </h1>

          <p 
            style={{
              fontFamily: "var(--font-lcd)",
              fontSize: "1.05rem",
              color: "#a0a0ab",
              letterSpacing: "3px",
              marginBottom: "32px"
            }}
          >
            // SOFTWARE ENGINEER // DUAL-STAGE AUDIO MIXING STATION //
          </p>

          <div style={{ display: "flex", gap: "16px" }}>
            <button className="analog-btn active" onClick={() => scrollToSection(1)} style={{ padding: "10px 20px" }}>
              ENTER MIXING RACK
            </button>
            <button className="analog-btn" onClick={() => scrollToSection(3)} style={{ padding: "10px 20px" }}>
              BIO TERMINAL
            </button>
          </div>

          <div 
            style={{
              marginTop: "80px",
              animation: "float 2.5s ease-in-out infinite",
              fontSize: "1.5rem",
              cursor: "pointer",
              opacity: 0.6
            }}
            onClick={() => scrollToSection(1)}
          >
            ⬇️
          </div>
        </section>


        {/* SECTION 2: AUDIO MIXING (TAPE DECK + OSCILLOSCOPE) */}
        <section 
          ref={sectionRefs[1]}
          data-section-idx="1"
          style={{
            width: "100%",
            maxWidth: "680px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            transformStyle: "preserve-3d",
            transform: `perspective(1500px) rotateX(${tilts[1].rx}deg) rotateY(${tilts[1].ry}deg)`,
            transition: "transform 0.15s ease-out"
          }}
        >
          <div style={{ borderLeft: "4px solid var(--color-gold)", paddingLeft: "10px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--color-gold)", letterSpacing: "1.5px", fontWeight: "bold" }}>
              BAY 01 // SYNCHRONIZED STEM MIXES
            </h2>
          </div>

          <TapeDeckUnit 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            mixRatio={mixRatio}
            volume={volume}
            onTrackSelect={handleTrackSelect}
            onPlayToggle={handlePlayToggle}
            onStop={handleStop}
            onMixRatioChange={handleMixRatioChange}
            onVolumeChange={handleVolumeChange}
            onInteract={unlockAudioContext}
          />

          <CrtVisualizerUnit 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            mixRatio={mixRatio}
          />
        </section>


        {/* SECTION 3: YOUTUBE COVERS (TELE-TUNER CRT TV) */}
        <section 
          ref={sectionRefs[2]}
          data-section-idx="2"
          style={{
            width: "100%",
            maxWidth: "680px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            transformStyle: "preserve-3d",
            transform: `perspective(1500px) rotateX(${tilts[2].rx}deg) rotateY(${tilts[2].ry}deg)`,
            transition: "transform 0.15s ease-out"
          }}
        >
          <div style={{ borderLeft: "4px solid var(--color-gold)", paddingLeft: "10px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--color-gold)", letterSpacing: "1.5px", fontWeight: "bold" }}>
              BAY 02 // VISUAL COVER CHANNELS
            </h2>
          </div>

          <CrtTvUnit onInteract={unlockAudioContext} />
        </section>


        {/* SECTION 4: RESUME CLI & ANALYTICS (MS-DOS TERMINAL) */}
        <section 
          ref={sectionRefs[3]}
          data-section-idx="3"
          style={{
            width: "100%",
            maxWidth: "750px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            transformStyle: "preserve-3d",
            transform: `perspective(1500px) rotateX(${tilts[3].rx}deg) rotateY(${tilts[3].ry}deg)`,
            transition: "transform 0.15s ease-out"
          }}
        >
          <div style={{ borderLeft: "4px solid var(--color-gold)", paddingLeft: "10px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--color-gold)", letterSpacing: "1.5px", fontWeight: "bold" }}>
              BAY 03 // CORE BIO & DEVELOPMENT CORE
            </h2>
          </div>

          <CrtTerminalUnit onInteract={unlockAudioContext} />
        </section>


        {/* SECTION 5: POLAROID CERTIFICATIONS & FOOTER */}
        <section 
          ref={sectionRefs[4]}
          data-section-idx="4"
          style={{
            width: "100%",
            maxWidth: "680px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            transformStyle: "preserve-3d",
            transform: `perspective(1500px) rotateX(${tilts[4].rx}deg) rotateY(${tilts[4].ry}deg)`,
            transition: "transform 0.15s ease-out"
          }}
        >
          <div style={{ borderLeft: "4px solid var(--color-gold)", paddingLeft: "10px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--color-gold)", letterSpacing: "1.5px", fontWeight: "bold" }}>
              BAY 04 // CREDENTIAL STACKS
            </h2>
          </div>

          <PolaroidCertificates />
        </section>

      </div>

      {/* Persistent Bottom Hardware Strip */}
      <div 
        className="deck-strip"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          borderTop: "3px solid #202024",
          background: "linear-gradient(180deg, #16161a, #0b0b0c)",
          zIndex: 90,
          padding: "8px 24px",
          boxShadow: "0 -5px 15px rgba(0,0,0,0.5)"
        }}
      >
        {/* Toggle Lights */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="led-dot" style={{ background: isPlaying ? "#00ff78" : "#444", boxShadow: isPlaying ? "0 0 6px #00ff78" : "none" }} />
          <span style={{ fontFamily: "var(--font-lcd)", fontSize: "0.6rem", color: "#666" }}>SYS AUDIO STREAMING</span>
        </div>

        {/* Readout log banner */}
        <div 
          style={{
            flexGrow: 1,
            maxWidth: "500px",
            background: "#050506",
            border: "1px solid #1c1c20",
            borderRadius: "2px",
            height: "26px",
            padding: "2px 8px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center"
          }}
        >
          <marquee 
            scrollamount="2.5" 
            style={{ 
              fontFamily: "var(--font-lcd)", 
              fontSize: "0.55rem", 
              color: "rgb(0, 255, 120)",
              textShadow: "0 0 3px rgba(0,255,120,0.8)"
            }}
          >
            CHIRAG N SUNDAR PORTFOLIO ENGINE // STATUS: STEADY // SECTIONS LOADED: 5 // BIOMETRICS: SHIELDED // MIX STATUS: LOCKSTEP SYNC
          </marquee>
        </div>

        {/* Console info */}
        <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.6rem", color: "#555", display: "flex", gap: "12px" }}>
          <span>BAUD: 9600</span>
          <span>&copy; 2026</span>
        </div>
      </div>
    </div>
  );
};

export default App;
