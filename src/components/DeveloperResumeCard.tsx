import React, { useState, useEffect } from "react";
import { resumeData } from "../data/resume";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

interface DeveloperResumeCardProps {
  onInteract?: () => void;
  active?: boolean;
}

export const DeveloperResumeCard: React.FC<DeveloperResumeCardProps> = ({ onInteract, active }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch guestbook signatures from Supabase
  const fetchSignatures = async () => {
    if (!isSupabaseConfigured()) {
      setFetchError("Database configuration incomplete.");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      console.error("Error fetching guestbook:", err);
      setFetchError(err.message || "Failed to fetch signatures.");
    }
  };

  useEffect(() => {
    fetchSignatures();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    if (onInteract) onInteract();

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("guestbook").insert([
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

  return (
    <div 
      className="creative-card"
      style={{
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        borderColor: "#18181b",
        boxShadow: "8px 8px 0px rgba(245, 159, 0, 0.15), 8px 8px 0px #18181b"
      }}
    >
      {/* Header */}
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
          [DEVELOPMENT INTEL]
        </span>
      </div>

      {/* Split Columns Layout */}
      <div style={{ display: "flex", gap: "24px", flexDirection: "row" }}>
        
        {/* Left Column: Interactive CV & Guestbook Registry (60%) */}
        <div style={{ flexGrow: 1.5, flexBasis: "0", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Professional Profile */}
          <div style={{ background: "#fafafa", border: "1.5px solid #18181b", borderRadius: "16px", padding: "20px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "8px", borderBottom: "1.5px solid #18181b", paddingBottom: "4px" }}>
              PROFILE OVERVIEW
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#3f3f46", lineHeight: 1.4, marginBottom: "16px" }}>
              {resumeData.summary}
            </p>

            <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "6px" }}>PROFESSIONAL TIMELINE</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {resumeData.experience.slice(0, 2).map((exp, idx) => (
                <div key={idx} style={{ fontSize: "0.8rem", color: "#3f3f46" }}>
                  <div style={{ fontWeight: "700", color: "#18181b", display: "flex", justifyContent: "space-between" }}>
                    <span>⚡ {exp.role} @ {exp.company}</span>
                    <span style={{ color: "var(--color-amber-accent)" }}>{exp.period}</span>
                  </div>
                  <ul style={{ paddingLeft: "16px", marginTop: "2px", listStyleType: "circle" }}>
                    {exp.bullets.slice(0, 2).map((b, bi) => (
                      <li key={bi} style={{ fontSize: "0.78rem" }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Supabase Guestbook Signer */}
          <div 
            style={{ 
              background: "var(--color-amber)", 
              border: "1.5px solid #18181b", 
              borderRadius: "16px", 
              padding: "20px", 
              boxShadow: "4px 4px 0px #18181b" 
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#8a5b00", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              ✍️ Guestbook Signature
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
                  {isSubmitting ? "SIGNING..." : "SIGN REGISTRY"}
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

            {/* List of recent signatures */}
            <div style={{ marginTop: "12px", borderTop: "1px dashed #dca53d", paddingTop: "8px" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: "bold", color: "#8a5b00", marginBottom: "4px" }}>
                RECENT VISITOR SIGNATURES:
              </div>
              
              <div 
                style={{ 
                  maxHeight: "80px", 
                  overflowY: "auto", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "4px" 
                }}
              >
                {entries.length > 0 ? (
                  entries.map((ent) => (
                    <div 
                      key={ent.id} 
                      style={{ 
                        fontFamily: "var(--font-lcd)", 
                        fontSize: "0.62rem", 
                        color: "#543b00",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      &raquo; <span style={{ fontWeight: "bold" }}>{ent.name}</span>: {ent.message}
                    </div>
                  ))
                ) : (
                  <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.6rem", color: "#8a5b00" }}>
                    {fetchError ? `Error: ${fetchError}` : "No visitor dockets loaded."}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Skills Sunburst Wheel & Treemap Intelmap (40%) */}
        <div style={{ width: "260px", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Skill Sunburst card */}
          <div style={{ background: "#fafafa", border: "1.5px solid #18181b", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "0.65rem", fontWeight: "bold", color: "var(--color-amber-accent)", letterSpacing: "1px", marginBottom: "10px" }}>
              SYSTEM DYNAMICS / SKILL MAP
            </span>

            <svg width="120" height="120" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#f1f1f1" strokeWidth="10" />
              
              {/* Outer segments (Pastel themed) */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="#db2777" strokeWidth="8" strokeDasharray="60 200" strokeDashoffset="0" className="sunburst-ring" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#0d9488" strokeWidth="8" strokeDasharray="80 200" strokeDashoffset="70" className="sunburst-ring" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#9333ea" strokeWidth="8" strokeDasharray="40 200" strokeDashoffset="160" className="sunburst-ring" />
              
              {/* Middle segment ring */}
              <circle cx="50" cy="50" r="32" fill="none" stroke="#eaeaea" strokeWidth="8" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="#f59f00" strokeWidth="6" strokeDasharray="90 200" strokeDashoffset="20" className="sunburst-ring" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="60 200" strokeDashoffset="120" className="sunburst-ring" />

              {/* Inner core */}
              <circle cx="50" cy="50" r="18" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
              <text x="50" y="52" fill="#18181b" fontSize="6.5" textAnchor="middle" fontWeight="bold" fontFamily="var(--font-lcd)">HUD</text>
            </svg>
            <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.55rem", color: "var(--text-muted)", marginTop: "8px", textAlign: "center" }}>
              DEVIATION: DETUNED / COHERENT
            </div>
          </div>

          {/* Skills Intelmap (Treemap grid) */}
          <div style={{ background: "#fafafa", border: "1.5px solid #18181b", borderRadius: "16px", padding: "16px" }}>
            <span style={{ fontSize: "0.65rem", fontWeight: "bold", color: "var(--color-amber-accent)", letterSpacing: "1px", display: "block", textAlign: "center", marginBottom: "8px" }}>
              CORE DEVELOPMENT INTELMAP
            </span>

            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "1.8fr 1fr",
                gridTemplateRows: "1.2fr 1fr",
                gap: "4px",
                height: "100px"
              }}
            >
              <div style={{ background: "rgba(147, 51, 234, 0.08)", border: "1px solid #9333ea", borderRadius: "4px", padding: "4px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.55rem", fontWeight: "bold", color: "#9333ea" }}>TENSORFLOW</span>
                <span style={{ fontSize: "0.45rem", color: "#777" }}>82% ACC</span>
              </div>
              <div style={{ background: "rgba(245, 159, 0, 0.08)", border: "1px solid #f59f00", borderRadius: "4px", padding: "4px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.55rem", fontWeight: "bold", color: "#b45309" }}>PYTHON</span>
                <span style={{ fontSize: "0.45rem", color: "#777" }}>95% EXP</span>
              </div>
              <div style={{ background: "rgba(12, 166, 120, 0.08)", border: "1px solid #0ca678", borderRadius: "4px", padding: "4px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.55rem", fontWeight: "bold", color: "#0d9488" }}>NODE</span>
                <span style={{ fontSize: "0.45rem", color: "#777" }}>CORE</span>
              </div>
              <div style={{ background: "rgba(230, 73, 128, 0.08)", border: "1px solid #e64980", borderRadius: "4px", padding: "4px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.55rem", fontWeight: "bold", color: "#db2777" }}>OPENCV</span>
                <span style={{ fontSize: "0.45rem", color: "#777" }}>VISION</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default DeveloperResumeCard;
