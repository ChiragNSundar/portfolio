import React, { useState, useEffect, useRef } from "react";
import { resumeData } from "../data/resume";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

interface CrtTerminalUnitProps {
  onInteract?: () => void;
}

export const CrtTerminalUnit: React.FC<CrtTerminalUnitProps> = ({ onInteract }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  
  // Guestbook workflow state machine
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
      "WELCOME TO CHIRAG N SUNDAR'S DEVELOPER PROFILE TERMINAL.",
      "TYPE 'help' FOR A LIST OF AVAILABLE COMMANDS.",
      "OR USE THE F-KEY MODULES BELOW.",
      ""
    ];

    if (isSupabaseConfigured) {
      lines.push("SUPABASE CONNECTIVITY: ONLINE (SECURE DIRECT ACCESS)");
    } else {
      lines.push("SUPABASE CONNECTIVITY: LOCAL OFFLINE DEMO MODE");
      lines.push("[NOTICE] ENV VARIABLES NOT SET. GUESTBOOK FALLS BACK TO LOCAL STORAGE.");
    }
    lines.push("");

    setHistory(lines);
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  // Focus input on clicking the terminal screen
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onInteract) onInteract();
  };

  // Synthesize terminal click sound
  const playClickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.02);
      
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
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
    setHistory(prev => [...prev, "RECORDING MESSAGE TO RETRO DATABASE SYSTEM..."]);
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("guestbook")
          .insert([{ name, message }]);

        if (error) throw error;
        setHistory(prev => [
          ...prev, 
          "GUESTBOOK WRITTEN TO SUPABASE BACKEND SUCCESSFULLY!",
          ""
        ]);
      } catch (err: any) {
        setHistory(prev => [
          ...prev, 
          `[DATABASE ERROR] COULD NOT INSERT: ${err.message || err}`,
          "SAVING TO LOCAL STORAGE BACKUP INSTEAD...",
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
      entries.push({ 
        id: Math.random().toString(), 
        name, 
        message, 
        created_at: new Date().toISOString() 
      });
      localStorage.setItem("guestbook", JSON.stringify(entries));
      setHistory(prev => [
        ...prev,
        "GUESTBOOK RECORDED IN LOCAL MEMORY BUFFER (OFFLINE).",
        ""
      ]);
    } catch (e) {
      setHistory(prev => [...prev, "[CRITICAL] STORAGE BUFFER ACCESS DENIED.", ""]);
    }
  };

  const fetchGuestbook = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("guestbook")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        
        if (!data || data.length === 0) {
          setHistory(prev => [...prev, "GUESTBOOK IS EMPTY. BE THE FIRST TO SIGN USING 'guestbook sign'!", ""]);
          return;
        }

        const lines = ["--- SUPABASE GUESTBOOK ENTRIES (LAST 10) ---"];
        data.forEach(entry => {
          const dateStr = new Date(entry.created_at).toLocaleDateString();
          lines.push(`[${dateStr}] ${entry.name.toUpperCase()}:`);
          lines.push(`  "${entry.message}"`);
        });
        lines.push("---------------------------------------------", "");
        setHistory(prev => [...prev, ...lines]);
      } catch (err: any) {
        setHistory(prev => [
          ...prev,
          `[ERROR] FETCH FAILED: ${err.message || err}`,
          "READING LOCAL STORAGE BACKUP DATABASE...",
          ""
        ]);
        readLocalGuestbook();
      }
    } else {
      setHistory(prev => [...prev, "[SYSTEM] SUPABASE COUPLING OFFLINE. ACCESING LOCAL STORAGE BUFFER...", ""]);
      readLocalGuestbook();
    }
  };

  const readLocalGuestbook = () => {
    try {
      const localData = localStorage.getItem("guestbook");
      const entries = localData ? JSON.parse(localData) : [];
      if (entries.length === 0) {
        setHistory(prev => [...prev, "NO LOCAL RECORDS FOUND. TYPE 'guestbook sign' TO RECORD A SIGNATURE.", ""]);
        return;
      }
      
      const lines = ["--- LOCAL STORAGE GUESTBOOK ENTRIES (DEMO) ---"];
      const lastTen = entries.slice(-10).reverse();
      lastTen.forEach((entry: any) => {
        const dateStr = new Date(entry.created_at).toLocaleDateString();
        lines.push(`[${dateStr}] ${entry.name.toUpperCase()}:`);
        lines.push(`  "${entry.message}"`);
      });
      lines.push("---------------------------------------------", "");
      setHistory(prev => [...prev, ...lines]);
    } catch (e) {
      setHistory(prev => [...prev, "[CRITICAL] ERROR RETRIEVING MEMORY BLOCK.", ""]);
    }
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
          "  skills         Listing of languages, databases & tools",
          "  education      College degree & coursework",
          "  certifications Infosys & freeCodeCamp credentials",
          "  guestbook      Interact with the database visitor book (list/sign)",
          "  clear          Clear the terminal screen"
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
            `----------------------------------------`,
            `ROLE: ${exp.role}`,
            `COMPANY: ${exp.company} (${exp.location})`,
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
            `----------------------------------------`,
            `PROJECT: ${proj.title}`,
            `TECH: ${proj.technologies.join(" | ")}`,
            `IMPACT:`
          );
          proj.bullets.forEach(bullet => {
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
          `  DEV TOOLS: ${resumeData.skills.tools.join(", ")}`,
          ""
        );
        break;
      case "education":
        newHistory.push(
          "EDUCATION DETAIL:",
          `  INSTITUTION: ${resumeData.education.institution}`,
          `  DEGREE: ${resumeData.education.degree}`,
          `  GPA: ${resumeData.education.gpa}`,
          `  PERIOD: ${resumeData.education.period}`,
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
          "GUESTBOOK COMMAND MODULES:",
          "  guestbook list  - View messages left by visitors",
          "  guestbook sign  - Sign the guestbook (stores in Supabase database)",
          ""
        );
        break;
      case "guestbook list":
        newHistory.push("QUERYING DATABASE RECORDS...");
        setHistory(newHistory);
        // Async fetch
        setTimeout(() => fetchGuestbook(), 100);
        return;
      case "guestbook sign":
        setGuestbookState('awaiting_name');
        newHistory.push("INITIALIZING SECURE GUESTBOOK WRITE PATH...", "ENTER NAME> ");
        setHistory(newHistory);
        return;
      case "clear":
        setHistory([]);
        return;
      case "":
        break;
      default:
        newHistory.push(`'${cmd}' is not recognized as an internal or external command, operable program or batch file. Type 'help' for assistance.`, "");
    }
    setHistory(newHistory);
  };

  const handleHotkey = (category: string) => {
    playClickSound();
    
    // Reset guestbook states if clicking hotkeys
    setGuestbookState('idle');
    setTempName('');
    
    executeCommand(category);
  };

  return (
    <div 
      className="crt-screen crt-scanlines crt-flicker-animation"
      style={{
        width: "100%",
        height: "380px",
        backgroundColor: "var(--color-amber-bg)",
        display: "flex",
        flexDirection: "column",
        border: "5px solid #2a1608",
      }}
      onClick={handleTerminalClick}
    >
      {/* Scrollable Output Screen */}
      <div 
        className="terminal-container"
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}
      >
        {history.map((line, idx) => (
          <div key={idx} style={{ minHeight: "1.2rem", whiteSpace: "pre-wrap" }}>
            {line}
          </div>
        ))}
        
        {/* Active Line Prompt */}
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
              fontSize: "1.25rem",
              textShadow: "var(--glow-amber)",
              flexGrow: 1,
              caretColor: "transparent"
            }}
          />
          <span className="terminal-cursor"></span>
        </div>
        <div ref={consoleEndRef} />
      </div>

      {/* Tactile Button Panel below screen */}
      <div 
        style={{
          backgroundColor: "#1c1c1f",
          borderTop: "2px solid var(--color-wood-dark)",
          padding: "6px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          overflowX: "auto"
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
