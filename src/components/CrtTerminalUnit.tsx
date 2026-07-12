import React, { useState, useEffect, useRef } from "react";
import { resumeData } from "../data/resume";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

interface CrtTerminalUnitProps {
  onInteract?: () => void;
}

export const CrtTerminalUnit: React.FC<CrtTerminalUnitProps> = ({ onInteract }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [guestbookState, setGuestbookState] = useState<'idle' | 'awaiting_name' | 'awaiting_message'>('idle');
  const [tempName, setTempName] = useState('');

  const consoleEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize terminal output with system status
  useEffect(() => {
    const lines = [
      "MICROSOFT(R) MS-DOS(R) VERSION 6.22",
      "(C)COPYRIGHT MICROSOFT CORP 1981-1994.",
      "",
      "WELCOME TO CHIRAG N SUNDAR'S RESUME PORTAL.",
      "TYPE 'help' FOR SYSTEM COMMANDS OR USE THE F-KEYS.",
      ""
    ];

    if (isSupabaseConfigured) {
      lines.push("SUPABASE CHANNEL: CONNECTED");
    } else {
      lines.push("SUPABASE CHANNEL: LOCAL OFFLINE MODE");
    }
    lines.push("");

    setHistory(lines);
  }, []);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onInteract) onInteract();
  };

  const playClickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.015);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.015);
    } catch (e) {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playClickSound();
    
    if (e.key === "Enter") {
      const trimmed = inputVal.trim();
      
      if (guestbookState === 'awaiting_name') {
        if (!trimmed) {
          setHistory(prev => [...prev, "NAME CANNOT BE EMPTY.", "ENTER NAME> "]);
          setInputVal("");
          return;
        }
        setTempName(trimmed);
        setGuestbookState('awaiting_message');
        setHistory(prev => [...prev, trimmed, "ENTER MESSAGE> "]);
        setInputVal("");
      } 
      else if (guestbookState === 'awaiting_message') {
        if (!trimmed) {
          setHistory(prev => [...prev, "MESSAGE CANNOT BE EMPTY.", "ENTER MESSAGE> "]);
          setInputVal("");
          return;
        }
        setHistory(prev => [...prev, trimmed]);
        submitGuestbookEntry(tempName, trimmed);
        setInputVal("");
      } 
      else {
        executeCommand(trimmed.toLowerCase());
        setInputVal("");
      }
    }
  };

  const submitGuestbookEntry = async (name: string, message: string) => {
    setHistory(prev => [...prev, "WRITING TO DATABASE STACKS..."]);
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("guestbook").insert([{ name, message }]);
        if (error) throw error;
        setHistory(prev => [...prev, "DATABASE RECORDED SUCCESSFULLY!", ""]);
      } catch (err: any) {
        setHistory(prev => [
          ...prev, 
          `[ERROR] ${err.message || err}`,
          "SAVED IN LOCAL STORAGE BUFFER.",
          ""
        ]);
        saveLocalGuestbook(name, message);
      }
    } else {
      saveLocalGuestbook(name, message);
    }
    setGuestbookState('idle');
    setTempName('');
  };

  const saveLocalGuestbook = (name: string, message: string) => {
    try {
      const localData = localStorage.getItem("guestbook");
      const entries = localData ? JSON.parse(localData) : [];
      entries.push({ id: Math.random().toString(), name, message, created_at: new Date().toISOString() });
      localStorage.setItem("guestbook", JSON.stringify(entries));
      setHistory(prev => [...prev, "LOCAL STORAGE GUESTBOOK SIGNED.", ""]);
    } catch (e) {
      setHistory(prev => [...prev, "[BUFFER ERROR] STORAGE ACCESS DENIED.", ""]);
    }
  };

  const fetchGuestbook = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("guestbook")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6); // fit on visual scope

        if (error) throw error;
        if (!data || data.length === 0) {
          setHistory(prev => [...prev, "GUESTBOOK EMPTY. TYPE 'guestbook sign' TO SIGN.", ""]);
          return;
        }

        const lines = ["--- GUESTBOOK REGISTRY (LAST 6) ---"];
        data.forEach(entry => {
          lines.push(`[${entry.name.toUpperCase()}]: "${entry.message}"`);
        });
        lines.push("----------------------------------", "");
        setHistory(prev => [...prev, ...lines]);
      } catch (err: any) {
        setHistory(prev => [...prev, `[FETCH ERROR] ${err.message || err}`, ""]);
        readLocalGuestbook();
      }
    } else {
      readLocalGuestbook();
    }
  };

  const readLocalGuestbook = () => {
    try {
      const localData = localStorage.getItem("guestbook");
      const entries = localData ? JSON.parse(localData) : [];
      if (entries.length === 0) {
        setHistory(prev => [...prev, "NO LOCAL RECORDS FOUND. SIGN USING 'guestbook sign'!", ""]);
        return;
      }
      const lines = ["--- GUESTBOOK (LOCAL DEMO) ---"];
      const lastSix = entries.slice(-6).reverse();
      lastSix.forEach((entry: any) => {
        lines.push(`[${entry.name.toUpperCase()}]: "${entry.message}"`);
      });
      lines.push("------------------------------", "");
      setHistory(prev => [...prev, ...lines]);
    } catch (e) {}
  };

  const executeCommand = (cmd: string) => {
    const newHistory = [...history, `C:\\CHIRAG\\RESUME> ${cmd}`];

    switch (cmd) {
      case "help":
        newHistory.push(
          "AVAILABLE COMMANDS:",
          "  help           Display this guide",
          "  about          Summary of qualifications & contacts",
          "  experience     Detailed job history",
          "  projects       Showcase of software engineering projects",
          "  skills         Listing of languages & tools",
          "  education      College degree & coursework",
          "  certifications Infosys & FCC credentials",
          "  guestbook      Interact with database (list/sign)",
          "  clear          Clear console screen"
        );
        break;
      case "about":
        newHistory.push(
          `NAME: ${resumeData.name}`,
          `TITLE: ${resumeData.title}`,
          `EMAIL: ${resumeData.email}`,
          `GITHUB: ${resumeData.github}`,
          `LINKEDIN: ${resumeData.linkedin}`,
          `SUMMARY: ${resumeData.about}`,
          ""
        );
        break;
      case "experience":
        resumeData.experience.forEach(exp => {
          newHistory.push(
            `-----------------------------------`,
            `ROLE: ${exp.role}`,
            `COMPANY: ${exp.company}`,
            `PERIOD: ${exp.period}`,
            `DETAILS:`
          );
          exp.bullets.forEach(bullet => {
            newHistory.push(`  * ${bullet}`);
          });
        });
        newHistory.push("");
        break;
      case "projects":
        resumeData.projects.forEach(proj => {
          newHistory.push(
            `-----------------------------------`,
            `PROJECT: ${proj.title}`,
            `TECH: ${proj.technologies.slice(0, 3).join(", ")}`,
            `IMPACT:`
          );
          proj.bullets.slice(0, 2).forEach(bullet => {
            newHistory.push(`  * ${bullet}`);
          });
        });
        newHistory.push("");
        break;
      case "skills":
        newHistory.push(
          "TECHNICAL SKILLS:",
          `  LANGUAGES: ${resumeData.skills.languages.join(", ")}`,
          `  FRAMEWORKS: ${resumeData.skills.frameworks.join(", ")}`,
          `  DATABASES: ${resumeData.skills.databases.join(", ")}`,
          `  DEV TOOLS: ${resumeData.skills.tools.slice(0, 5).join(", ")}`,
          ""
        );
        break;
      case "education":
        newHistory.push(
          "EDUCATION DETAIL:",
          `  INSTITUTION: ${resumeData.education.institution}`,
          `  DEGREE: ${resumeData.education.degree}`,
          `  GPA: ${resumeData.education.gpa}`,
          `  COURSEWORK: ${resumeData.education.coursework}`,
          ""
        );
        break;
      case "certifications":
        newHistory.push("CERTIFICATIONS:");
        resumeData.certifications.forEach(cert => {
          newHistory.push(`  - ${cert}`);
        });
        newHistory.push("");
        break;
      case "guestbook":
      case "guestbook help":
        newHistory.push(
          "GUESTBOOK MODULE:",
          "  guestbook list  - View messages left by visitors",
          "  guestbook sign  - Sign the visitor log",
          ""
        );
        break;
      case "guestbook list":
        newHistory.push("RETRIEVING REGISTRY STACKS...");
        setHistory(newHistory);
        setTimeout(() => fetchGuestbook(), 100);
        return;
      case "guestbook sign":
        setGuestbookState('awaiting_name');
        newHistory.push("INITIALIZING DB PATH...", "ENTER NAME> ");
        setHistory(newHistory);
        return;
      case "clear":
        setHistory([]);
        return;
      case "":
        break;
      default:
        newHistory.push(`'${cmd}' is not recognized as a command. Type 'help'.`, "");
    }
    setHistory(newHistory);
  };

  const handleHotkey = (category: string) => {
    playClickSound();
    setGuestbookState('idle');
    setTempName('');
    executeCommand(category);
  };

  return (
    <div 
      className="console-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "360px",
        border: "1px solid var(--color-gold-dark)",
        boxShadow: "inset 0 0 15px rgba(0,0,0,0.95)"
      }}
    >
      {/* 2-Column Split Console View */}
      <div 
        style={{
          display: "flex",
          flexGrow: 1,
          height: "calc(100% - 45px)",
          overflow: "hidden"
        }}
      >
        {/* Left Column: MS-DOS Resume CLI (60%) */}
        <div 
          className="crt-screen crt-scanlines crt-flicker-animation"
          style={{
            width: "58%",
            height: "100%",
            backgroundColor: "var(--color-amber-bg)",
            display: "flex",
            flexDirection: "column",
            borderRight: "2px solid #202024"
          }}
          onClick={handleTerminalClick}
        >
          <div 
            className="terminal-container"
            style={{
              flexGrow: 1,
              padding: "10px",
              fontSize: "1.1rem"
            }}
          >
            {history.map((line, idx) => (
              <div 
                key={idx} 
                style={{ 
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.3",
                  marginBottom: "2px"
                }}
              >
                {line === "" ? "\u00A0" : line}
              </div>
            ))}
            
            {/* Active Prompt */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>
                {guestbookState === 'awaiting_name' 
                  ? "ENTER NAME> " 
                  : guestbookState === 'awaiting_message' 
                    ? "ENTER MESSAGE> " 
                    : "C:\\CHIRAG\\RESUME> "
                }
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--color-gold-light)",
                  fontFamily: "var(--font-retro)",
                  fontSize: "1.1rem",
                  textShadow: "var(--glow-amber)",
                  flexGrow: 1,
                  caretColor: "transparent"
                }}
              />
              <span className="terminal-cursor"></span>
            </div>
            <div ref={consoleEndRef} />
          </div>
        </div>

        {/* Right Column: Signal Analytics Display (42%) */}
        <div 
          style={{
            width: "42%",
            height: "100%",
            background: "#08080a",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderLeft: "1.5px solid #202024",
            fontFamily: "var(--font-lcd)"
          }}
        >
          {/* Section 1: Sunburst circular SVG */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", flexGrow: 1, justifyContent: "center" }}>
            <span style={{ fontSize: "0.55rem", color: "var(--color-gold)", letterSpacing: "1px", marginBottom: "4px", fontWeight: "bold" }}>
              SYSTEM DYNAMICS / SKILL MAP
            </span>
            <svg width="105" height="105" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#222" strokeWidth="10" />
              
              {/* Outer multi-color segments */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="#ff007f" strokeWidth="8" strokeDasharray="60 200" strokeDashoffset="0" className="sunburst-ring" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#00ffff" strokeWidth="8" strokeDasharray="80 200" strokeDashoffset="70" className="sunburst-ring" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#ffaa00" strokeWidth="8" strokeDasharray="40 200" strokeDashoffset="160" className="sunburst-ring" />
              
              {/* Middle segment ring */}
              <circle cx="50" cy="50" r="32" fill="none" stroke="#222" strokeWidth="8" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="#00ff66" strokeWidth="6" strokeDasharray="90 200" strokeDashoffset="20" className="sunburst-ring" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="#b983ff" strokeWidth="6" strokeDasharray="60 200" strokeDashoffset="120" className="sunburst-ring" />

              {/* Inner core */}
              <circle cx="50" cy="50" r="18" fill="#151518" stroke="var(--color-gold-dark)" strokeWidth="1" />
              <text x="50" y="52" fill="var(--color-gold-light)" fontSize="6.5" textAnchor="middle" fontWeight="bold">HUD</text>
            </svg>
          </div>

          {/* Section 2: Treemap boxes SVG */}
          <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "120px" }}>
            <span style={{ fontSize: "0.55rem", color: "var(--color-gold)", letterSpacing: "1px", marginBottom: "4px", fontWeight: "bold", textAlign: "center" }}>
              DEVELOPMENT INTELMAP
            </span>
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gridTemplateRows: "1.2fr 1fr",
                gap: "4px",
                flexGrow: 1
              }}
            >
              {/* TensorFlow Box */}
              <div 
                style={{
                  background: "rgba(185, 131, 255, 0.15)",
                  border: "1px solid #b983ff",
                  borderRadius: "2px",
                  padding: "4px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <span style={{ color: "#b983ff", fontSize: "0.55rem", fontWeight: "bold" }}>TensorFlow.js</span>
                <span style={{ color: "#fff", fontSize: "0.45rem", opacity: 0.6 }}>Biometrics</span>
              </div>

              {/* Node.js Box */}
              <div 
                style={{
                  background: "rgba(0, 255, 120, 0.15)",
                  border: "1px solid #00ff78",
                  borderRadius: "2px",
                  padding: "4px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <span style={{ color: "#00ff78", fontSize: "0.55rem", fontWeight: "bold" }}>Node.js</span>
                <span style={{ color: "#fff", fontSize: "0.45rem", opacity: 0.6 }}>API</span>
              </div>

              {/* Python Box */}
              <div 
                style={{
                  background: "rgba(255, 170, 0, 0.15)",
                  border: "1px solid #ffaa00",
                  borderRadius: "2px",
                  padding: "4px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gridColumn: "span 2"
                }}
              >
                <span style={{ color: "#ffaa00", fontSize: "0.55rem", fontWeight: "bold" }}>Python (GenAI / YOLO OpenCV)</span>
                <span style={{ color: "#fff", fontSize: "0.45rem", opacity: 0.6 }}>Computer Vision & AI Agents</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Tactile Keycap Buttons Panel at the bottom */}
      <div 
        style={{
          backgroundColor: "#1c1c1f",
          borderTop: "2px solid #28282c",
          padding: "6px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          height: "45px"
        }}
      >
        <button className="analog-btn" onClick={() => handleHotkey("about")}>
          F1 BIO
        </button>
        <button className="analog-btn" onClick={() => handleHotkey("experience")}>
          F2 EXP
        </button>
        <button className="analog-btn" onClick={() => handleHotkey("skills")}>
          F3 SKILLS
        </button>
        <button className="analog-btn" onClick={() => handleHotkey("projects")}>
          F4 PROJ
        </button>
        <button className="analog-btn" onClick={() => handleHotkey("guestbook list")}>
          F5 BOOK
        </button>
      </div>
    </div>
  );
};
