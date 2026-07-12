import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type AvatarState = "idle" | "thinking" | "speaking" | "celebrating";
export type AvatarPersona = "companion" | "advisor" | "assistant";

interface AvatarWidgetProps {
  state?: AvatarState;
  persona?: AvatarPersona;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

export function AvatarWidget({
  state = "idle",
  persona = "companion",
  size = "md",
  className,
  onClick,
}: AvatarWidgetProps) {
  const [blink, setBlink] = useState(false);

  // Periodic blinking effect for idle state
  useEffect(() => {
    if (state !== "idle") return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, [state]);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-32 w-32",
    lg: "h-48 w-48",
    xl: "h-64 w-64",
  };

  // Theme configuration based on persona
  const theme = {
    companion: {
      primary: "#00836c",     // IDBI Green
      secondary: "#f58220",   // IDBI Orange
      eyeColor: "#00d2ad",    // Bright Teal
      dark: "#002d25",
      auraGrad: "from-[#00836c] to-[#f58220]",
    },
    advisor: {
      primary: "#f58220",     // IDBI Orange
      secondary: "#ffc107",   // Gold
      eyeColor: "#ffc107",    // Bright Gold
      dark: "#1e1e1e",
      auraGrad: "from-[#f58220] to-[#ffc107]",
    },
    assistant: {
      primary: "#0ea5e9",     // Tech Blue
      secondary: "#38bdf8",   // Light Blue
      eyeColor: "#00f0ff",    // Cyan Glow
      dark: "#0f172a",
      auraGrad: "from-[#0ea5e9] to-[#00f0ff]",
    },
  }[persona];

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center select-none transition-all duration-300",
        onClick && "cursor-pointer hover:scale-105 active:scale-95",
        sizeClasses[size],
        className
      )}
    >
      {/* Self-contained CSS Animations */}
      <style>{`
        @keyframes avatar-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes aura-pulse {
          0%, 100% { opacity: 0.25; transform: scale(1); filter: blur(16px); }
          50% { opacity: 0.45; transform: scale(1.15); filter: blur(20px); }
        }
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes wave-pulse {
          0%, 100% { height: 6px; }
          50% { height: 26px; }
        }
        @keyframes celebrate-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(80px) rotate(360deg); opacity: 0; }
        }

        .anim-float {
          animation: avatar-float 4s ease-in-out infinite;
        }
        .anim-aura-idle {
          animation: aura-pulse 3s ease-in-out infinite;
        }
        .anim-aura-think {
          animation: aura-pulse 1.2s ease-in-out infinite;
        }
        .anim-aura-speak {
          animation: aura-pulse 1.8s ease-in-out infinite;
        }
        .anim-orbit-spin {
          animation: orbit-spin 6s linear infinite;
        }
        .anim-orbit-reverse {
          animation: orbit-reverse 4s linear infinite;
        }
        .anim-celebrate {
          animation: celebrate-spin 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* Background Glowing Aura */}
      <div
        className={cn(
          "absolute inset-2 rounded-full transition-all duration-1000",
          state === "idle" && `bg-gradient-to-tr ${theme.auraGrad} anim-aura-idle`,
          state === "thinking" && "bg-gradient-to-tr from-[#f58220] via-red-500 to-[#00836c] anim-aura-think",
          state === "speaking" && `bg-gradient-to-tr ${theme.auraGrad} anim-aura-speak`,
          state === "celebrating" && "bg-gradient-to-tr from-green-400 via-yellow-300 to-[#00836c] anim-aura-think"
        )}
      />

      {/* Orbit Rings (shown in thinking and speaking states) */}
      {(state === "thinking" || state === "speaking") && (
        <>
          {/* Outer Ring */}
          <div className="absolute inset-0 anim-orbit-spin opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                stroke="url(#orbitGradient1)"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="15 30 10 15"
              />
              <defs>
                <linearGradient id="orbitGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.primary} />
                  <stop offset="100%" stopColor={theme.secondary} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Inner Ring */}
          <div className="absolute inset-2 anim-orbit-reverse opacity-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="41"
                stroke={theme.primary}
                strokeWidth="0.8"
                fill="none"
                strokeDasharray="5 15"
              />
            </svg>
          </div>
        </>
      )}

      {/* Main Avatar Body Container */}
      <div
        className={cn(
          "relative z-10 w-[85%] h-[85%] flex items-center justify-center transition-all duration-500",
          state === "idle" && "anim-float",
          state === "celebrating" && "anim-celebrate"
        )}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)]"
        >
          {/* Definitions for Gradients */}
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0f7f5" />
            </linearGradient>
            <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.dark} />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>

          {/* Avatar Ears/Antenna Connectors */}
          <rect x="8" y="52" width="6" height="16" rx="3" fill={theme.primary} />
          <rect x="106" y="52" width="6" height="16" rx="3" fill={theme.primary} />
          <circle cx="11" cy="60" r="5" fill={theme.secondary} className="animate-pulse" />
          <circle cx="109" cy="60" r="5" fill={theme.secondary} className="animate-pulse" />

          {/* Top Antenna */}
          <line x1="60" y1="20" x2="60" y2="10" stroke={theme.primary} strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="8" r="4.5" fill={theme.secondary} className="animate-bounce" style={{ animationDuration: "2s" }} />

          {/* Head Outer Shell */}
          <rect
            x="14"
            y="20"
            width="92"
            height="80"
            rx="40"
            fill="url(#bodyGrad)"
            stroke={theme.primary}
            strokeWidth="2"
            opacity="0.96"
          />

          {/* Visor Plate */}
          <rect
            x="22"
            y="32"
            width="76"
            height="50"
            rx="25"
            fill="url(#visorGrad)"
            stroke={theme.secondary}
            strokeWidth="1.5"
          />

          {/* Visual State: IDLE */}
          {state === "idle" && (
            <g>
              {/* Left Eye */}
              {blink ? (
                <line x1="40" y1="57" x2="52" y2="57" stroke={theme.eyeColor} strokeWidth="4" strokeLinecap="round" />
              ) : (
                <rect x="40" y="49" width="12" height="16" rx="6" fill={theme.eyeColor} />
              )}
              {/* Right Eye */}
              {blink ? (
                <line x1="68" y1="57" x2="80" y2="57" stroke={theme.eyeColor} strokeWidth="4" strokeLinecap="round" />
              ) : (
                <rect x="68" y="49" width="12" height="16" rx="6" fill={theme.eyeColor} />
              )}
              {/* Smiling Mouth */}
              <path
                d="M 51 70 Q 60 75 69 70"
                stroke={theme.eyeColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Visual State: THINKING */}
          {state === "thinking" && (
            <g>
              {/* Scanning Circular Eyes / Data Nodes */}
              <circle
                cx="46"
                cy="57"
                r="7"
                stroke="#f58220"
                strokeWidth="3"
                fill="none"
                strokeDasharray="4 8"
                style={{ animation: "orbit-spin 1.5s linear infinite" }}
              />
              <circle
                cx="74"
                cy="57"
                r="7"
                stroke="#f58220"
                strokeWidth="3"
                fill="none"
                strokeDasharray="4 8"
                style={{ animation: "orbit-reverse 1.5s linear infinite" }}
              />
              {/* Center small blinking eye dots */}
              <circle cx="46" cy="57" r="2.5" fill="#f58220" className="animate-ping" />
              <circle cx="74" cy="57" r="2.5" fill="#f58220" className="animate-ping" />
              
              {/* Thinking Flat Mouth */}
              <line x1="53" y1="71" x2="67" y2="71" stroke="#f58220" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* Visual State: SPEAKING */}
          {state === "speaking" && (
            <g>
              {/* Expressive Glowing Eyes */}
              <rect x="38" y="47" width="16" height="12" rx="4" fill={theme.eyeColor} />
              <rect x="66" y="47" width="16" height="12" rx="4" fill={theme.eyeColor} />
              <circle cx="46" cy="53" r="2.5" fill={theme.dark} />
              <circle cx="74" cy="53" r="2.5" fill={theme.dark} />

              {/* Dynamic Sound Wave mouth */}
              <g transform="translate(42, 63)">
                <rect x="0" y="6" width="3.5" height="6" rx="1.75" fill={theme.eyeColor} style={{ animation: "wave-pulse 0.4s ease-in-out infinite" }} />
                <rect x="6" y="6" width="3.5" height="6" rx="1.75" fill={theme.eyeColor} style={{ animation: "wave-pulse 0.6s ease-in-out infinite 0.1s" }} />
                <rect x="12" y="6" width="3.5" height="6" rx="1.75" fill={theme.eyeColor} style={{ animation: "wave-pulse 0.5s ease-in-out infinite 0.2s" }} />
                <rect x="18" y="6" width="3.5" height="6" rx="1.75" fill={theme.eyeColor} style={{ animation: "wave-pulse 0.7s ease-in-out infinite 0.05s" }} />
                <rect x="24" y="6" width="3.5" height="6" rx="1.75" fill={theme.eyeColor} style={{ animation: "wave-pulse 0.4s ease-in-out infinite 0.15s" }} />
                <rect x="30" y="6" width="3.5" height="6" rx="1.75" fill={theme.eyeColor} style={{ animation: "wave-pulse 0.6s ease-in-out infinite 0.25s" }} />
                <rect x="36" y="6" width="3.5" height="6" rx="1.75" fill={theme.eyeColor} style={{ animation: "wave-pulse 0.5s ease-in-out infinite 0.1s" }} />
              </g>
            </g>
          )}

          {/* Visual State: CELEBRATING */}
          {state === "celebrating" && (
            <g>
              {/* Curved Happy / Smiling Eyes */}
              <path
                d="M 38 56 Q 46 47 54 56"
                stroke="#22c55e"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 66 56 Q 74 47 82 56"
                stroke="#22c55e"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Laughing Mouth */}
              <path
                d="M 48 68 Q 60 83 72 68 Z"
                fill="#22c55e"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Floating Confetti (only shown during celebration) */}
      {state === "celebrating" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          <div className="absolute top-1/2 left-1/4 w-2.5 h-2.5 bg-yellow-400 rounded-sm" style={{ animation: "confetti-fall 1s ease-out forwards" }} />
          <div className="absolute top-1/2 left-2/3 w-2 h-3 bg-red-400" style={{ animation: "confetti-fall 1.2s ease-out forwards 0.1s" }} />
          <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-blue-400 rounded-full" style={{ animation: "confetti-fall 0.8s ease-out forwards 0.2s" }} />
          <div className="absolute top-1/2 left-1/3 w-3 h-2 bg-green-400" style={{ animation: "confetti-fall 1.1s ease-out forwards 0.15s" }} />
          <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-orange-400 rounded-full" style={{ animation: "confetti-fall 1s ease-out forwards 0.05s" }} />
        </div>
      )}
    </div>
  );
}
