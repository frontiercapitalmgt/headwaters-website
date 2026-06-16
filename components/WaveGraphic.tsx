"use client";

import { useEffect, useRef } from "react";

interface Wave {
  yEdge: number;    // y at left/right edges (small = near top of SVG)
  yCenter: number;  // y at centre bottom of the U (large = near bottom of SVG)
  stroke: string;
  strokeWidth: number;
  opacity: number;
  dur: string;
  begin: string;
}

const waves: Wave[] = [
  { yEdge: 28,  yCenter: 180, stroke: "#BB8956", strokeWidth: 2.5, opacity: 0.92, dur: "7s",  begin: "0s"    },
  { yEdge: 48,  yCenter: 170, stroke: "#c99970", strokeWidth: 1.8, opacity: 0.65, dur: "11s", begin: "-3.5s" },
  { yEdge: 12,  yCenter: 162, stroke: "#d6ad8e", strokeWidth: 1.5, opacity: 0.44, dur: "9s",  begin: "-5.5s" },
  { yEdge: 64,  yCenter: 185, stroke: "#e3c4ae", strokeWidth: 1.2, opacity: 0.36, dur: "16s", begin: "-7s"   },
];

// One U spans 1200 SVG units (the viewport width).
// The cubic bezier uses control points at 30 % and 70 % of each 600-unit half,
// giving horizontal tangents at every tile junction so the loop is seamless.
// Two tiles (0→2400) let the SMIL translation animate one full period.
function uPath(yEdge: number, yCenter: number): string {
  const e = yEdge;
  const c = yCenter;
  // Control-point x offsets from each anchor
  const a = 180;  // 0.30 × 600 — keep the curve flat near the rim
  const b = 420;  // 0.70 × 600 — begin pulling toward the centre

  return [
    // — tile 1 (x 0 → 1200) —
    `M0,${e}`,
    `C${a},${e} ${b},${c} 600,${c}`,       // left rim → bowl bottom
    `C${1200-b},${c} ${1200-a},${e} 1200,${e}`, // bowl bottom → right rim
    // — tile 2 (x 1200 → 2400) — identical shape, offset by 1200
    `C${1200+a},${e} ${1200+b},${c} 1800,${c}`,
    `C${2400-b},${c} ${2400-a},${e} 2400,${e}`,
  ].join(" ");
}

export default function WaveGraphic() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fade out in sync with the hero text (gone by ~380px of scroll)
    const onScroll = () => {
      const y = window.scrollY;
      el.style.opacity = String(Math.max(0, 1 - y / 380));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // waveReveal clips from right→left (left-to-right sweep) on first load
    <div ref={ref} style={{ lineHeight: 0, animation: "waveReveal 2s ease-out 0.2s both" }}>
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{
          display: "block",
          width: "100%",
          height: "clamp(160px, 20vw, 260px)",
          overflow: "hidden",
        }}
      >
        {waves.map((w, i) => (
          <g key={i}>
            <path
              d={uPath(w.yEdge, w.yCenter)}
              fill="none"
              stroke={w.stroke}
              strokeWidth={w.strokeWidth}
              opacity={w.opacity}
            />
            {/*
              Translate from -1200 → 0: the group drifts right so bowl shapes
              enter from the left edge and exit to the right — left-to-right flow.
            */}
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              from="-1200,0"
              to="0,0"
              dur={w.dur}
              begin={w.begin}
              repeatCount="indefinite"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
