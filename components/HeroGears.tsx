"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Two interlocked gears turning behind the founders hero. The smaller gear
 * meshes into the larger one; because their tooth counts (16 / 11) set the
 * speed ratio (32s / 22s) and they spin in opposite directions, the teeth
 * stay locked together as they rotate.
 *
 * On scroll the two gears drift apart and sink downward — as if they're
 * coming loose and falling with the page. Purely decorative; honours
 * reduced-motion (no spin, no scroll drift).
 */

// Pitch radius = module * teeth / 2, so a shared module keeps the teeth the
// same physical size on both gears — that's what lets them mesh.
const MODULE = 18;
const ADDENDUM = 14; // how far a tooth sticks out past the pitch circle
const DEDENDUM = 16; // how far the valley sits inside it

function gearPath(teeth: number) {
  const pitchR = (MODULE * teeth) / 2;
  const rTop = pitchR + ADDENDUM;
  const rRoot = pitchR - DEDENDUM;
  const pitch = (Math.PI * 2) / teeth;
  const topHalf = (pitch * 0.34) / 2; // tooth width at the tip
  const baseHalf = (pitch * 0.58) / 2; // tooth width at the root
  const pt = (r: number, a: number) =>
    `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;

  let d = `M ${pt(rRoot, -baseHalf)} `;
  for (let i = 0; i < teeth; i++) {
    const c = i * pitch;
    d += `L ${pt(rTop, c - topHalf)} `;
    d += `L ${pt(rTop, c + topHalf)} `;
    d += `L ${pt(rRoot, c + baseHalf)} `;
    const nextP1 = (i + 1) * pitch - baseHalf;
    d += `A ${rRoot} ${rRoot} 0 0 1 ${pt(rRoot, nextP1)} `;
  }
  return d + "Z";
}

function Gear({
  teeth,
  spin,
  stroke,
  fill,
}: {
  teeth: number;
  spin: "cw" | "ccw";
  stroke: string;
  fill: string;
}) {
  const pitchR = (MODULE * teeth) / 2;
  const hubR = (pitchR - DEDENDUM) * 0.46;
  const boreR = hubR * 0.42;
  // small bolt holes ringing the hub, for clipart character
  const bolts = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    const r = hubR * 0.66;
    return { cx: r * Math.cos(a), cy: r * Math.sin(a) };
  });

  return (
    <g className={`hw-gear hw-gear-${spin}`}>
      <path d={gearPath(teeth)} fill={fill} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      <circle r={hubR} fill="none" stroke={stroke} strokeWidth={2} />
      <circle r={boreR} fill="#ffffff" stroke={stroke} strokeWidth={2} />
      {bolts.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={3.4} fill={stroke} />
      ))}
    </g>
  );
}

const BIG_TEETH = 16;
const SMALL_TEETH = 11;
// Center distance = sum of pitch radii, so the gears touch tooth-to-valley.
const CX = (MODULE * BIG_TEETH) / 2 + (MODULE * SMALL_TEETH) / 2;

export default function HeroGears() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bigRef = useRef<SVGGElement>(null);
  const smallRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const big = bigRef.current;
    const small = smallRef.current;
    if (!wrap || !big || !small) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      // p: 0 at the top of the page, 1 after one viewport of scrolling.
      const p = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1.4);
      const spread = p * 70; // horizontal drift apart (user units)
      const dropBig = p * 130; // big gear sinks…
      const dropSmall = p * 200; // …small gear falls a little faster
      // base position lives on an inner <g>; this only adds the scroll drift.
      big.style.transform = `translate(${-spread}px, ${dropBig}px) rotate(${p * 8}deg)`;
      small.style.transform = `translate(${spread}px, ${dropSmall}px) rotate(${-p * 12}deg)`;
      // Fade out as they fall so the section edge never hard-cuts them.
      wrap.style.opacity = String(0.55 * (1 - Math.min(p / 0.8, 1)));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
      style={{ "--gear-y": "-2%", opacity: 0.55 } as CSSProperties}
    >
      <svg
        viewBox="-185 -180 560 360"
        className="overflow-visible"
        style={{
          width: "clamp(560px, 88vw, 1080px)",
          transform: "translateY(var(--gear-y))",
        }}
      >
        {/* big gear — scroll drift on the outer <g>, base position on the inner */}
        <g ref={bigRef} style={{ willChange: "transform" }}>
          <g transform="translate(0 0)">
            <Gear teeth={BIG_TEETH} spin="cw" stroke="#e3c4ae" fill="#fdf6f0" />
          </g>
        </g>
        {/* smaller gear meshed to its right, on the same centre line */}
        <g ref={smallRef} style={{ willChange: "transform" }}>
          <g transform={`translate(${CX} 0)`}>
            <Gear teeth={SMALL_TEETH} spin="ccw" stroke="#b4cae6" fill="#edf4fb" />
          </g>
        </g>
      </svg>
    </div>
  );
}
