"use client";

import { useEffect, useRef } from "react";

/**
 * A thin gold divider between the hero and the stats whose right end bends and
 * meanders down the page like a river, in the same family as the wave under the
 * Headwaters logo but far thinner. The leading edge is drawn (stroke-dash) to
 * track the scroll, so it flows down as the visitor scrolls.
 *
 * Robustness notes:
 *  - The SVG is sized to the region's exact CSS-pixel width/height with a 1:1
 *    viewBox, so path coordinates ARE page pixels — no preserveAspectRatio
 *    stretching, and everything stays correct under browser zoom.
 *  - The path is generated to fit whatever height the region is, and rebuilt on
 *    resize/zoom.
 *  - The leading edge is mapped through a Y→length table so it sits at a fixed
 *    point in the viewport regardless of how much the river wanders sideways.
 */

const TIP = 0.72; // leading edge sits ~72% down the viewport, so you watch it draw
const ACCEL = 1.0; // 1:1 with scroll now that the pixel mapping is correct

// Deterministic RNG so the "random" wave is stable between rebuilds.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Gentle wavy horizontal divider from x=0 to x=startX.
function dividerPath(startX: number, y0: number, rng: () => number) {
  const humps = Math.max(4, Math.round(startX / 190));
  const seg = startX / humps;
  let d = `M 0 ${y0}`;
  let px = 0;
  let py = y0;
  for (let i = 1; i <= humps; i++) {
    const nx = i === humps ? startX : seg * i;
    const ny = i === humps ? y0 : y0 + (rng() - 0.5) * 16;
    const c1x = px + seg * 0.45;
    const c2x = nx - seg * 0.45;
    d += ` C ${c1x.toFixed(1)} ${py.toFixed(1)} ${c2x.toFixed(1)} ${ny.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
    px = nx;
    py = ny;
  }
  return d;
}

// Meandering river from (startX, top) down to the bottom of the region.
function riverPath(W: number, H: number, startX: number, top: number, rng: () => number) {
  const left = W * 0.1;
  const right = W * 0.9;
  const swings = Math.max(4, Math.round((H - top) / 360));
  const segH = (H - top) / swings;
  let d = `M ${startX.toFixed(1)} ${top}`;
  let px = startX;
  let py = top;
  for (let i = 0; i < swings; i++) {
    const base = i % 2 === 0 ? left : right;
    const tx = base + (rng() - 0.5) * W * 0.07;
    const ty = top + segH * (i + 1) + (i < swings - 1 ? (rng() - 0.5) * segH * 0.16 : 0);
    const c1x = px + (rng() - 0.5) * W * 0.05;
    const c1y = py + segH * 0.5;
    const c2x = tx + (rng() - 0.5) * W * 0.05;
    const c2y = ty - segH * 0.5;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`;
    px = tx;
    py = ty;
  }
  return d;
}

export default function RiverDivider() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dividerRef = useRef<SVGPathElement>(null);
  const riverRef = useRef<SVGPathElement>(null);
  const echoRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const divider = dividerRef.current;
    const river = riverRef.current;
    const echo = echoRef.current;
    if (!wrap || !svg || !divider || !river || !echo) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const TOP = 16;

    let lenR = 0;
    let lenE = 0;
    let lenD = 0;
    let ys: number[] = [];
    let ls: number[] = [];

    // Length needed to reach a given Y (Y is monotonic down the river).
    const fracAtY = (targetY: number) => {
      const N = ys.length - 1;
      if (N < 1) return 0;
      if (targetY <= ys[0]) return 0;
      if (targetY >= ys[N]) return 1;
      let lo = 0;
      let hi = N;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (ys[mid] <= targetY) lo = mid;
        else hi = mid - 1;
      }
      const y0 = ys[lo];
      const y1 = ys[lo + 1];
      const t = y1 > y0 ? (targetY - y0) / (y1 - y0) : 0;
      return (ls[lo] + (ls[lo + 1] - ls[lo]) * t) / lenR;
    };

    const draw = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;

      // Divider draws in (left→right) as the region's top crosses the bottom of
      // the viewport up to the tip line, just before the river takes over.
      const span = vh * (1 - TIP) || 1;
      const dp = reduce ? 1 : Math.max(0, Math.min(1, (vh - rect.top) / span));
      divider.style.strokeDashoffset = `${lenD * (1 - dp)}`;

      let f = ((vh * TIP - rect.top) / rect.height) * ACCEL;
      f = reduce ? 1 : Math.max(0, Math.min(1, f));
      const targetY = f * rect.height;
      const frac = fracAtY(targetY);
      river.style.strokeDashoffset = `${lenR * (1 - frac)}`;
      const fracE = fracAtY(Math.max(0, targetY - rect.height * 0.02));
      echo.style.strokeDashoffset = `${lenE * (1 - fracE)}`;
    };

    const build = () => {
      const W = wrap.clientWidth;
      const H = wrap.offsetHeight;
      if (!W || !H) return;

      // 1:1 viewBox => path coordinates are page pixels (zoom-proof).
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("width", `${W}`);
      svg.setAttribute("height", `${H}`);

      const startX = W * 0.78;
      const dRng = mulberry32(0x9e37);
      const rRng = mulberry32(0x51ed);
      divider.setAttribute("d", dividerPath(startX, TOP, dRng));
      const rp = riverPath(W, H, startX, TOP, rRng);
      river.setAttribute("d", rp);
      echo.setAttribute("d", rp);

      lenR = river.getTotalLength();
      lenE = echo.getTotalLength();
      lenD = divider.getTotalLength();
      river.style.strokeDasharray = `${lenR}`;
      echo.style.strokeDasharray = `${lenE}`;
      divider.style.strokeDasharray = `${lenD}`;

      const N = 300;
      ys = new Array(N + 1);
      ls = new Array(N + 1);
      for (let i = 0; i <= N; i++) {
        const l = (lenR * i) / N;
        ys[i] = river.getPointAtLength(l).y;
        ls[i] = l;
      }
      draw();
    };

    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        draw();
      });
    };

    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(wrap);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
      <svg ref={svgRef} preserveAspectRatio="none" style={{ display: "block" }}>
        {/* gentle wavy divider — always visible */}
        <path
          ref={dividerRef}
          fill="none"
          stroke="#BB8956"
          strokeWidth="1.4"
          opacity="0.5"
          strokeLinecap="round"
        />
        {/* faint echo stream, nudged across slightly */}
        <path
          ref={echoRef}
          transform="translate(13 -3)"
          fill="none"
          stroke="#d6ad8e"
          strokeWidth="1"
          opacity="0.32"
          strokeLinecap="round"
        />
        {/* main stream */}
        <path
          ref={riverRef}
          fill="none"
          stroke="#BB8956"
          strokeWidth="1.4"
          opacity="0.68"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
