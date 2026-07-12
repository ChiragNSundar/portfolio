import React, { useState, useEffect } from "react";
import { coverVideos } from "../data/tracks";

interface CrtTvUnitProps {
  onInteract?: () => void;
}

export const CrtTvUnit: React.FC<CrtTvUnitProps> = ({ onInteract }) => {
  const [powerOn, setPowerOn] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlickering, setIsFlickering] = useState(false);
  const [dialRotation, setDialRotation] = useState(0);

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
    setDialRotation((prev) => prev + 45); // rotate dial knob 45 degrees
    if (onInteract) onInteract();
  };

  // Synthesize mechanical slide/switch click
  const playSwitchSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  };

  // Synthesize dial rotary click
  const playDialClickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "square";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);
      
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
      style={{
        display: "flex",
        background: "#1c1c1f",
        border: "5px solid #2d2d30",
        borderRadius: "8px",
        boxShadow: "inset 0 0 15px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.5)",
        height: "380px",
        padding: "16px",
        gap: "16px"
      }}
    >
      {/* Left Column: Curved CRT Screen */}
      <div 
        className="crt-screen crt-scanlines"
        style={{
          flexGrow: 1,
          position: "relative",
          backgroundColor: "#08080a",
          border: "4px solid #141416",
          borderRadius: "12px",
          height: "100%",
          overflow: "hidden"
        }}
      >
        {/* Curved reflection mask overlay */}
        <div className="tv-glass-overlay" />

        {/* Screen State Rendering */}
        {!powerOn ? (
          /* Blank dark tube screen when off */
          <div style={{ width: "100%", height: "100%", backgroundColor: "#020203" }} />
        ) : isFlickering ? (
          /* TV Static Noise between channels */
          <div className="tv-static" style={{ width: "100%", height: "100%" }} />
        ) : (
          /* Embedded Video Iframe */
          <div className="tv-iframe-container" style={{ width: "100%", height: "100%" }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&mute=0`}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        )}
      </div>

      {/* Right Column: Physical Controls Panel (Wood & Gold) */}
      <div 
        style={{
          width: "120px",
          background: "linear-gradient(135deg, var(--color-wood-light), var(--color-wood-dark))",
          border: "3px solid var(--color-gold-dark)",
          borderRadius: "6px",
          padding: "12px 6px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 8px rgba(0,0,0,0.5)"
        }}
      >
        <div style={{ textAlign: "center", width: "100%" }}>
          <div 
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.65rem",
              color: "var(--color-gold)",
              fontWeight: "bold",
              letterSpacing: "1px",
              borderBottom: "1px solid var(--color-gold-dark)",
              paddingBottom: "4px",
              marginBottom: "12px"
            }}
          >
            TELE-TUNER
          </div>

          {/* Rotary Dial Container */}
          <div style={{ margin: "16px 0", position: "relative" }}>
            <div 
              onClick={handleNextChannel}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #2d2d30 40%, #151517 90%)",
                border: "2px solid var(--color-gold-dark)",
                margin: "0 auto",
                cursor: powerOn ? "pointer" : "not-allowed",
                position: "relative",
                transform: `rotate(${dialRotation}deg)`,
                transition: "transform 0.25s ease-out",
                boxShadow: "0 4px 6px rgba(0,0,0,0.6)"
              }}
            >
              {/* Dial tick indicators */}
              <div 
                style={{
                  position: "absolute",
                  top: "2px",
                  left: "50%",
                  width: "4px",
                  height: "12px",
                  backgroundColor: "var(--color-gold)",
                  transform: "translateX(-50%)"
                }}
              />
            </div>
            <div 
              style={{
                fontFamily: "var(--font-lcd)",
                fontSize: "0.65rem",
                color: powerOn ? "var(--color-gold-light)" : "rgba(223, 194, 136, 0.3)",
                marginTop: "8px",
                textShadow: powerOn ? "0 0 4px var(--color-gold)" : "none"
              }}
            >
              CH: {powerOn ? `0${currentIdx + 1}` : "--"}
            </div>
          </div>
        </div>

        {/* Video Metadata Panel on Cabinet */}
        <div 
          style={{
            background: "#000",
            border: "1px solid var(--color-gold-dark)",
            borderRadius: "2px",
            width: "100%",
            height: "110px",
            padding: "6px",
            overflow: "hidden",
            fontFamily: "var(--font-lcd)",
            fontSize: "0.55rem",
            color: powerOn ? "rgb(0, 255, 100)" : "rgba(0,255,100,0.1)",
            textShadow: powerOn ? "0 0 3px rgba(0,255,100,0.8)" : "none"
          }}
        >
          {powerOn ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ color: "#fff", fontWeight: "bold" }}>COVER ACTIVE:</div>
              <div style={{ height: "42px", overflow: "hidden" }}>{activeVideo.title}</div>
              <div style={{ color: "#aaa" }}>GENRE: {activeVideo.genre}</div>
            </div>
          ) : (
            <div>[SCREEN POWER TERMINATED]</div>
          )}
        </div>

        {/* Power Push Button */}
        <button 
          onClick={togglePower}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: powerOn ? "radial-gradient(circle, #e53e3e, #9b2c2c)" : "radial-gradient(circle, #4a5568, #2d3748)",
            border: "2px solid #000",
            cursor: "pointer",
            outline: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.2)",
            transform: powerOn ? "translateY(1px)" : "none",
            transition: "all 0.1s"
          }}
          title="TV Power"
        />
      </div>
    </div>
  );
};
