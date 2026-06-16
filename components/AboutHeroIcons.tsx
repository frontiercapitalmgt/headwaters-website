"use client";

import type { CSSProperties } from "react";

const DURATION = 40; // seconds for one full clockwise revolution

/* Static fallback positions (6 evenly-spaced points around the ellipse).
   These show when the visitor prefers reduced motion; otherwise the
   hwWheelOrbit animation overrides transform / opacity / filter. */
const slots: CSSProperties[] = [
  { transform: "translate(-50%, calc(-50% - var(--ry))) scale(0.65)", opacity: 0.16, filter: "blur(2px)" },
  { transform: "translate(calc(-50% + var(--rx) * 0.866), calc(-50% - var(--ry) * 0.5)) scale(0.74)", opacity: 0.25, filter: "blur(1.4px)" },
  { transform: "translate(calc(-50% + var(--rx) * 0.866), calc(-50% + var(--ry) * 0.5)) scale(0.91)", opacity: 0.42, filter: "blur(0.5px)" },
  { transform: "translate(-50%, calc(-50% + var(--ry))) scale(1)", opacity: 0.5, filter: "blur(0px)" },
  { transform: "translate(calc(-50% - var(--rx) * 0.866), calc(-50% + var(--ry) * 0.5)) scale(0.91)", opacity: 0.42, filter: "blur(0.5px)" },
  { transform: "translate(calc(-50% - var(--rx) * 0.866), calc(-50% - var(--ry) * 0.5)) scale(0.74)", opacity: 0.25, filter: "blur(1.4px)" },
];

/* The six hardtech glyphs, kept flat (2D). */
const icons = [
  // Robotics
  <>
    <rect x="30" y="40" width="60" height="48" rx="12" fill="none" stroke="#BB8956" strokeWidth="3.8" />
    <line x1="60" y1="40" x2="60" y2="26" stroke="#BB8956" strokeWidth="3.8" strokeLinecap="round" />
    <circle cx="60" cy="21" r="5" fill="#d6ad8e" />
    <circle cx="47" cy="61" r="5.5" fill="#e3c4ae" />
    <circle cx="73" cy="61" r="5.5" fill="#e3c4ae" />
    <line x1="49" y1="77" x2="71" y2="77" stroke="#BB8956" strokeWidth="3.8" strokeLinecap="round" />
    <rect x="21" y="56" width="6" height="16" rx="3" fill="#BB8956" />
    <rect x="93" y="56" width="6" height="16" rx="3" fill="#BB8956" />
  </>,
  // Energy
  <>
    <circle cx="60" cy="60" r="34" fill="none" stroke="#BB8956" strokeWidth="3.8" />
    <path d="M64,37 L47,64 L58,64 L54,85 L75,55 L63,55 Z" fill="#d6ad8e" stroke="#d6ad8e" strokeWidth="2.6" strokeLinejoin="round" />
  </>,
  // Network
  <>
    <line x1="60" y1="60" x2="60" y2="28" stroke="#BB8956" strokeWidth="3.8" />
    <line x1="60" y1="60" x2="34" y2="76" stroke="#BB8956" strokeWidth="3.8" />
    <line x1="60" y1="60" x2="86" y2="76" stroke="#BB8956" strokeWidth="3.8" />
    <circle cx="60" cy="26" r="8" fill="#efd9ca" stroke="#BB8956" strokeWidth="2.6" />
    <circle cx="33" cy="78" r="8" fill="#efd9ca" stroke="#BB8956" strokeWidth="2.6" />
    <circle cx="87" cy="78" r="8" fill="#efd9ca" stroke="#BB8956" strokeWidth="2.6" />
    <circle cx="60" cy="60" r="10" fill="#d6ad8e" />
  </>,
  // Rocket
  <>
    <path d="M60,20 C73,33 76,54 71,72 L49,72 C44,54 47,33 60,20 Z" fill="none" stroke="#BB8956" strokeWidth="3.8" strokeLinejoin="round" />
    <circle cx="60" cy="44" r="6.5" fill="#efd9ca" />
    <path d="M49,66 L38,83 L50,76 Z" fill="#d6ad8e" />
    <path d="M71,66 L82,83 L70,76 Z" fill="#d6ad8e" />
    <path d="M54,74 C56,85 64,85 66,74" fill="none" stroke="#d6ad8e" strokeWidth="3.8" strokeLinecap="round" />
  </>,
  // Chip
  <>
    <rect x="40" y="40" width="40" height="40" rx="6" fill="none" stroke="#BB8956" strokeWidth="3.8" />
    <rect x="52" y="52" width="16" height="16" rx="3" fill="#d6ad8e" />
    {[50, 60, 70].map((x) => <line key={`t${x}`} x1={x} y1="40" x2={x} y2="30" stroke="#BB8956" strokeWidth="3.8" strokeLinecap="round" />)}
    {[50, 60, 70].map((x) => <line key={`b${x}`} x1={x} y1="80" x2={x} y2="90" stroke="#BB8956" strokeWidth="3.8" strokeLinecap="round" />)}
    {[50, 60, 70].map((y) => <line key={`l${y}`} x1="40" y1={y} x2="30" y2={y} stroke="#BB8956" strokeWidth="3.8" strokeLinecap="round" />)}
    {[50, 60, 70].map((y) => <line key={`r${y}`} x1="80" y1={y} x2="90" y2={y} stroke="#BB8956" strokeWidth="3.8" strokeLinecap="round" />)}
  </>,
  // Building
  <>
    <path d="M28,84 L28,57 L46,67 L46,57 L64,67 L64,57 L82,67 L82,84 Z" fill="none" stroke="#BB8956" strokeWidth="3.8" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="72" y="38" width="8" height="22" rx="1.5" fill="#d6ad8e" />
    <rect x="35" y="74" width="9" height="8" rx="1.5" fill="#efd9ca" />
    <rect x="54" y="74" width="9" height="8" rx="1.5" fill="#efd9ca" />
  </>,
];

export default function AboutHeroIcons() {
  return (
    <div
      aria-hidden="true"
      className="hw-wheel-stage absolute inset-0 z-0 pointer-events-none"
      style={
        {
          "--rx": "clamp(380px, 60vw, 760px)",
          "--ry": "clamp(214px, 31vw, 378px)",
        } as CSSProperties
      }
    >
      {icons.map((glyph, i) => (
        <svg
          key={i}
          viewBox="0 0 120 120"
          className="hw-wheel-icon absolute left-1/2 top-1/2"
          style={{
            width: "clamp(102px, 12.5vw, 174px)",
            height: "clamp(102px, 12.5vw, 174px)",
            // Animation overrides these; they remain as the reduced-motion pose.
            ...slots[i],
            animationDelay: `${-((i / 6) * DURATION).toFixed(3)}s`,
          }}
        >
          {glyph}
        </svg>
      ))}
    </div>
  );
}
