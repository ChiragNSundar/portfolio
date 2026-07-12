import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AudioEngineCard } from "./components/AudioEngineCard";
import { YoutubeCoversCard } from "./components/YoutubeCoversCard";
import { DeveloperResumeCard } from "./components/DeveloperResumeCard";
import { PolaroidCertificates } from "./components/PolaroidCertificates";
import { supabase, isSupabaseConfigured } from "./lib/supabaseClient";
import type { Track } from "./data/tracks";
import { mixAndOriginalTracks } from "./data/tracks";
import { audioEngine } from "./audio/audioEngine";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const MOCK_ENTRIES = [
  { id: "mock-1", name: "Infosys Recruiter", message: "Loved the interactive CV & SVG treemaps! 👍" },
  { id: "mock-2", name: "WhatDigital Supervisor", message: "Outstanding execution on LLM chatbot architectures." },
  { id: "mock-3", name: "GitHub Visitor", message: "Awesome YOLOv8 helmet detection main pipeline." },
  { id: "mock-4", name: "Gen-AI Recruiter", message: "The local RAG chatbot is incredibly fast and fun!" },
  { id: "mock-5", name: "Creative Dev", message: "Fascinating Neobrutalist cream design styling." }
];

const PROJECT_DETAILS_DATA = {
  roadwatch: {
    title: "RoadWatch: Smart Helmet & License Plate Recognition",
    github: "https://github.com/ChiragNSundar/Helmet-Violation-Detection-and-License-Plate-Recognition-Realtime",
    images: ["/rw/bike.gif", "/rw/image.png"],
    pitch: "An AI-powered traffic enforcement system designed for real-time monitoring of motorcycle helmet violations. It detects riders without helmets, recognizes their license plates via advanced OCR consensus logic, and logs violations with visual evidence.",
    techStack: [
      { component: "Language", tech: "Python 3.10.x" },
      { component: "Object Detection", tech: "YOLOv8 (v8.4.47)" },
      { component: "Backend", tech: "FastAPI" },
      { component: "OCR Engines", tech: "EasyOCR / PaddleOCR" },
      { component: "Deep Learning", tech: "PyTorch" },
      { component: "Graphics / UI", tech: "OpenCV / Jinja2" }
    ],
    features: [
      "Real-Time Detection: High-speed YOLOv8 predictions mapping riders, helmets, and number plates.",
      "OCR Consensus: Position-Level Voting System resolving character confusion (e.g., D vs Q) with 99%+ accuracy.",
      "Smart Filtering: Automatically drops duplicate logs and matches Indian License Standard formats.",
      "Automated Alerts: E-mails warning notices with attached infraction crop images to authorities.",
      "Admin Dashboard: Built in FastAPI for uploading videos and tracking violation database logs."
    ],
    coreIntelligence: [
      "Spatial Association: Triggers violations only when no-helmet detections and plate detections overlap the rider box by >=30%.",
      "Weather-Resilient CLAHE: LAB color space CLAHE normalisation and Unsharp Masking applied dynamically in rain/low light.",
      "Consensus Aggregator: Groups frame-by-frame readings using string-distance heuristics to clean OCR noise."
    ],
    challenges: "Maintaining accurate OCR reading on plates that were blurry, dirty, or captured in bad lighting. Solved by integrating CLAHE image pre-processing and custom tuning confidence bounds."
  },
  harmony: {
    title: "Harmony Hub: Mental Health & Wellness Assistant",
    github: "https://github.com/Mental-Wellbeing-App/MentalHealthApp",
    images: [
      "/hm/GenAI AssistantChat.jpeg",
      "/hm/Chat2.jpeg",
      "/hm/HabitTracker.jpeg",
      "/hm/PlotlyGraphData.png",
      "/hm/UserAuthPage.jpeg"
    ],
    pitch: "A comprehensive mental health assistant helping users with mood logs, habit trackers, and personalized AI support through a generative Gemini RAG chatbot.",
    techStack: [
      { component: "Frontend / UI", tech: "Streamlit (Python)" },
      { component: "AI Chatbot", tech: "Gemini Pro LLM" },
      { component: "Search Pipeline", tech: "RAG (Retrieval-Augmented Generation)" },
      { component: "Data Parsing", tech: "NLP / PDF Parser text pipelines" },
      { component: "Visual Analytics", tech: "Plotly Charts" }
    ],
    features: [
      "AI Gemini Chatbot: Converses empathetically utilizing NLP pipelines.",
      "Retrieval-Augmented Generation: Upload personal documents (PDFs) to feed context-aware answers to the LLM chatbot.",
      "Wellness Tracking: Streamlit-based interfaces for tracking mood patterns, habit goals, and progress notes.",
      "Dynamic Graphs: Plotly charts demonstrating wellness improvements."
    ],
    coreIntelligence: [
      "RAG Architecture: Bypasses generic LLM boundaries by retrieving localized context from documents before formulating answers.",
      "NLP Processing: Text queries analyzed naturally to return empathetic mental wellness replies rather than simple keyword matches.",
      "Visual Insights: Pandas processes logs on-the-fly to render interactive Streamlit graph metrics."
    ],
    challenges: "Context injection accuracy for larger PDF uploads. Solved by refining text splitting algorithms and chunk size configurations."
  },
  jobportal: {
    title: "Job Portal Business Intelligence Dashboard",
    github: "https://github.com/ChiragNSundar/JobPortalDashboard",
    images: [
      "/jp/Screenshot 2026-07-12 205812.png",
      "/jp/image copy.png",
      "/jp/image.png",
      "/jp/image copy 2.png",
      "/jp/image copy 3.png",
      "/jp/image copy 4.png",
      "/jp/image copy 5.png"
    ],
    pitch: "A comprehensive, interactive data visualization dashboard querying user device preference models, application status distributions, and geo-spatial applicant locations.",
    techStack: [
      { component: "Core Logic", tech: "Python 3.x" },
      { component: "Framework", tech: "Dash (by Plotly)" },
      { component: "Database Controllers", tech: "SQLAlchemy / PyMongo / PyMySQL" },
      { component: "Configuration Source", tech: "MongoDB Config documents / .env variables" },
      { component: "Data Wrangling", tech: "Pandas / NumPy" }
    ],
    features: [
      "Trend Analysis: Tracks daily and monthly application volumes over time with dual-axis Plotly charts.",
      "Device Intelligence: Desktop vs mobile adoption charts modeling user device trends.",
      "Geospatial Analytics: Bar charts mapping applicant regions and sunburst graphs representing countries.",
      "Interactive UI: Neobrutalist glassmorphism layouts with global multi-metric dropdown filtering."
    ],
    coreIntelligence: [
      "Fallback Config Pipeline: Centralized SQL controller attempts Mongo extraction first, defaulting to local environment variables if database is offline.",
      "Modular Layout Architecture: Separates dashboard pages (Daily_Overview, Monthly_Trend) to ease maintenance.",
      "Data Optimization: Uses optimized SQL query indices and Pandas aggregations to load thousands of rows quickly."
    ],
    challenges: "Managing connections across multiple remote database servers. Solved by building a centralized SQL controller utilizing local backups as fallback options."
  }
};

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

// Typewriter text animation component for hero subtitles
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < text.length) {
        setDisplayedText(text.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayedText}</>;
};

export const App: React.FC = () => {
  // Console Role Mode: 'select' = Decision screen, 'engineer' = Coding portfolio, 'producer' = Audio mixing portfolio
  const [mode, setMode] = useState<'select' | 'engineer' | 'producer'>('select');
  const [activeDetailProject, setActiveDetailProject] = useState<"roadwatch" | "harmony" | "jobportal" | null>(null);

  // Guestbook Footer states & handlers
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [isGuestbookSubmitting, setIsGuestbookSubmitting] = useState(false);

  const fetchSignatures = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase!
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    if (mode !== 'select') {
      fetchSignatures();
    }
  }, [mode]);

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) return;
    unlockAudioContext();

    setIsGuestbookSubmitting(true);
    try {
      const { error } = await supabase!.from("guestbook").insert([
        { name: guestName.trim(), message: guestMessage.trim() }
      ]);
      if (error) throw error;
      
      setGuestName("");
      setGuestMessage("");
      await fetchSignatures();
    } catch (err: any) {
      alert("Submission error: " + err.message);
    } finally {
      setIsGuestbookSubmitting(false);
    }
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
          entry.target.classList.add("active");
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
          {/* Top Header Section */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "12px" }}>
            <div 
              style={{
                background: "var(--card-bg)",
                border: "1.5px solid var(--border-color)",
                borderRadius: "12px",
                padding: "6px 14px",
                fontFamily: "var(--font-lcd)",
                fontSize: "0.75rem",
                color: "var(--color-amber-accent)",
                fontWeight: "bold",
                marginBottom: "16px",
                boxShadow: "3px 3px 0px var(--card-shadow)"
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
            className="flex-row-mobile-stack"
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
              className="creative-card splash-card full-width-mobile"
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
                borderColor: "var(--border-color)",
                boxShadow: "10px 10px 0px rgba(245, 159, 0, 0.15), 10px 10px 0px var(--card-shadow)"
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
              className="creative-card splash-card full-width-mobile"
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
                borderColor: "var(--border-color)",
                boxShadow: "10px 10px 0px rgba(147, 51, 234, 0.15), 10px 10px 0px var(--card-shadow)"
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
            className="main-content-wrapper"
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
              className="scroll-fade-in"
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
                  marginBottom: "36px",
                  minHeight: "1.65rem"
                }}
              >
                <TypewriterText 
                  text={mode === 'engineer' 
                    ? "// WEB APP DEVELOPER // DATA ANALYTICS & GEN-AI //" 
                    : "// AUDIO MIXING & POST PRODUCTION SPECIALIST //"
                  } 
                />
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
                  className="scroll-fade-in"
                  style={{
                    width: "100%",
                    maxWidth: "850px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    ...getSectionStyles(1)
                  }}
                >
                  <DeveloperResumeCard 
                    onInteract={unlockAudioContext} 
                    onLaunchDetails={(key) => { playBipSound(); setActiveDetailProject(key); }}
                  />
                </section>

                {/* Software Engineer: Polaroid Certifications */}
                <section 
                  ref={sectionRefs[2]}
                  data-section-idx="2"
                  className="scroll-fade-in"
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
                  className="scroll-fade-in"
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
                  className="scroll-fade-in"
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

            {/* Visual Divider */}
            <div 
              style={{
                width: "100%",
                maxWidth: mode === 'engineer' ? "850px" : "750px",
                borderTop: "3px dashed var(--border-color)",
                marginTop: "60px",
                marginBottom: "40px"
              }}
            />

            {/* Supabase Guestbook Card Footer */}
            <div 
              style={{
                width: "100%",
                maxWidth: mode === 'engineer' ? "850px" : "750px",
                background: "var(--color-amber)",
                border: "2.5px solid var(--border-color)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "6px 6px 0px var(--card-shadow)",
                marginBottom: "40px"
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--text-dark)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                ✍️ Guestbook Signature Log
              </h3>
              
              <form onSubmit={handleGuestbookSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  aria-label="Your Name"
                  style={{
                    flex: "1 1 200px",
                    background: "var(--card-bg)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "0.85rem",
                    outline: "none",
                    color: "var(--text-dark)"
                  }}
                />
                <input
                  type="text"
                  placeholder="Leave a short comment..."
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  required
                  aria-label="Your Comment"
                  style={{
                    flex: "2 1 350px",
                    background: "var(--card-bg)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "0.85rem",
                    outline: "none",
                    color: "var(--text-dark)"
                  }}
                />
                <button
                  type="submit"
                  disabled={isGuestbookSubmitting}
                  style={{
                    flex: "0 0 auto",
                    background: "var(--color-amber-accent)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "8px 24px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    color: "var(--card-bg)",
                    cursor: "pointer",
                    boxShadow: "3px 3px 0px var(--card-shadow)"
                  }}
                >
                  {isGuestbookSubmitting ? "SIGNING..." : "SIGN THE LOG"}
                </button>
              </form>

              {/* Guestbook signatures list */}
              <div style={{ marginTop: "16px", borderTop: "1.5px dashed var(--border-color)", paddingTop: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "8px", maxHeight: "120px", overflowY: "auto" }}>
                  {entries.length > 0 ? (
                    entries.map((ent) => (
                      <div key={ent.id} style={{ fontFamily: "var(--font-lcd)", fontSize: "0.68rem", color: "var(--text-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        &raquo; <span style={{ fontWeight: "bold" }}>{ent.name}</span>: {ent.message}
                      </div>
                    ))
                  ) : (
                    MOCK_ENTRIES.map((ent) => (
                      <div key={ent.id} style={{ fontFamily: "var(--font-lcd)", fontSize: "0.68rem", color: "var(--text-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        &raquo; <span style={{ fontWeight: "bold" }}>{ent.name}</span>: {ent.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

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

      {/* Fullscreen Detailed Project Explorer Console Modal */}
      {activeDetailProject && createPortal(
        <div 
          onClick={() => setActiveDetailProject(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(24, 24, 27, 0.55)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
            padding: "20px"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "1000px",
              height: "90vh",
              backgroundColor: "var(--card-bg)",
              border: "3px solid var(--border-color)",
              borderRadius: "16px",
              boxShadow: "12px 12px 0px var(--card-shadow)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            {/* Header console bar */}
            <div 
              style={{
                background: "var(--card-bg-muted)",
                borderBottom: "3px solid var(--border-color)",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.3rem" }}>📂</span>
                <span style={{ fontFamily: "var(--font-lcd)", fontWeight: "bold", fontSize: "0.85rem", color: "var(--color-amber-accent)" }}>
                  PROJECT CONSOLE: {activeDetailProject.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={() => setActiveDetailProject(null)}
                className="analog-btn active"
                style={{ padding: "6px 12px", fontSize: "0.75rem" }}
              >
                ✕ CLOSE PANEL
              </button>
            </div>

            {/* Project selection tabs inside modal */}
            <div 
              style={{
                display: "flex",
                background: "var(--card-bg)",
                borderBottom: "1.5px solid var(--border-color)",
                padding: "8px 12px",
                gap: "8px",
                overflowX: "auto"
              }}
            >
              {(["roadwatch", "harmony", "jobportal"] as const).map((key) => {
                const isActive = activeDetailProject === key;
                const icon = key === "roadwatch" ? "🏍️" : key === "harmony" ? "🧠" : "📊";
                const label = key === "roadwatch" ? "ROADWATCH" : key === "harmony" ? "HARMONY HUB" : "JOB PORTAL";
                return (
                  <button
                    key={key}
                    onClick={() => { playBipSound(); setActiveDetailProject(key); }}
                    className={`analog-btn ${isActive ? "active" : ""}`}
                    style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                  >
                    {icon} {label}
                  </button>
                );
              })}
            </div>

            {/* Split Screen Panel Content */}
            {(() => {
              const data = PROJECT_DETAILS_DATA[activeDetailProject];
              return (
                <div 
                  className="flex-row-mobile-stack"
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    overflow: "hidden"
                  }}
                >
                  {/* Left Column: Specs */}
                  <div 
                    className="full-width-mobile"
                    style={{
                      flex: "1.3 1 0",
                      padding: "24px",
                      overflowY: "auto",
                      borderRight: "2px solid var(--border-color)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px"
                    }}
                  >
                    <div>
                      <h2 style={{ fontSize: "1.4rem", fontWeight: "900", textTransform: "uppercase", marginBottom: "8px" }}>
                        {data.title}
                      </h2>
                      <p style={{ fontSize: "0.85rem", lineHeight: 1.45, opacity: 0.9 }}>
                        {data.pitch}
                      </p>
                    </div>

                    {/* GitHub Link button */}
                    <div>
                      <a 
                        href={data.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="analog-btn active"
                        style={{ display: "inline-flex", textDecoration: "none", color: "var(--card-bg)", padding: "8px 16px", fontSize: "0.8rem", gap: "6px" }}
                      >
                        VIEW WORK ON GITHUB 🔗
                      </a>
                    </div>

                    {/* Tech stack grid */}
                    <div style={{ background: "var(--card-bg-muted)", border: "1.5px solid var(--border-color)", borderRadius: "12px", padding: "14px" }}>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px", color: "var(--color-amber-accent)" }}>
                        ⚙️ Tech Stack & Dependencies
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {data.techStack.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", borderBottom: "1px dashed var(--border-color)", paddingBottom: "3px" }}>
                            <span style={{ fontWeight: "bold", opacity: 0.8 }}>{item.component}</span>
                            <span>{item.tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features list */}
                    <div>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
                        🚀 Key Features
                      </h3>
                      <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "6px", lineHeight: 1.4 }}>
                        {data.features.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Core Intelligence pipelines */}
                    <div>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
                        🧠 Core Intelligence
                      </h3>
                      <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "6px", lineHeight: 1.4 }}>
                        {data.coreIntelligence.map((intel, idx) => (
                          <li key={idx}>{intel}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Challenges faced */}
                    <div>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>
                        ⚖️ Development Challenges
                      </h3>
                      <p style={{ fontSize: "0.78rem", lineHeight: 1.45, opacity: 0.85 }}>
                        {data.challenges}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Visual screenshot feed */}
                  <div 
                    className="full-width-mobile"
                    style={{
                      flex: "0.9 1 0",
                      padding: "24px",
                      background: "var(--card-bg-muted)",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px"
                    }}
                  >
                    <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", color: "var(--text-muted)" }}>
                      🖼️ Visual Assets & Demos
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {data.images.map((imgSrc, idx) => {
                        const filename = imgSrc.split("/").pop();
                        return (
                          <div 
                            key={idx}
                            style={{
                              background: "var(--card-bg)",
                              border: "1.5px solid var(--border-color)",
                              borderRadius: "12px",
                              padding: "10px",
                              boxShadow: "4px 4px 0px var(--card-shadow)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px"
                            }}
                          >
                            <img 
                              src={imgSrc} 
                              alt={`${data.title} Asset ${idx + 1}`}
                              style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                                borderRadius: "6px",
                                border: "1px solid var(--border-color)"
                              }}
                              loading="lazy"
                            />
                            <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {filename}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default App;
