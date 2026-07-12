import React, { useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

interface DeveloperResumeCardProps {
  onInteract?: () => void;
}

// Chatbot Knowledge Base
const CHATBOT_KB: Record<string, string> = {
  intro: "Hi, I'm Chirag — a Software Engineer specializing in Web App Development, Data Analytics, and Generative AI. I graduated with a B.E. in CS from RNSIT (GPA 8.89). I previously interned at WhatDigital Technologies (Data Science & AI, 5 months) and currently work as an AI Operations Specialist at Rural Bank of Calbayog City, Inc. (RBCCI), where I architect core banking systems with AMLA compliance and edge AI biometric verification.",
  rag: "RAG stands for Retrieval-Augmented Generation. Instead of giving generic AI responses, in Harmony Hub, the chatbot first retrieves relevant information from uploaded documents (using a PDF parser text pipeline) and then generates context-aware answers. This makes responses accurate and personalized.",
  nlp: "NLP (Natural Language Processing) was used in Harmony Hub to understand user input, analyze text queries, and improve chatbot interactions, facilitating natural, empathetic conversations instead of simple keyword-based replies.",
  streamlit: "I chose Streamlit for Harmony Hub because it allowed me to build an interactive, responsive web interface rapidly in Python, focusing my efforts on AI RAG functionality and analytics visualization.",
  yolo: "RoadWatch uses YOLOv8 for real-time computer vision object detection. The model has been custom-trained to detect four specific classes: 'with helmet', 'without helmet', 'rider', and 'number plate' (defined in our coco128.yaml config). The camera feed is processed frame by frame using OpenCV.",
  regex: "For Indian vehicle number plates, RoadWatch validates the format using regex patterns. The expected format is 'XX00XX0000' (two state letters, two RTO numbers, two letters, and four sequence numbers). Once validated, it stores the text in a CSV file to prevent duplicate logs.",
  challenges: "In RoadWatch, a key challenge was maintaining accurate detection in varying traffic lights and weather conditions, as well as handling blurry plates in OCR. I improved this by applying OpenCV frame preprocessing and tuning confidence thresholds.",
  pride: "I am most proud of the RoadWatch project because it combines real-time computer vision, backend API processing, and practical safety impacts. It was satisfying to build something that could contribute to road safety.",
  learning: "I approach new tech by first understanding the fundamentals, then building small prototypes, and finally integrating it into actual projects. Hands-on development is my core learning vector.",
  strengths: "My strengths are: \n1. Problem-Solving & Logical thinking.\n2. Teamwork (taking initiative to coordinate tasks in college projects to keep everyone aligned).\n3. Attention to detail.",
  weaknesses: "My weaknesses are: \n1. Perfectionism (sometimes spending too much time on small details. I balance this by setting time limits).\n2. Asking for help (earlier I hesitated to reach out, but now I actively collaborate to get faster results).",
  internship: "Previously, Chirag worked as a Data Science & AI Intern at WhatDigital Technologies Private Limited (Nov 2025 – Apr 2026, Bengaluru). He engineered production-ready analytics dashboards, an AI Job Description Bot, and a predictive intelligence platform with ML-based revenue forecasting and subscription lifecycle analysis.",
  education: "I graduated with a B.E. in Computer Science & Engineering from RNSIT with an aggregate GPA of 8.89. My coursework focused on Algorithms, Database Systems, Artificial Intelligence, and Computer Vision.",
  jobportal: "The Job Portal Analytics Dashboard was built using Plotly and Dash. It connected to MongoDB and MySQL databases to visualize traffic trends, geospatial job demands, device analytics, and user engagement metrics.",
  contact: "You can reach Chirag at chiragns12@gmail.com. Find him on GitHub at github.com/ChiragNSundar and on LinkedIn at linkedin.com/in/chiragnsundar/.",
  techstack: "Chirag's tech stack includes: Python, TypeScript, JavaScript, React, Node.js/Express, Vite, Streamlit, Plotly/Dash, MongoDB, MySQL, PostgreSQL (Supabase), SQLite, YOLOv8, OpenCV, TensorFlow.js, MediaPipe Face Mesh, LangChain, Three.js, HTML/CSS, Git, and Vercel.",
  certifications: "Chirag holds certifications from Infosys Springboard (Python, AI/ML Foundations) and freeCodeCamp (Responsive Web Design, JavaScript Algorithms).",
  summary: "Chirag N Sundar is a Software Engineer (B.E. CS, RNSIT, GPA 8.89) currently working as an AI Operations Specialist at RBCCI (Rural Bank of Calbayog City, Inc.), building core banking ecosystems with AMLA compliance monitoring and edge AI biometric verification. Previously interned at WhatDigital Technologies (5 months) building AI chatbots and BI dashboards. Key projects: Harmony Hub (RAG chatbot), RoadWatch (YOLOv8 helmet detection), Job Portal Analytics Dashboard. Core skills: Python, React/TS, Node.js, computer vision, generative AI.",
  currentrole: "Chirag currently works as an AI Operations Specialist (Fulltime) at Rural Bank of Calbayog City, Inc. (RBCCI), a freelance remote position since May 2026. Key responsibilities:\n\n1. Architected a production-ready, client-server core banking ecosystem — modular ledger prototype, automated AMLA transaction compliance monitoring, and a dynamic 7-step digital loan pipeline that drastically accelerated credit review cycles.\n2. Engineered a high-performance Node.js/Express backend integrated with SQLite to replace fragmented browser storage, centralizing critical financial records across multiple branches while optimizing security and database lookup speeds.\n3. Implemented edge AI biometric identity verification using client-side TensorFlow.js and MediaPipe Face Mesh, mapping 79 facial coordinates to 237-dimensional vectors to securely authenticate bank clients offline via Cosine Similarity.",
  projects: "Chirag's key projects are:\n\n1. Harmony Hub — A mental health RAG chatbot that retrieves info from uploaded PDFs to give context-aware AI responses, built with Streamlit + LangChain.\n2. RoadWatch — Real-time YOLOv8 helmet detection + Indian license plate OCR system using OpenCV.\n3. Job Portal Analytics Dashboard — Plotly/Dash dashboard connected to MongoDB and MySQL for visualizing job market trends."
};

// Synonym groups: each group maps to a CHATBOT_KB key
const TOPIC_SYNONYMS: { topic: string; keywords: string[] }[] = [
  { topic: "projects",  keywords: ["project", "built", "portfolio", "tell me about your", "what did you build", "what have you made"] },
  { topic: "intro",     keywords: ["who are you", "about you", "yourself", "introduce", "about chirag", "who is chirag"] },
  { topic: "summary",   keywords: ["summary", "everything", "overview", "tell me everything", "all about", "quick summary", "brief"] },
  { topic: "rag",       keywords: ["rag", "retrieval", "harmony", "hub", "augmented generation"] },
  { topic: "nlp",       keywords: ["nlp", "natural language"] },
  { topic: "streamlit", keywords: ["streamlit"] },
  { topic: "yolo",      keywords: ["yolo", "helmet", "roadwatch", "road watch", "detect", "computer vision", "object detection"] },
  { topic: "regex",     keywords: ["license", "plate", "ocr", "regex", "indian", "number plate"] },
  { topic: "jobportal", keywords: ["job portal", "mongo", "mysql", "dashboard", "analytics", "plotly", "dash"] },
  { topic: "currentrole", keywords: ["current", "rbcci", "rural bank", "calbayog", "banking", "amla", "biometric", "loan", "where do you work", "working at", "current job", "current role", "fulltime"] },
  { topic: "internship",keywords: ["intern", "whatdigital", "previous job", "past role", "previous role"] },
  { topic: "education", keywords: ["education", "college", "rnsit", "gpa", "degree", "university", "graduated", "coursework"] },
  { topic: "challenges",keywords: ["challenge", "difficult", "trouble", "hard", "problem", "obstacle"] },
  { topic: "pride",     keywords: ["proud", "achievement", "accomplishment", "best work"] },
  { topic: "strengths", keywords: ["strength", "good at", "strong suit", "best quality", "advantage"] },
  { topic: "weaknesses",keywords: ["weakness", "bad at", "perfection", "improve", "flaw", "shortcoming"] },
  { topic: "learning",  keywords: ["learning", "new tech", "how do you learn", "approach"] },
  { topic: "contact",   keywords: ["contact", "email", "reach", "mail", "github", "linkedin", "hire", "connect"] },
  { topic: "techstack", keywords: ["tech stack", "technologies", "tools", "languages", "framework", "skills", "what do you know", "programming"] },
  { topic: "certifications", keywords: ["certification", "certificate", "infosys", "freecodecamp", "credential"] },
];

// Contextual follow-up suggestions per topic
const FOLLOW_UPS: Record<string, { label: string; query: string }[]> = {
  projects:  [{ label: "Internship 💼", query: "Where did you intern?" }, { label: "Tech Stack 🛠️", query: "What technologies do you use?" }, { label: "Challenges 💪", query: "What challenges did you face?" }],
  intro:     [{ label: "Projects 🚀", query: "What projects have you built?" }, { label: "Tech Stack 🛠️", query: "What technologies do you use?" }],
  summary:   [{ label: "Internship 💼", query: "Where did you intern?" }, { label: "Certifications 📜", query: "What certifications do you have?" }],
  rag:       [{ label: "RoadWatch 🏍️", query: "Tell me about RoadWatch" }, { label: "NLP Details 🧠", query: "How was NLP used in Harmony Hub?" }],
  nlp:       [{ label: "RAG Explained 🧠", query: "What is RAG?" }, { label: "Streamlit 📊", query: "Why Streamlit?" }],
  streamlit: [{ label: "RAG Explained 🧠", query: "What is RAG?" }, { label: "Job Portal 📈", query: "Tell me about the Job Portal Dashboard" }],
  yolo:      [{ label: "License Plate OCR 🔍", query: "How does the license plate regex work?" }, { label: "Challenges 💪", query: "What challenges did you face?" }],
  regex:     [{ label: "RoadWatch 🏍️", query: "How does RoadWatch detect helmets?" }, { label: "Proud Of 🏆", query: "What are you most proud of?" }],
  jobportal: [{ label: "Tech Stack 🛠️", query: "What technologies do you use?" }, { label: "Internship 💼", query: "Where did you intern?" }],
  internship:[{ label: "Current Role 🏦", query: "Where do you currently work?" }, { label: "Education 🎓", query: "Where did you study?" }],
  currentrole:[{ label: "Previous Intern 💼", query: "Tell me about your WhatDigital internship" }, { label: "Tech Stack 🛠️", query: "What technologies do you use?" }, { label: "Projects 🚀", query: "What projects have you built?" }],
  education: [{ label: "Certifications 📜", query: "What certifications do you have?" }, { label: "Strengths ⚡", query: "What are your strengths?" }],
  challenges:[{ label: "Proud Of 🏆", query: "What are you most proud of?" }, { label: "Learning 📚", query: "How do you learn new tech?" }],
  pride:     [{ label: "Challenges 💪", query: "What challenges did you face?" }, { label: "Strengths ⚡", query: "What are your strengths?" }],
  strengths: [{ label: "Weaknesses ⚖️", query: "What are your weaknesses?" }, { label: "Internship 💼", query: "Where did you intern?" }],
  weaknesses:[{ label: "Strengths ⚡", query: "What are your strengths?" }, { label: "Learning 📚", query: "How do you learn new tech?" }],
  learning:  [{ label: "Tech Stack 🛠️", query: "What technologies do you use?" }, { label: "Education 🎓", query: "Where did you study?" }],
  contact:   [{ label: "Summary 📋", query: "Give me a quick summary" }, { label: "Tech Stack 🛠️", query: "What technologies do you use?" }],
  techstack: [{ label: "Projects 🚀", query: "Tell me about your projects" }, { label: "Certifications 📜", query: "What certifications do you have?" }],
  certifications: [{ label: "Education 🎓", query: "Where did you study?" }, { label: "Contact 📧", query: "How can I contact you?" }],
};

const DEFAULT_SUGGESTIONS = [
  { label: "Explain RAG 🧠", query: "What is RAG and how did you use it?" },
  { label: "RoadWatch Info 🏍️", query: "Tell me about your RoadWatch helmet detection project" },
  { label: "Strengths & Weaknesses ⚖️", query: "What are your strengths?" },
  { label: "Quick Summary 📋", query: "Give me a quick summary" }
];

function matchTopic(query: string): string | null {
  const q = query.toLowerCase();
  for (const group of TOPIC_SYNONYMS) {
    for (const kw of group.keywords) {
      if (q.includes(kw)) return group.topic;
    }
  }
  return null;
}

const MOCK_ENTRIES = [
  { id: "mock-1", name: "Infosys Recruiter", message: "Loved the interactive CV & SVG treemaps! 👍" },
  { id: "mock-2", name: "WhatDigital Supervisor", message: "Outstanding execution on LLM chatbot architectures." },
  { id: "mock-3", name: "GitHub Visitor", message: "Awesome YOLOv8 helmet detection main pipeline." },
  { id: "mock-4", name: "Gen-AI Recruiter", message: "The local RAG chatbot is incredibly fast and fun!" },
  { id: "mock-5", name: "Creative Dev", message: "Fascinating Neobrutalist cream design styling." }
];

export const DeveloperResumeCard: React.FC<DeveloperResumeCardProps> = ({ onInteract }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Project Explorer state ('harmony' | 'roadwatch' | 'jobportal' | null)
  const [activeProject, setActiveProject] = useState<string | null>(null);

  // Chatbot state
  const [chatLog, setChatLog] = useState<{ sender: "user" | "bot"; text: string }[]>([
    {
      sender: "bot",
      text: "Hi! I'm Chirag's AI representative. Ask me anything about my projects, internship, education, or core strengths/weaknesses!"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastTopic, setLastTopic] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleClearChat = () => {
    setChatLog([
      {
        sender: "bot",
        text: "Hi! I'm Chirag's AI representative. Ask me anything about my projects, internship, education, or core strengths/weaknesses!"
      }
    ]);
    setIsTyping(false);
    setLastTopic(null);
  };

  const fetchSignatures = async () => {
    if (!isSupabaseConfigured) {
      return;
    }
    try {
      const { data, error } = await supabase!
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchSignatures();
  }, []);

  // Scroll chatbot to end on update (scrollTop, NOT scrollIntoView which jerks the whole page)
  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatLog, isTyping]);

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    if (onInteract) onInteract();

    setIsSubmitting(true);
    try {
      const { error } = await supabase!.from("guestbook").insert([
        { name: name.trim(), message: message.trim() }
      ]);
      if (error) throw error;
      
      setName("");
      setMessage("");
      await fetchSignatures();
    } catch (err: any) {
      alert("Submission error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Local Chatbot Query Resolver (using functional state updates to prevent stale closures)
  const handleChatSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    
    // Safety check: extract search text safely
    const rawQuery = (typeof customQuery === "string" ? customQuery : chatInput).trim();
    if (!rawQuery) return;

    if (onInteract) onInteract();

    const userMessage = rawQuery;
    const query = userMessage.toLowerCase();
    
    // Add user message to log immediately
    setChatLog(prev => [...prev, { sender: "user" as const, text: userMessage }]);
    setChatInput("");
    setIsTyping(true);

    // Fuzzy synonym-group matching
    const matched = matchTopic(query);
    let botResponse: string;
    let resolvedTopic: string | null = matched;

    if (matched && CHATBOT_KB[matched]) {
      botResponse = CHATBOT_KB[matched];
      // Special case: YOLO also includes regex/plate info
      if (matched === "yolo") {
        botResponse += "\n\n" + CHATBOT_KB.regex;
      }
    } else {
      botResponse = "Hmm, I'm not sure about that one! Try asking about my projects, skills, education, internship, or certifications 😄";
      resolvedTopic = null;
    }

    // Delay bot response slightly to simulate thinking
    setTimeout(() => {
      setIsTyping(false);
      setLastTopic(resolvedTopic);
      setChatLog(prev => [...prev, { sender: "bot" as const, text: botResponse }]);
    }, 650);
  };

  // Contextual follow-up suggestions based on last answered topic
  const suggestions = lastTopic && FOLLOW_UPS[lastTopic]
    ? FOLLOW_UPS[lastTopic]
    : DEFAULT_SUGGESTIONS;

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
            BAY 03 // SOFTWARE ENGINEER DOSSIER
          </span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
          [RNSIT GRADUATE // 8.89 GPA // DATA & GEN-AI FOCUS]
        </span>
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
                  <span style={{ color: "var(--color-amber-accent)" }}>Completed</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
                  WhatDigital Technologies
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-dark)", opacity: 0.9, lineHeight: 1.35 }}>
                  Engineered production-ready web interfaces, chatbot pipelines utilizing large language models, and clean data-driven MongoDB/MySQL BI analytics dashboards.
                </p>
              </div>
            </div>

            {/* Supabase Guestbook Card */}
            <div style={{ background: "var(--color-amber)", border: "1.5px solid var(--border-color)", borderRadius: "16px", padding: "20px", boxShadow: "4px 4px 0px var(--card-shadow)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "var(--text-dark)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                ✍️ Guestbook Signature Log
              </h3>
              
              <form onSubmit={handleGuestbookSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      flexGrow: 1,
                      background: "var(--card-bg)",
                      border: "1.5px solid var(--border-color)",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "0.8rem",
                      outline: "none",
                      color: "var(--text-dark)"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: "var(--color-amber-accent)",
                      border: "1.5px solid var(--border-color)",
                      borderRadius: "8px",
                      padding: "6px 14px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: "var(--card-bg)",
                      cursor: "pointer",
                      boxShadow: "2px 2px 0px var(--card-shadow)"
                    }}
                  >
                    {isSubmitting ? "SIGNING..." : "SIGN"}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Leave a short comment..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{
                  background: "var(--card-bg)",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontSize: "0.8rem",
                  outline: "none",
                  color: "var(--text-dark)"
                }}
              />
            </form>

              {/* Guestbook signatures output */}
              <div style={{ marginTop: "12px", borderTop: "1px dashed var(--border-color)", paddingTop: "8px" }}>
                <div style={{ maxHeight: "80px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {entries.length > 0 ? (
                    entries.map((ent) => (
                      <div key={ent.id} style={{ fontFamily: "var(--font-lcd)", fontSize: "0.62rem", color: "var(--text-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        &raquo; <span style={{ fontWeight: "bold" }}>{ent.name}</span>: {ent.message}
                      </div>
                    ))
                  ) : (
                    MOCK_ENTRIES.map((ent) => (
                      <div key={ent.id} style={{ fontFamily: "var(--font-lcd)", fontSize: "0.62rem", color: "var(--text-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        &raquo; <span style={{ fontWeight: "bold" }}>{ent.name}</span>: {ent.message}
                      </div>
                    ))
                  )}
                </div>
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
                FREE // NO KEY NEEDED
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
                placeholder="Ask me something (e.g., 'What is RAG?' or 'Where did you intern?')..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
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

            {/* GitHub Stats & Heatmap */}
            <div style={{ background: "var(--card-bg)", border: "1.5px solid var(--border-color)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: "bold", color: "var(--color-amber-accent)", letterSpacing: "1px", textTransform: "uppercase" }}>
                📊 GitHub Stats & Heatmap
              </span>
              
              {/* GitHub bio summary */}
              <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontStyle: "italic", borderLeft: "2.5px solid var(--color-amber-accent)", paddingLeft: "8px", margin: 0, lineHeight: 1.4 }}>
                "BE-CSE 🚀 Data Science & Tech Enthusiast | 💻 Building with Python | 🤖 AI | SQL | MongoDB 🔧 Love creating impactful projects"
              </p>

              {/* Commit counters row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: "var(--card-bg-muted)", border: "1.5px solid var(--border-color)", borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "#db2777" }}>610</div>
                  <div style={{ fontSize: "0.55rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>Total Commits</div>
                </div>
                <div style={{ background: "var(--card-bg-muted)", border: "1.5px solid var(--border-color)", borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "#eab308" }}>10</div>
                  <div style={{ fontSize: "0.55rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>Longest Streak</div>
                </div>
              </div>

              {/* Mini commit heatmap */}
              <div>
                <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-muted)", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>
                  576 CONTRIBUTIONS IN THE LAST YEAR:
                </span>
                <div style={{ display: "flex", gap: "2.2px", flexWrap: "wrap", width: "100%", background: "var(--card-bg-muted)", border: "1.5px solid var(--border-color)", borderRadius: "8px", padding: "8px" }}>
                  {Array.from({ length: 63 }).map((_, i) => {
                    // Seed dynamic greens to match your exact commit heatmap grid
                    const shades = ["var(--grid-dot)", "var(--grid-dot)", "#2e6f40", "#39d353", "#26a641", "#0e4429"];
                    const randSeed = (i * 3 + (i % 5) * 7) % shades.length;
                    const bg = shades[randSeed];
                    return (
                      <div 
                        key={i} 
                        style={{ 
                          width: "7.5px", 
                          height: "7.5px", 
                          borderRadius: "1px", 
                          backgroundColor: bg,
                          border: "0.5px solid rgba(0,0,0,0.05)"
                        }} 
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
