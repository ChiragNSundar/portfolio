import React, { useState, useEffect } from "react";
import { coverVideos } from "../data/tracks";

interface CrtTvUnitProps {
  onInteract?: () => void;
  active?: boolean;
}

export const CrtTvUnit: React.FC<CrtTvUnitProps> = ({ onInteract, active }) => {
  const [powerOn, setPowerOn] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlickering, setIsFlickering] = useState(false);
  const [volumeRotation, setVolumeRotation] = useState(120);
  const [channelRotation, setChannelRotation] = useState(45);
  const [fineTuneRotation, setFineTuneRotation] = useState(180);

  const activeVideo = coverVideos[currentIdx];

  // Trigger static channel flicker on channel change
  useEffect(() => {
    if (!powerOn) return;
    setIsFlickering(true);
    const timer = setTimeout(() => setIsFlickering(false), 450);
    return () => clearTimeout(timer);
  }, [currentIdx, powerOn]);

  const togglePower = () => {
    playSwitchSound();
    setPowerOn(!powerOn);
    if (onInteract) onInteract();
  };

  const handleNextChannel = () => {
    if (!powerOn) return;
    playDialClickSound();
    setCurrentIdx((prev) => (prev + 1) % coverVideos.length);
    setChannelRotation((prev) => (prev + 45) % 360);
    if (onInteract) onInteract();
  };

  const handleRotateVolume = () => {
    if (!powerOn) return;
    playDialClickSound();
    setVolumeRotation((prev) => (prev + 30) % 360);
  };

  const handleRotateFineTune = () => {
    if (!powerOn) return;
    playDialClickSound();
    setFineTuneRotation((prev) => (prev + 20) % 360);
  };

  // Synthesize switch mechanical click
  const playSwitchSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  // Synthesize dial mechanical click
  const playDialClickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  };

  return (
    <div 
      className="console-panel"
      style={{
        display: "flex",
        height: "360px",
        padding: "12px",
        gap: "12px",
        border: "1px solid var(--color-gold-dark)",
        boxShadow: "inset 0 0 15px rgba(0,0,0,0.95)"
      }}
    >
      {/* Left Column: Curved CRT Screen */}
      <div 
        className={`crt-screen crt-scanlines ${active ? "crt-boot-effect" : "screen-power-off"}`}
        style={{
          flexGrow: 1,
          position: "relative",
          backgroundColor: "#050608",
          border: "4px solid #1a1a1c",
          borderRadius: "4px",
          height: "100%",
          overflow: "hidden"
        }}
      >
        {/* Curved reflection mask overlay */}
        <div className="tv-glass-overlay" />

        {/* Screen Rendering */}
        {!powerOn ? (
          <div style={{ width: "100%", height: "100%", backgroundColor: "#020203" }} />
        ) : isFlickering ? (
          <div className="tv-static" style={{ width: "100%", height: "100%" }} />
        ) : (
          <div className="tv-iframe-container" style={{ width: "100%", height: "100%" }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&mute=0&modestbranding=1&autohide=1`}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        )}
      </div>

      {/* Right Column: Side Folder Directory & Power */}
      <div 
        style={{
          width: "185px",
          background: "linear-gradient(135deg, #1b1b1e, #101012)",
          border: "2px solid var(--color-gold-dark)",
          borderRadius: "4px",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 4px 10px rgba(0,0,0,0.8)",
          gap: "8px"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "left", width: "100%" }}>
          <div 
            style={{
              fontFamily: "var(--font-lcd)",
              fontSize: "0.6rem",
              color: "var(--color-gold)",
              fontWeight: "bold",
              letterSpacing: "1px",
              borderBottom: "1.5px solid var(--color-gold-dark)",
              paddingBottom: "3px",
              marginBottom: "8px"
            }}
          >
            DIR: C:\COVERS\*.*
          </div>

          {/* Directory Folder File Tree List */}
          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              maxHeight: "185px",
              overflowY: "auto",
              paddingRight: "2px"
            }}
          >
            {coverVideos.map((video, idx) => {
              const isActive = currentIdx === idx && powerOn;
              return (
                <div
                  key={video.id}
                  onClick={() => {
                    if (powerOn) {
                      setCurrentIdx(idx);
                      playTunerClick();
                      setChannelRotation((prev) => (prev + 30) % 360);
                      if (onInteract) onInteract();
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 4px",
                    borderRadius: "2px",
                    background: isActive ? "var(--color-gold)" : "transparent",
                    color: isActive ? "#000000" : (powerOn ? "#d8d8e2" : "#44444c"),
                    cursor: powerOn ? "pointer" : "not-allowed",
                    fontFamily: "var(--font-retro)",
                    fontSize: "0.95rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    border: isActive ? "1px solid #fff" : "1px solid transparent",
                    transition: "all 0.1s"
                  }}
                  title={video.title}
                >
                  <span style={{ fontSize: "0.8rem" }}>{isActive ? "🟢" : "📄"}</span>
                  <span style={{ textTransform: "uppercase" }}>
                    {video.title.length > 20 ? `${video.title.substring(0, 18)}..` : video.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Panel: Volume Knob & Power Button Side-by-Side */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderTop: "1px solid #2d2d32",
            paddingTop: "8px",
            marginTop: "auto"
          }}
        >
          {/* Volume Control */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div 
              onClick={handleRotateVolume}
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #e6c587 0%, #aa823a 100%)",
                border: "1.5px solid #202024",
                cursor: powerOn ? "pointer" : "not-allowed",
                position: "relative",
                transform: `rotate(${volumeRotation}deg)`,
                transition: "transform 0.15s ease-out",
                boxShadow: "0 2px 4px rgba(0,0,0,0.5)"
              }}
            >
              <div style={{ position: "absolute", top: "1px", left: "50%", width: "1.5px", height: "5px", backgroundColor: "#000", transform: "translateX(-50%)" }} />
            </div>
            <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.45rem", color: "#666" }}>VOL</div>
          </div>

          {/* Power Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button 
              onClick={togglePower}
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: powerOn ? "radial-gradient(circle, #f56565, #c53030)" : "radial-gradient(circle, #4a5568, #2d3748)",
                border: "1.5px solid #000",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.2)",
                transform: powerOn ? "translateY(1px)" : "none",
                transition: "all 0.1s"
              }}
              title="TV Power"
            />
            <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.45rem", color: powerOn ? "#f56565" : "#666" }}>POWER</div>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};
