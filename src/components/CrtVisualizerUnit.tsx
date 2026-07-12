import React, { useEffect, useRef } from "react";
import type { Track } from "../data/tracks";
import { audioEngine } from "../audio/audioEngine";

interface CrtVisualizerUnitProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  mixRatio: number;
}

export const CrtVisualizerUnit: React.FC<CrtVisualizerUnitProps> = ({
  currentTrack,
  isPlaying,
  mixRatio
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas dynamically
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark background representing phosphor cathode tube screen
      ctx.fillStyle = "rgba(0, 18, 4, 0.2)"; // Persistence of vision sweep trail
      ctx.fillRect(0, 0, width, height);

      // Get real-time waveform data
      const dataArray = isPlaying ? audioEngine.getAnalyserData() : new Float32Array(0);

      ctx.lineWidth = 3.5 * window.devicePixelRatio;
      
      // Interpolate colors based on mix ratio (yellow-green for dry, neon emerald green for wet)
      const r = Math.floor(0 + (1 - mixRatio) * 100);
      const g = Math.floor(255 - (1 - mixRatio) * 50);
      const b = Math.floor(100 - (1 - mixRatio) * 80);
      ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.shadowBlur = 10 * window.devicePixelRatio;
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.75)`;

      ctx.beginPath();

      if (dataArray.length === 0) {
        // Draw flat line with simulated analog noise/wobble
        ctx.moveTo(0, height / 2);
        for (let i = 0; i < width; i++) {
          const wobble = (Math.random() - 0.5) * (isPlaying ? 4 : 1.5) * window.devicePixelRatio;
          ctx.lineTo(i, height / 2 + wobble);
        }
      } else {
        const sliceWidth = width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          // dataArray contains floats from -1.0 to 1.0
          const v = dataArray[i];
          // Scale it slightly so it doesn't clip
          const y = (v * 0.4 + 0.5) * height;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }
      }

      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;

      // Draw oscilloscope grid lines (retro screen reticle)
      ctx.strokeStyle = "rgba(0, 255, 100, 0.05)";
      ctx.lineWidth = 1 * window.devicePixelRatio;
      
      // Horizontal grid
      for (let y = 0; y < height; y += height / 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      // Vertical grid
      for (let x = 0; x < width; x += width / 8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, mixRatio]);

  return (
    <div 
      className="crt-screen crt-scanlines crt-flicker-animation"
      style={{
        width: "100%",
        height: "380px",
        backgroundColor: "var(--color-green-bg)",
        display: "flex",
        flexDirection: "column",
        border: "5px solid #1c1c1f",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.95)"
      }}
    >
      {/* Top title header bar */}
      <div 
        style={{
          background: "#000",
          color: "rgba(0, 255, 100, 0.4)",
          fontFamily: "var(--font-lcd)",
          fontSize: "0.75rem",
          padding: "4px 8px",
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0, 255, 100, 0.15)"
        }}
      >
        <span>MODEL-72 OSCILLOSCOPE</span>
        <span>AC COUPLING / DUAL STAGE</span>
      </div>

      {/* Drawing Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          flexGrow: 1,
          width: "100%",
          display: "block",
          cursor: "crosshair"
        }}
      />

      {/* Bottom Track LCD Details Panel */}
      <div className="lcd-info-panel">
        <div style={{ flexGrow: 1, paddingRight: "10px" }}>
          {currentTrack ? (
            <>
              <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: "0.95rem", marginBottom: "2px" }}>
                TRACK: {currentTrack.title}
              </div>
              <div style={{ color: "rgba(0, 255, 100, 0.7)", fontSize: "0.75rem", marginBottom: "4px" }}>
                GENRE: {currentTrack.genre.toUpperCase()} &nbsp;|&nbsp; TYPE: {currentTrack.type.toUpperCase()}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-green-glow)", lineHeight: 1.3, height: "45px", overflow: "hidden" }}>
                {currentTrack.description}
              </div>
            </>
          ) : (
            <>
              <div style={{ color: "rgba(0, 255, 100, 0.8)", fontWeight: "bold", fontSize: "0.95rem", marginBottom: "2px" }}>
                SYSTEM IDLE
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(0, 255, 100, 0.5)" }}>
                SELECT A TAPE TRACK ON THE PANEL TO INITIATE PLAYBACK / OSCILLATION SWEEP.
              </div>
            </>
          )}
        </div>

        {/* Action icons / status lights */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end", minWidth: "100px" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span 
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isPlaying ? "rgb(0, 255, 100)" : "rgb(0, 60, 20)",
                boxShadow: isPlaying ? "0 0 6px rgb(0, 255, 100)" : "none",
                display: "inline-block"
              }}
            />
            <span style={{ fontSize: "0.7rem", color: "rgba(0, 255, 100, 0.8)" }}>
              {isPlaying ? "RUNNING" : "STANDBY"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {currentTrack?.spotifyUrl && (
              <a 
                href={currentTrack.spotifyUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="analog-btn"
                style={{ padding: "2px 6px", fontSize: "0.65rem", textShadow: "none" }}
              >
                SPOTIFY
              </a>
            )}
            {currentTrack?.soundCloudUrl && (
              <a 
                href={currentTrack.soundCloudUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="analog-btn"
                style={{ padding: "2px 6px", fontSize: "0.65rem", textShadow: "none" }}
              >
                SOUNDCLOUD
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
