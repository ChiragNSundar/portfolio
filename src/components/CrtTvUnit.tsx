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

      {/* Right Column: Physical Controls Panel (Skeuomorphic Tele-Tuner) */}
      <div 
        style={{
          width: "115px",
          background: "linear-gradient(135deg, #1b1b1e, #101012)",
          border: "2px solid var(--color-gold-dark)",
          borderRadius: "4px",
          padding: "8px 6px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 10px rgba(0,0,0,0.8)"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", width: "100%" }}>
          <div 
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.65rem",
              color: "var(--color-gold)",
              fontWeight: "800",
              letterSpacing: "1.5px",
              borderBottom: "1px solid var(--color-gold-dark)",
              paddingBottom: "2px",
              marginBottom: "8px"
            }}
          >
            TELE-TUNER
          </div>

          {/* Three golden knobs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "6px 0", alignItems: "center" }}>
            
            {/* Knob 1: Channel Selector */}
            <div style={{ textAlign: "center" }}>
              <div 
                onClick={handleNextChannel}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #e6c587 0%, #aa823a 100%)",
                  border: "2.5px solid #202024",
                  margin: "0 auto",
                  cursor: powerOn ? "pointer" : "not-allowed",
                  position: "relative",
                  transform: `rotate(${channelRotation}deg)`,
                  transition: "transform 0.2s cubic-bezier(0.1, 0.8, 0.2, 1)",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.7)"
                }}
              >
                {/* Tick pointer */}
                <div style={{ position: "absolute", top: "1px", left: "50%", width: "2px", height: "8px", backgroundColor: "#000", transform: "translateX(-50%)" }} />
              </div>
              <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.45rem", color: "#666", marginTop: "1px" }}>TUNER</div>
            </div>

            {/* Knob 2: Volume */}
            <div style={{ textAlign: "center" }}>
              <div 
                onClick={handleRotateVolume}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #e6c587 0%, #aa823a 100%)",
                  border: "2px solid #202024",
                  margin: "0 auto",
                  cursor: powerOn ? "pointer" : "not-allowed",
                  position: "relative",
                  transform: `rotate(${volumeRotation}deg)`,
                  transition: "transform 0.15s ease-out",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.7)"
                }}
              >
                <div style={{ position: "absolute", top: "1px", left: "50%", width: "2px", height: "6px", backgroundColor: "#000", transform: "translateX(-50%)" }} />
              </div>
              <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.45rem", color: "#666", marginTop: "1px" }}>VOLUME</div>
            </div>

            {/* Knob 3: Fine Tune */}
            <div style={{ textAlign: "center" }}>
              <div 
                onClick={handleRotateFineTune}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #e6c587 0%, #aa823a 100%)",
                  border: "2px solid #202024",
                  margin: "0 auto",
                  cursor: powerOn ? "pointer" : "not-allowed",
                  position: "relative",
                  transform: `rotate(${fineTuneRotation}deg)`,
                  transition: "transform 0.15s ease-out",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.7)"
                }}
              >
                <div style={{ position: "absolute", top: "1px", left: "50%", width: "1.5px", height: "5px", backgroundColor: "#000", transform: "translateX(-50%)" }} />
              </div>
              <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.45rem", color: "#666", marginTop: "1px" }}>FINE-TUNE</div>
            </div>

          </div>
        </div>

        {/* Video Info Display */}
        <div 
          style={{
            background: "#000",
            border: "1.5px solid var(--color-gold-dark)",
            borderRadius: "2px",
            width: "100%",
            height: "75px",
            padding: "4px",
            overflow: "hidden",
            fontFamily: "var(--font-lcd)",
            fontSize: "0.5rem",
            color: powerOn ? "rgb(0, 255, 120)" : "rgba(0,255,120,0.1)",
            textShadow: powerOn ? "0 0 3px rgba(0,255,120,0.8)" : "none"
          }}
        >
          {powerOn ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ color: "#fff", fontWeight: "bold" }}>CHANNEL ACTIVE:</div>
              <div style={{ height: "30px", overflow: "hidden" }}>{activeVideo.title}</div>
              <div style={{ color: "#888" }}>SIGNAL: STRONG</div>
            </div>
          ) : (
            <div>[STANDBY]</div>
          )}
        </div>

        {/* Power Switch (Red push button) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button 
            onClick={togglePower}
            style={{
              width: "24px",
              height: "24px",
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
          <div style={{ fontFamily: "var(--font-lcd)", fontSize: "0.45rem", color: "#666", marginTop: "2px" }}>POWER</div>
        </div>

      </div>
    </div>
  );
};
