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
const CHATBOT_KB = {
  intro: "Hi my name is Chirag, I am a Software Engineer specializing in Web App Development, Data Analytics, and Generative AI workflows. I recently completed my B.E. in Computer Science & engineering from RNSIT, maintaining a GPA of 8.89, and have worked as a Data Science & AI Intern at WhatDigital Technologies (5 months).",
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
  internship: "I worked as a Data Science & AI Intern at WhatDigital Technologies for 5 months. I engineered chatbots, generative AI integrations, and built database-backed business intelligence dashboards.",
  education: "I graduated with a B.E. in Computer Science & Engineering from RNSIT with an aggregate GPA of 8.89. My coursework focused on Algorithms, Database Systems, Artificial Intelligence, and Computer Vision.",
  jobportal: "The Job Portal Analytics Dashboard was built using Plotly and Dash. It connected to MongoDB and MySQL databases to visualize traffic trends, geospatial job demands, device analytics, and user engagement metrics."
};

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
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll chatbot to end on update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

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

    let botResponse = "";

    // Local Query Matching
    if (query.includes("rag") || query.includes("retrieval") || query.includes("harmony") || query.includes("hub")) {
      botResponse = CHATBOT_KB.rag;
    } else if (query.includes("yolo") || query.includes("helmet") || query.includes("roadwatch") || query.includes("detect")) {
      botResponse = CHATBOT_KB.yolo + "\n\n" + CHATBOT_KB.regex;
    } else if (query.includes("nlp") || query.includes("natural language")) {
      botResponse = CHATBOT_KB.nlp;
    } else if (query.includes("streamlit")) {
      botResponse = CHATBOT_KB.streamlit;
    } else if (query.includes("license") || query.includes("plate") || query.includes("ocr") || query.includes("regex") || query.includes("indian")) {
      botResponse = CHATBOT_KB.regex;
    } else if (query.includes("job portal") || query.includes("mongo") || query.includes("mysql") || query.includes("dashboard") || query.includes("analytics")) {
      botResponse = CHATBOT_KB.jobportal;
    } else if (query.includes("intern") || query.includes("whatdigital") || query.includes("work") || query.includes("experience")) {
      botResponse = CHATBOT_KB.internship;
    } else if (query.includes("education") || query.includes("college") || query.includes("rnsit") || query.includes("gpa") || query.includes("degree")) {
      botResponse = CHATBOT_KB.education;
    } else if (query.includes("challenge") || query.includes("difficult") || query.includes("trouble")) {
      botResponse = CHATBOT_KB.challenges;
    } else if (query.includes("proud")) {
      botResponse = CHATBOT_KB.pride;
    } else if (query.includes("strength") || query.includes("good at")) {
      botResponse = CHATBOT_KB.strengths;
    } else if (query.includes("weakness") || query.includes("bad at") || query.includes("perfection")) {
      botResponse = CHATBOT_KB.weaknesses;
    } else if (query.includes("learning") || query.includes("new tech")) {
      botResponse = CHATBOT_KB.learning;
    } else {
      botResponse = CHATBOT_KB.intro + "\n\nI specialize in YOLOv8 computer vision, RAG generative AI models, and Streamlit dashboards. Try asking me:\n- 'What is RAG?'\n- 'How does RoadWatch detect helmets?'\n- 'What are your strengths?'";
    }

    // Delay bot response slightly to simulate thinking
    setTimeout(() => {
      setChatLog(prev => [...prev, { sender: "bot" as const, text: botResponse }]);
    }, 400);
  };

  const suggestions = [
    { label: "Explain RAG 🧠", query: "What is RAG and how did you use it?" },
    { label: "RoadWatch Info 🏍️", query: "Tell me about your RoadWatch helmet detection project" },
    { label: "Weaknesses & Strengths ⚖️", query: "What are your strengths and weaknesses?" },
    { label: "Internship Details 💼", query: "Where did you intern and what did you build?" }
  ];

  return (
    <div 
      className="creative-card"
      style={{
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        borderColor: "#18181b",
        boxShadow: "8px 8px 0px rgba(245, 159, 0, 0.15), 8px 8px 0px #18181b"
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
        <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
          
          {/* Left Column: Education & Intern Info */}
          <div style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#fcfcfa", border: "1.5px solid #18181b", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "12px", borderBottom: "1.5px solid #18181b", paddingBottom: "4px" }}>
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

              {/* Internship */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>💼 Data Science & AI Intern (5 months)</span>
                  <span style={{ color: "var(--color-amber-accent)" }}>Completed</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
                  WhatDigital Technologies
                </div>
                <p style={{ fontSize: "0.78rem", color: "#3f3f46", lineHeight: 1.35 }}>
                  Engineered production-ready web interfaces, chatbot pipelines utilizing large language models, and clean data-driven MongoDB/MySQL BI analytics dashboards.
                </p>
              </div>
            </div>

            {/* Supabase Guestbook Card */}
            <div style={{ background: "var(--color-amber)", border: "1.5px solid #18181b", borderRadius: "16px", padding: "20px", boxShadow: "4px 4px 0px #18181b" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#7a5a07", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
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
                      background: "#ffffff",
                      border: "1.5px solid #18181b",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "0.8rem",
                      outline: "none"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: "var(--color-amber-accent)",
                      border: "1.5px solid #18181b",
                      borderRadius: "8px",
                      padding: "6px 14px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: "#000000",
                      cursor: "pointer",
                      boxShadow: "2px 2px 0px #18181b"
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
                    background: "#ffffff",
                    border: "1.5px solid #18181b",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontSize: "0.8rem",
                    outline: "none"
                  }}
                />
              </form>

              {/* Guestbook signatures output */}
              <div style={{ marginTop: "12px", borderTop: "1px dashed #c29528", paddingTop: "8px" }}>
                <div style={{ maxHeight: "80px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {entries.length > 0 ? (
                    entries.map((ent) => (
                      <div key={ent.id} style={{ fontFamily: "var(--font-lcd)", fontSize: "0.62rem", color: "#543b00", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        &raquo; <span style={{ fontWeight: "bold" }}>{ent.name}</span>: {ent.message}
                      </div>
                    ))
                  ) : (
                    MOCK_ENTRIES.map((ent) => (
                      <div key={ent.id} style={{ fontFamily: "var(--font-lcd)", fontSize: "0.62rem", color: "#543b00", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        &raquo; <span style={{ fontWeight: "bold" }}>{ent.name}</span>: {ent.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Project Explorer cards */}
          <div style={{ flex: "1.2 1 400px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#ffffff", border: "1.5px solid #18181b", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "900", borderBottom: "1.5px solid #18181b", paddingBottom: "4px" }}>
                DETAILED PROJECT EXPLORER
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Click a card below to expand its technical workflows and interview validation sheets.
              </p>

              {/* Project 1: RoadWatch */}
              <div 
                onClick={() => setActiveProject(activeProject === "roadwatch" ? null : "roadwatch")}
                style={{
                  border: "1.5px solid #18181b",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  backgroundColor: activeProject === "roadwatch" ? "var(--color-amber)" : "#fafafa",
                  transition: "background-color 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>🏍️ RoadWatch: Smart Helmet Detection (2024)</span>
                  <span>{activeProject === "roadwatch" ? "▼" : "▶"}</span>
                </div>
                {activeProject === "roadwatch" && (
                  <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "#3f3f46", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px dashed #18181b", paddingTop: "8px" }}>
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
                  border: "1.5px solid #18181b",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  backgroundColor: activeProject === "harmony" ? "var(--color-amber)" : "#fafafa",
                  transition: "background-color 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>🧠 Harmony Hub: Mental Health Assistant (2023)</span>
                  <span>{activeProject === "harmony" ? "▼" : "▶"}</span>
                </div>
                {activeProject === "harmony" && (
                  <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "#3f3f46", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px dashed #18181b", paddingTop: "8px" }}>
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
                  border: "1.5px solid #18181b",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  backgroundColor: activeProject === "jobportal" ? "var(--color-amber)" : "#fafafa",
                  transition: "background-color 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "0.85rem" }}>
                  <span>📊 Job Portal Business Intelligence Dashboard</span>
                  <span>{activeProject === "jobportal" ? "▼" : "▶"}</span>
                </div>
                {activeProject === "jobportal" && (
                  <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "#3f3f46", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px dashed #18181b", paddingTop: "8px" }}>
                    <div><strong>Pitch:</strong> Interactive business intelligence dashboard visualizing job board metrics.</div>
                    <div><strong>Database Pipeline:</strong> Connected to MongoDB and MySQL databases, optimized query pipelines, and loaded geospatial, device usage, and engagement trends in Plotly & Dash.</div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* ROW 2: ASK CHIRAG AI CHATBOT & SKILLS DATA */}
        <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
          
          {/* Chatbot Console (60%) */}
          <div 
            style={{
              flex: "1.5 1 450px",
              background: "#ffffff",
              border: "1.5px solid #18181b",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #18181b", paddingBottom: "6px" }}>
              <span style={{ fontWeight: "900", fontSize: "1rem", display: "flex", alignItems: "center", gap: "6px" }}>
                🤖 Ask Chirag AI
              </span>
              <span style={{ fontSize: "0.6rem", background: "var(--color-amber)", border: "1px solid #18181b", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
                FREE // NO KEY NEEDED
              </span>
            </div>

            {/* Chat Messages scroll container */}
            <div 
              style={{
                height: "170px",
                overflowY: "auto",
                border: "1.5px solid #18181b",
                borderRadius: "12px",
                background: "#fafafa",
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
                    background: chat.sender === "user" ? "var(--color-amber)" : "#ffffff",
                    border: "1.5px solid #18181b",
                    borderRadius: chat.sender === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    padding: "8px 12px",
                    maxWidth: "85%",
                    fontSize: "0.78rem",
                    lineHeight: 1.35,
                    boxShadow: "2px 2px 0px rgba(0,0,0,0.05)"
                  }}
                >
                  <div style={{ fontSize: "0.6rem", fontWeight: "bold", color: chat.sender === "user" ? "#7a5a07" : "var(--text-muted)", marginBottom: "2px" }}>
                    {chat.sender === "user" ? "YOU" : "CHIRAG AI"}
                  </div>
                  <div style={{ whiteSpace: "pre-line" }}>{chat.text}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {suggestions.map((sug, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleChatSubmit(undefined, sug.query)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #18181b",
                    borderRadius: "20px",
                    padding: "3px 10px",
                    fontSize: "0.65rem",
                    cursor: "pointer",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f4f4f5"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}
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
                  background: "#ffffff",
                  border: "1.5px solid #18181b",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                style={{
                  background: "var(--color-amber-accent)",
                  border: "1.5px solid #18181b",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "3px 3px 0px #18181b"
                }}
              >
                ASK
              </button>
            </form>
          </div>

          {/* GitHub Activity & Tech Stack Panel (40%) */}
          <div style={{ flex: "1.2 1 300px", display: "flex", flexDirection: "column", gap: "18px" }}>
            
            {/* Tech Stack Deck */}
            <div style={{ background: "#ffffff", border: "1.5px solid #18181b", borderRadius: "16px", padding: "16px" }}>
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
                  { name: "Matplotlib", bg: "#ffffff", color: "#000000", border: "1px solid #18181b" },
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
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: "bold",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: tech.bg,
                      color: tech.color,
                      border: tech.border || "1.5px solid #18181b",
                      boxShadow: "2px 2px 0px #18181b",
                      textTransform: "uppercase"
                    }}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* GitHub Stats & Heatmap */}
            <div style={{ background: "#ffffff", border: "1.5px solid #18181b", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: "bold", color: "var(--color-amber-accent)", letterSpacing: "1px", textTransform: "uppercase" }}>
                📊 GitHub Stats & Heatmap
              </span>
              
              {/* GitHub bio summary */}
              <p style={{ fontSize: "0.65rem", color: "#4b5563", fontStyle: "italic", borderLeft: "2.5px solid var(--color-amber-accent)", paddingLeft: "8px", margin: 0, lineHeight: 1.4 }}>
                "BE-CSE 🚀 Data Science & Tech Enthusiast | 💻 Building with Python | 🤖 AI | SQL | MongoDB 🔧 Love creating impactful projects"
              </p>

              {/* Commit counters row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: "#fafafa", border: "1.5px solid #18181b", borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "#db2777" }}>610</div>
                  <div style={{ fontSize: "0.55rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>Total Commits</div>
                </div>
                <div style={{ background: "#fafafa", border: "1.5px solid #18181b", borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "#eab308" }}>10</div>
                  <div style={{ fontSize: "0.55rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.5px" }}>Longest Streak</div>
                </div>
              </div>

              {/* Mini commit heatmap */}
              <div>
                <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-muted)", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>
                  576 CONTRIBUTIONS IN THE LAST YEAR:
                </span>
                <div style={{ display: "flex", gap: "2.2px", flexWrap: "wrap", width: "100%", background: "#fcfcfa", border: "1.5px solid #18181b", borderRadius: "8px", padding: "8px" }}>
                  {Array.from({ length: 63 }).map((_, i) => {
                    // Seed dynamic greens to match your exact commit heatmap grid
                    const shades = ["#ebedf0", "#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"];
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
