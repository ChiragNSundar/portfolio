import React, { useState, useEffect, useRef } from "react";
import { askChiragAI } from "../lib/ragEngine";

interface DeveloperResumeCardProps {
  onInteract?: () => void;
  onLaunchDetails?: (projectKey: "roadwatch" | "harmony" | "jobportal" | "aijdbot" | "vibelyrics") => void;
}

export const DeveloperResumeCard: React.FC<DeveloperResumeCardProps> = ({ onInteract, onLaunchDetails }) => {
  // Project Explorer state ('harmony' | 'roadwatch' | 'jobportal' | null)
  const [activeProject, setActiveProject] = useState<string | null>(null);

  // Live GitHub stats fetching with caching
  const [githubStats, setGithubStats] = useState<{
    commits: number;
    repos: number;
    followers: number;
    loading: boolean;
  }>({
    commits: 782,
    repos: 20,
    followers: 5,
    loading: true
  });

  // Count-up animation for GitHub stats
  const githubCardRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const [animatedStats, setAnimatedStats] = useState({ commits: 0, repos: 0, followers: 0 });

  useEffect(() => {
    if (githubStats.loading || hasAnimatedRef.current) return;
    const el = githubCardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();
          const duration = 1400;
          const frameRate = 16;
          const steps = Math.ceil(duration / frameRate);
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = Math.min(step / steps, 1);
            // easeOutCubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedStats({
              commits: Math.round(eased * githubStats.commits),
              repos: Math.round(eased * githubStats.repos),
              followers: Math.round(eased * githubStats.followers)
            });
            if (progress >= 1) clearInterval(timer);
          }, frameRate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [githubStats.loading, githubStats.commits, githubStats.repos, githubStats.followers]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userRes = await fetch("https://api.github.com/users/ChiragNSundar");
        let liveRepos = 20;
        let liveFollowers = 5;
        let liveCommits = 782;

        if (userRes.ok) {
          const userData = await userRes.json();
          liveRepos = userData.public_repos ?? 20;
          liveFollowers = userData.followers ?? 5;
        }

        try {
          const searchRes = await fetch("https://api.github.com/search/commits?q=author:ChiragNSundar", {
            headers: { Accept: "application/vnd.github.cloak-preview+json" }
          });
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (typeof searchData.total_count === "number" && searchData.total_count > 0) {
              // GitHub search API returns incomplete count (667); enforce baseline of 782 total contributions
              liveCommits = Math.max(782, searchData.total_count);
            }
          }
        } catch (_) {
          // ignore search API rate limit errors
        }

        setGithubStats({
          commits: liveCommits,
          repos: liveRepos,
          followers: liveFollowers,
          loading: false
        });
      } catch (err) {
        setGithubStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  // Chatbot state
  const [chatLog, setChatLog] = useState<{ sender: "user" | "bot"; text: string }[]>([
    {
      sender: "bot",
      text: "Hey! 👋 I'm Chirag's AI assistant — powered by an offline semantic RAG engine. Ask me anything about my projects, work experience, tech stack, or even interview-style questions like \"What's your biggest technical challenge?\" I'm ready to chat!"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<{ label: string; query: string }[]>([
    { label: "About Chirag 👤", query: "Who is Chirag?" },
    { label: "Projects 🚀", query: "What projects have you built?" },
    { label: "Technical Challenge 💪", query: "What's the most technically complex challenge you've faced?" },
    { label: "Quick Summary 📋", query: "Give me a quick summary" },
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleClearChat = () => {
    setChatLog([
      {
        sender: "bot",
        text: "Hey! 👋 I'm Chirag's AI assistant — powered by an offline semantic RAG engine. Ask me anything about my projects, work experience, tech stack, or even interview-style questions like \"What's your biggest technical challenge?\" I'm ready to chat!"
      }
    ]);
    setIsTyping(false);
    setSuggestions([
      { label: "About Chirag 👤", query: "Who is Chirag?" },
      { label: "Projects 🚀", query: "What projects have you built?" },
      { label: "Technical Challenge 💪", query: "What's the most technically complex challenge you've faced?" },
      { label: "Quick Summary 📋", query: "Give me a quick summary" },
    ]);
  };

  // Scroll chatbot to end on update (scrollTop, NOT scrollIntoView which jerks the whole page)
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatLog, isTyping]);

  // RAG-powered Chatbot Query Resolver
  const handleChatSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    
    const rawQuery = (typeof customQuery === "string" ? customQuery : chatInput).trim();
    if (!rawQuery) return;

    if (onInteract) onInteract();

    // Add user message to log immediately
    setChatLog(prev => [...prev, { sender: "user" as const, text: rawQuery }]);
    setChatInput("");
    setIsTyping(true);

    // Run the RAG engine (client-side, instant)
    // Small delay to show typing indicator for better UX
    setTimeout(() => {
      const result = askChiragAI(rawQuery);
      setIsTyping(false);
      setChatLog(prev => [...prev, { sender: "bot" as const, text: result.response }]);
      setSuggestions(result.suggestedFollowUps);
    }, 450 + Math.random() * 400);
  };

  return (
    <div 
      className="creative-card"
      style={{
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        borderColor: "var(--border-color)",
        boxShadow: "8px 8px 0px rgba(245, 159, 0, 0.15), 8px 8px 0px var(--card-shadow)"
      }}
    >
      {/* Dossier Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="bouncy-emoji" style={{ fontSize: "1.2rem" }}>💼</span>
          <span 
            style={{ 
              fontFamily: "var(--font-lcd)", 
              fontSize: "0.8rem", 
              color: "var(--color-amber-accent)",
              fontWeight: "bold",
              letterSpacing: "1px" 
            }}
          >
            SOFTWARE ENGINEER DOSSIER
          </span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
          [RNSIT GRADUATE // 8.89 GPA // DATA & GEN-AI FOCUS]
        </span>
      </div>

      {/* Short Bio Statement */}
      <div 
        style={{ 
          background: "var(--card-bg-muted)", 
          border: "1.5px solid var(--border-color)", 
          borderRadius: "12px", 
          padding: "14px 18px", 
          fontSize: "0.82rem", 
          lineHeight: 1.5,
          color: "var(--text-dark)",
          boxShadow: "3px 3px 0px var(--card-shadow)"
        }}
      >
        Result-driven Software Engineer specializing in Web App Development, Data Science/Analytics, and GenAI/AI Agents. Passionate about architecting and deploying high-quality, robust user-centric solutions.
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: "flex", gap: "28px", flexDirection: "column" }}>
        
        {/* ROW 1: CV Intro & Project Explorer */}
        <div 
          className="flex-row-mobile-stack"
          style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}
        >
          
          {/* Left Column: Education & Intern Info */}
          <div 
            className="full-width-mobile"
            style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ background: "var(--card-bg-muted)", border: "1.5px solid var(--border-color)", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "12px", borderBottom: "1.5px solid var(--border-color)", paddingBottom: "4px" }}>
                EDUCATION & PROFESSIONAL TIMELINE
              </h3>
              
              {/* College */}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>🎓 B.E. Computer Science & Engineering</span>
                  <span style={{ color: "var(--color-amber-accent)" }}>GPA: 8.89</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                  RNS Institute of Technology (RNSIT)
                </div>
              </div>

              {/* Current Job (RBCCI) */}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>🏦 AI Operations Specialist (Fulltime)</span>
                  <span style={{ color: "var(--color-amber-accent)" }}>May 2026 - Current</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
                  Rural Bank Of Calbayog City, Inc. (RBCCI) &middot; Freelance, Remote
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-dark)", opacity: 0.9, lineHeight: 1.35 }}>
                  Architected a core banking ecosystem with automated AMLA compliance and a 7-step loan pipeline. Built a high-performance Node.js/SQLite backend and edge AI biometric identity verification (TensorFlow.js + MediaPipe).
                </p>
              </div>

              {/* Internship */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>💼 Data Science & AI Intern (5 months)</span>
                  <span style={{ color: "var(--color-amber-accent)" }}>Nov 2025 - Apr 2026</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
                  WhatDigital Technologies
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-dark)", opacity: 0.9, lineHeight: 1.35 }}>
                  Engineered production-ready web interfaces, chatbot pipelines utilizing large language models, and clean data-driven MongoDB/MySQL BI analytics dashboards.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Project Explorer cards */}
          <div 
            className="full-width-mobile"
            style={{ flex: "1.2 1 400px", display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div style={{ background: "var(--card-bg)", border: "1.5px solid var(--border-color)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "900", borderBottom: "1.5px solid var(--border-color)", paddingBottom: "4px" }}>
                DETAILED PROJECT EXPLORER
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Click a card below to expand its technical workflows and interview validation sheets.
              </p>

              {/* Project 1: RoadWatch */}
              <div 
                onClick={() => setActiveProject(activeProject === "roadwatch" ? null : "roadwatch")}
                style={{
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  backgroundColor: activeProject === "roadwatch" ? "var(--color-amber)" : "var(--card-bg-muted)",
                  transition: "background-color 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>🏍️ RoadWatch: Smart Helmet Detection (2024)</span>
                  <span>{activeProject === "roadwatch" ? "▼" : "▶"}</span>
                </div>
                {activeProject === "roadwatch" && (
                  <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "var(--text-dark)", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px dashed var(--border-color)", paddingTop: "8px" }}>
                    <div><strong>Pitch:</strong> Real-time traffic monitoring system detecting helmet violations automatically using YOLOv8, extracting license plates via EasyOCR/PaddleOCR, and sending SMS alerts via an asynchronous FastAPI backend.</div>
                    <div><strong>Model Training:</strong> Custom-trained YOLOv8 model for 4 classes: <code>with helmet</code>, <code>without helmet</code>, <code>rider</code>, and <code>number plate</code>.</div>
                    <div><strong>Indian Plate Regex:</strong> Matches pattern <code>XX00XX0000</code> to prevent duplicate CSV entries.</div>
                    <div><strong>Challenges faced:</strong> Preprocessed blurry number plate frames in OpenCV and tuned confidence thresholds to combat poor lighting.</div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (onLaunchDetails) onLaunchDetails("roadwatch"); }}
                        style={{
                          flex: 1,
                          background: "var(--color-amber-accent)",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          boxShadow: "2px 2px 0px var(--card-shadow)"
                        }}
                      >
                        LAUNCH DETAILED PANEL 🚀
                      </button>
                      <a
                        href="https://github.com/ChiragNSundar/Helmet-Violation-Detection-and-License-Plate-Recognition-Realtime"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "var(--card-bg)",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          textDecoration: "none",
                          color: "var(--text-dark)",
                          cursor: "pointer",
                          boxShadow: "2px 2px 0px var(--card-shadow)"
                        }}
                      >
                        GITHUB REPO 🔗
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Project 2: Harmony Hub */}
              <div 
                onClick={() => setActiveProject(activeProject === "harmony" ? null : "harmony")}
                style={{
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  backgroundColor: activeProject === "harmony" ? "var(--color-amber)" : "var(--card-bg-muted)",
                  transition: "background-color 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>🧠 Harmony Hub: Mental Health Assistant (2023)</span>
                  <span>{activeProject === "harmony" ? "▼" : "▶"}</span>
                </div>
                {activeProject === "harmony" && (
                  <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "var(--text-dark)", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px dashed var(--border-color)", paddingTop: "8px" }}>
                    <div><strong>Pitch:</strong> Supportive mental wellness platform helping users track progress and converse with an AI chatbot.</div>
                    <div><strong>AI RAG Integration:</strong> Employs Retrieval-Augmented Generation to process uploaded PDF document text pipelines, delivering context-aware, personalized LLM responses instead of generic answers.</div>
                    <div><strong>NLP & Analytics:</strong> Uses natural language processing to comprehend conversations and integrates interactive Plotly charts in a Python Streamlit UI wrapper.</div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (onLaunchDetails) onLaunchDetails("harmony"); }}
                        style={{
                          flex: 1,
                          background: "var(--color-amber-accent)",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          boxShadow: "2px 2px 0px var(--card-shadow)"
                        }}
                      >
                        LAUNCH DETAILED PANEL 🚀
                      </button>
                      <a
                        href="https://github.com/Mental-Wellbeing-App/MentalHealthApp"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "var(--card-bg)",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          textDecoration: "none",
                          color: "var(--text-dark)",
                          cursor: "pointer",
                          boxShadow: "2px 2px 0px var(--card-shadow)"
                        }}
                      >
                        GITHUB REPO 🔗
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Project 3: Job Portal Analytics */}
              <div 
                onClick={() => setActiveProject(activeProject === "jobportal" ? null : "jobportal")}
                style={{
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  backgroundColor: activeProject === "jobportal" ? "var(--color-amber)" : "var(--card-bg-muted)",
                  transition: "background-color 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>📊 Job Portal Business Intelligence Dashboard</span>
                  <span>{activeProject === "jobportal" ? "▼" : "▶"}</span>
                </div>
                {activeProject === "jobportal" && (
                  <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "var(--text-dark)", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px dashed var(--border-color)", paddingTop: "8px" }}>
                    <div><strong>Pitch:</strong> Interactive business intelligence dashboard visualizing job board metrics.</div>
                    <div><strong>Database Pipeline:</strong> Connected to MongoDB and MySQL databases, optimized query pipelines, and loaded geospatial, device usage, and engagement trends in Plotly & Dash.</div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (onLaunchDetails) onLaunchDetails("jobportal"); }}
                        style={{
                          flex: 1,
                          background: "var(--color-amber-accent)",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          boxShadow: "2px 2px 0px var(--card-shadow)"
                        }}
                      >
                        LAUNCH DETAILED PANEL 🚀
                      </button>
                      <a
                        href="https://github.com/ChiragNSundar/JobPortalDashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "var(--card-bg)",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          textDecoration: "none",
                          color: "var(--text-dark)",
                          cursor: "pointer",
                          boxShadow: "2px 2px 0px var(--card-shadow)"
                        }}
                      >
                        GITHUB REPO 🔗
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Project 4: AI JD Bot */}
              <div 
                onClick={() => setActiveProject(activeProject === "aijdbot" ? null : "aijdbot")}
                style={{
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  backgroundColor: activeProject === "aijdbot" ? "var(--color-amber)" : "var(--card-bg-muted)",
                  transition: "background-color 0.2s",
                  marginTop: "8px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>🤖 AI JD Bot: Job Description Assistant</span>
                  <span>{activeProject === "aijdbot" ? "▼" : "▶"}</span>
                </div>
                {activeProject === "aijdbot" && (
                  <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "var(--text-dark)", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px dashed var(--border-color)", paddingTop: "8px" }}>
                    <div><strong>Pitch:</strong> AI-powered job description chatbot built with Flask and Gemini/Gemma models. Supports smart address collection, interactive OpenStreetMap rendering, resume PDF parsing, and document exports.</div>
                    <div><strong>Testing and Coverage:</strong> Strictly validated with Pydantic V2 and 490+ tests, including unit, Playwright E2E, chaos engineering database outages, and prompt injection filters.</div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (onLaunchDetails) onLaunchDetails("aijdbot"); }}
                        style={{
                          flex: 1,
                          background: "var(--color-amber-accent)",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          boxShadow: "2px 2px 0px var(--card-shadow)"
                        }}
                      >
                        LAUNCH DETAILED PANEL 🚀
                      </button>
                      <a
                        href="https://github.com/ChiragNSundar/ai-jd-bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "var(--card-bg)",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          textDecoration: "none",
                          color: "var(--text-dark)",
                          cursor: "pointer",
                          boxShadow: "2px 2px 0px var(--card-shadow)"
                        }}
                      >
                        GITHUB REPO 🔗
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Project 5: VibeLyrics */}
              <div 
                onClick={() => setActiveProject(activeProject === "vibelyrics" ? null : "vibelyrics")}
                style={{
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  backgroundColor: activeProject === "vibelyrics" ? "var(--color-amber)" : "var(--card-bg-muted)",
                  transition: "background-color 0.2s",
                  marginTop: "8px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>🎤 VibeLyrics: Hip-Hop Writing Assistant</span>
                  <span>{activeProject === "vibelyrics" ? "▼" : "▶"}</span>
                </div>
                {activeProject === "vibelyrics" && (
                  <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "var(--text-dark)", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px dashed var(--border-color)", paddingTop: "8px" }}>
                    <div><strong>Pitch:</strong> Professional-grade hip-hop lyric writing assistant and analysis suite combining distraction-free workspace interfaces, real-time assonance highlighting, and Continual DPO adapter retraining pipelines.</div>
                    <div><strong>Key Infrastructure:</strong> Powered by React 19, Zustand 5 atomic state, FastAPI, SQLAlchemy async DB pools, and Librosa audio processing tools. Fully packaged as a dreamy, glassmorphic offline PWA.</div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (onLaunchDetails) onLaunchDetails("vibelyrics"); }}
                        style={{
                          flex: 1,
                          background: "var(--color-amber-accent)",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          boxShadow: "2px 2px 0px var(--card-shadow)"
                        }}
                      >
                        LAUNCH DETAILED PANEL 🚀
                      </button>
                      <a
                        href="https://github.com/ChiragNSundar/VibeLyrics"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "var(--card-bg)",
                          border: "1.5px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          textDecoration: "none",
                          color: "var(--text-dark)",
                          cursor: "pointer",
                          boxShadow: "2px 2px 0px var(--card-shadow)"
                        }}
                      >
                        GITHUB REPO 🔗
                      </a>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* ROW 2: ASK CHIRAG AI CHATBOT & SKILLS DATA */}
        <div 
          className="flex-row-mobile-stack"
          style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}
        >
          
          {/* Chatbot Console (60%) */}
          <div 
            className="full-width-mobile"
            style={{
              flex: "1.5 1 450px",
              background: "var(--card-bg)",
              border: "1.5px solid var(--border-color)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid var(--border-color)", paddingBottom: "6px" }}>
              <span style={{ fontWeight: "900", fontSize: "1rem", display: "flex", alignItems: "center", gap: "6px" }}>
                🤖 Ask Chirag AI
              </span>
              <span style={{ fontSize: "0.6rem", background: "var(--color-amber)", border: "1px solid var(--border-color)", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
                OFFLINE RAG ⚡
              </span>
            </div>

            {/* Chat Messages scroll container */}
            <div 
              ref={chatContainerRef}
              style={{
                height: "350px",
                overflowY: "auto",
                border: "1.5px solid var(--border-color)",
                borderRadius: "12px",
                background: "var(--card-bg-muted)",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              {chatLog.map((chat, idx) => (
                <div 
                  key={idx} 
                  style={{
                    alignSelf: chat.sender === "user" ? "flex-end" : "flex-start",
                    background: chat.sender === "user" ? "var(--color-amber)" : "var(--card-bg)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: chat.sender === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    padding: "8px 12px",
                    maxWidth: "85%",
                    fontSize: "0.78rem",
                    lineHeight: 1.35,
                    boxShadow: "2px 2px 0px rgba(0,0,0,0.05)",
                    color: "var(--text-dark)"
                  }}
                >
                  <div style={{ fontSize: "0.6rem", fontWeight: "bold", color: chat.sender === "user" ? "#7a5a07" : "var(--text-muted)", marginBottom: "2px" }}>
                    {chat.sender === "user" ? "YOU" : "CHIRAG AI"}
                  </div>
                  <div style={{ whiteSpace: "pre-line" }}>{chat.text}</div>
                </div>
              ))}
              
              {/* Typing indicator bubble */}
              {isTyping && (
                <div 
                  style={{
                    alignSelf: "flex-start",
                    background: "var(--card-bg)",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "12px 12px 12px 2px",
                    padding: "8px 12px",
                    maxWidth: "85%",
                    fontSize: "0.78rem",
                    boxShadow: "2px 2px 0px rgba(0,0,0,0.05)"
                  }}
                >
                  <div style={{ fontSize: "0.6rem", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "2px" }}>
                    CHIRAG AI
                  </div>
                  <div className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestion Chips */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {suggestions.map((sug, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleChatSubmit(undefined, sug.query)}
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "20px",
                    padding: "3px 10px",
                    fontSize: "0.65rem",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    color: "var(--text-dark)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--card-bg-muted)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--card-bg)"}
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={(e) => handleChatSubmit(e)} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Ask anything — projects, skills, challenges, interview Q&A..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                aria-label="Chatbot input"
                autoComplete="off"
                style={{
                  flexGrow: 1,
                  background: "var(--card-bg)",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  outline: "none",
                  color: "var(--text-dark)"
                }}
              />
              <button
                type="submit"
                style={{
                  background: "var(--color-amber-accent)",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "3px 3px 0px var(--card-shadow)"
                }}
              >
                ASK
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                style={{
                  background: "var(--card-bg-muted)",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "3px 3px 0px var(--card-shadow)",
                  color: "var(--text-dark)"
                }}
                title="Clear Chat Logs"
              >
                🗑️
              </button>
            </form>
          </div>

          {/* GitHub Activity & Tech Stack Panel (40%) */}
          <div 
            className="full-width-mobile"
            style={{ flex: "1.2 1 300px", display: "flex", flexDirection: "column", gap: "18px" }}
          >
            
            {/* Tech Stack Deck */}
            <div style={{ background: "var(--card-bg)", border: "1.5px solid var(--border-color)", borderRadius: "16px", padding: "16px" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: "bold", color: "var(--color-amber-accent)", letterSpacing: "1px", display: "block", marginBottom: "10px", textTransform: "uppercase" }}>
                💻 Tech Stack Deck
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[
                  { name: "Python", bg: "#3776AB", color: "#ffffff" },
                  { name: "C", bg: "#00599C", color: "#ffffff" },
                  { name: "MySQL", bg: "#4479A1", color: "#ffffff" },
                  { name: "SQLite", bg: "#003B57", color: "#ffffff" },
                  { name: "MongoDB", bg: "#47A248", color: "#ffffff" },
                  { name: "Flask", bg: "#000000", color: "#ffffff" },
                  { name: "Power BI", bg: "#F2C811", color: "#000000" },
                  { name: "HTML5", bg: "#E34F26", color: "#ffffff" },
                  { name: "CSS", bg: "#1572B6", color: "#ffffff" },
                  { name: "JavaScript", bg: "#F7DF1E", color: "#000000" },
                  { name: "SQLAlchemy", bg: "#D71F1F", color: "#ffffff" },
                  { name: "Pandas", bg: "#150458", color: "#ffffff" },
                  { name: "NumPy", bg: "#013243", color: "#ffffff" },
                  { name: "Matplotlib", bg: "var(--card-bg)", color: "var(--text-dark)", border: "1px solid var(--border-color)" },
                  { name: "YOLO", bg: "#002F6C", color: "#ffffff" },
                  { name: "OpenCV", bg: "#5C3EE8", color: "#ffffff" },
                  { name: "Plotly", bg: "#3F4F75", color: "#ffffff" },
                  { name: "Streamlit", bg: "#FF4B4B", color: "#ffffff" },
                  { name: "Dash", bg: "#0088CC", color: "#ffffff" },
                  { name: "PyTorch", bg: "#EE4C2C", color: "#ffffff" },
                  { name: "TensorFlow", bg: "#FF6F00", color: "#ffffff" },
                  { name: "Ultralytics", bg: "#042F66", color: "#ffffff" },
                  { name: "LangChain", bg: "#00A3A3", color: "#ffffff" },
                  { name: "HuggingFace", bg: "#FFD21E", color: "#000000" },
                  { name: "Scikit-Learn", bg: "#F7931E", color: "#ffffff" },
                  { name: "VS Code", bg: "#007ACC", color: "#ffffff" },
                  { name: "Git", bg: "#F05032", color: "#ffffff" }
                ].map((tech, idx) => (
                  <span
                    key={idx}
                    className="tech-badge"
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: "bold",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: tech.bg,
                      color: tech.color,
                      border: tech.border || "1.5px solid var(--border-color)",
                      boxShadow: "2px 2px 0px var(--card-shadow)",
                      textTransform: "uppercase"
                    }}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* GitHub Stats & Heatmap - Dark Theme */}
            <div
              ref={githubCardRef}
              style={{
                background: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
              }}
            >
              {/* Header with Octocat logo */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* GitHub Octocat SVG */}
                  <svg height="28" viewBox="0 0 16 16" width="28" fill="#e6edf3" style={{ flexShrink: 0 }}>
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                  </svg>
                  <span style={{
                    fontSize: "0.78rem",
                    fontWeight: "800",
                    color: "#e6edf3",
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-lcd)"
                  }}>
                    GitHub Activity
                  </span>
                </div>
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "0.6rem",
                  fontWeight: "bold",
                  color: githubStats.loading ? "#848d97" : "#3fb950",
                  letterSpacing: "0.5px"
                }}>
                  <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: githubStats.loading ? "#848d97" : "#3fb950",
                    display: "inline-block",
                    boxShadow: githubStats.loading ? "none" : "0 0 6px #3fb950",
                    animation: githubStats.loading ? "none" : "pulse 2s infinite"
                  }} />
                  {githubStats.loading ? "SYNCING" : "LIVE"}
                </span>
              </div>

              {/* Stat counters row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {/* Commits */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(219,39,119,0.12) 0%, rgba(219,39,119,0.04) 100%)",
                  border: "1px solid rgba(219,39,119,0.25)",
                  borderRadius: "12px",
                  padding: "12px 8px",
                  textAlign: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(219,39,119,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "900",
                    color: "#f472b6",
                    fontFamily: "var(--font-lcd)",
                    textShadow: "0 0 12px rgba(244,114,182,0.4)"
                  }}>
                    {animatedStats.commits}+
                  </div>
                  <div style={{ fontSize: "0.55rem", color: "#848d97", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.8px", marginTop: "2px" }}>Contributions</div>
                </div>

                {/* Repos */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: "12px",
                  padding: "12px 8px",
                  textAlign: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,130,246,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "900",
                    color: "#60a5fa",
                    fontFamily: "var(--font-lcd)",
                    textShadow: "0 0 12px rgba(96,165,250,0.4)"
                  }}>
                    {animatedStats.repos}
                  </div>
                  <div style={{ fontSize: "0.55rem", color: "#848d97", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.8px", marginTop: "2px" }}>Public Repos</div>
                </div>

                {/* Followers */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(234,179,8,0.12) 0%, rgba(234,179,8,0.04) 100%)",
                  border: "1px solid rgba(234,179,8,0.25)",
                  borderRadius: "12px",
                  padding: "12px 8px",
                  textAlign: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(234,179,8,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "900",
                    color: "#facc15",
                    fontFamily: "var(--font-lcd)",
                    textShadow: "0 0 12px rgba(250,204,21,0.4)"
                  }}>
                    {animatedStats.followers}
                  </div>
                  <div style={{ fontSize: "0.55rem", color: "#848d97", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.8px", marginTop: "2px" }}>Followers</div>
                </div>
              </div>

              {/* Contribution heatmap */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: "800", color: "#848d97", letterSpacing: "0.8px", textTransform: "uppercase" }}>
                    Contribution Activity
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <span style={{ fontSize: "0.5rem", color: "#484f58" }}>Less</span>
                    {["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"].map((c, i) => (
                      <div key={i} style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: c }} />
                    ))}
                    <span style={{ fontSize: "0.5rem", color: "#484f58" }}>More</span>
                  </div>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(21, 1fr)",
                  gap: "3px",
                  width: "100%",
                  background: "#010409",
                  border: "1px solid #21262d",
                  borderRadius: "10px",
                  padding: "10px"
                }}>
                  {/* Hand-crafted pattern matching real contribution graph:
                      Columns map to weeks (Jul→Jul), Rows = Mon/Wed/Fri
                      Sparse Jul-Nov, heavy Dec-Mar, moderate Apr-Jul */}
                  {[
                    // Jul-Aug (sparse)
                    0,0,0, 0,1,0, 0,0,0, 0,0,1, 0,0,0,
                    // Sep-Nov (very sparse with occasional)
                    0,0,0, 0,0,0, 0,1,0, 1,0,0, 0,0,0, 0,1,0,
                    // Dec-Jan (heavy activity)
                    2,3,2, 4,3,5, 3,4,3, 5,2,4, 3,5,3, 4,3,2,
                    // Feb-Mar (heavy continued)
                    3,2,4, 5,3,2, 2,4,3, 3,2,1, 2,3,2, 1,2,0,
                    // Apr-May (moderate tapering)
                    0,1,0, 0,2,1, 0,0,1, 1,0,0, 2,1,0,
                    // Jun-Jul (some recent activity)
                    1,2,0, 0,1,2, 1,3,1, 2,1,0, 0,1,2, 1,0,0
                  ].map((level, i) => {
                    const shades = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
                    return (
                      <div
                        key={i}
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          borderRadius: "2px",
                          backgroundColor: shades[Math.min(level, 4)],
                          border: "0.5px solid rgba(255,255,255,0.03)",
                          transition: "transform 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default DeveloperResumeCard;
