"use client";

import { useRef, useEffect } from "react";

const focus = [
  { k: "01", title: "Robotics & Autonomous", body: "The structural majority of the early-stage hardtech universe — from industrial automation and defense UGVs to agricultural robots and humanoid platforms." },
  { k: "02", title: "Energy & Climate", body: "Storage, generation, carbon capture, and grid hardware built for the energy transition — where long development cycles meet enormous market pull." },
  { k: "03", title: "Medtech & Biotech", body: "Hardware-enabled medical devices, diagnostics, lab automation, and biotech instrumentation solving problems that pure software cannot." },
  { k: "04", title: "Semi / Photonics / Quantum", body: "Semiconductors, coherent optics, photonic sensing, and quantum platforms — the infrastructure layer for the next generation of physical-world computing." },
  { k: "05", title: "Advanced Materials & Mfg", body: "Novel materials, composites, deposition processes, and manufacturing breakthroughs that change what can be built and at what cost." },
  { k: "06", title: "Other Hardware", body: "We follow the problem, not the category. Any hardware-enabled solution demanding genuine technical innovation and addressing a large market falls within our mandate." },
];

function SectorIcon({ id }: { id: string }) {
  const props = { viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "w-9 h-9" };
  if (id === "01") return (
    <svg {...props}>
      <line x1="4" y1="27" x2="12" y2="27" /><line x1="8" y1="27" x2="8" y2="18" />
      <line x1="8" y1="18" x2="18" y2="11" /><line x1="18" y1="11" x2="26" y2="11" />
      <circle cx="8" cy="18" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="11" r="2.5" fill="currentColor" stroke="none" />
      <line x1="23" y1="7" x2="26" y2="11" /><line x1="23" y1="15" x2="26" y2="11" />
    </svg>
  );
  if (id === "02") return (
    <svg {...props}>
      <path d="M20 4 L11 17 H17 L12 28 L21 15 H15 Z" />
    </svg>
  );
  if (id === "03") return (
    <svg {...props}>
      <path d="M10 4 C14 10 18 10 22 16 C18 22 14 22 10 28" />
      <path d="M22 4 C18 10 14 10 10 16 C14 22 18 22 22 28" />
      <line x1="11.5" y1="8.5" x2="20.5" y2="8.5" />
      <line x1="10.5" y1="16" x2="21.5" y2="16" />
      <line x1="11.5" y1="23.5" x2="20.5" y2="23.5" />
    </svg>
  );
  if (id === "04") return (
    <svg {...props}>
      <rect x="10" y="10" width="12" height="12" rx="1" />
      <line x1="13" y1="10" x2="13" y2="6" /><line x1="16" y1="10" x2="16" y2="6" /><line x1="19" y1="10" x2="19" y2="6" />
      <line x1="13" y1="22" x2="13" y2="26" /><line x1="16" y1="22" x2="16" y2="26" /><line x1="19" y1="22" x2="19" y2="26" />
      <line x1="10" y1="13" x2="6" y2="13" /><line x1="10" y1="16" x2="6" y2="16" /><line x1="10" y1="19" x2="6" y2="19" />
      <line x1="22" y1="13" x2="26" y2="13" /><line x1="22" y1="16" x2="26" y2="16" /><line x1="22" y1="19" x2="26" y2="19" />
    </svg>
  );
  if (id === "05") return (
    <svg {...props}>
      <polygon points="16,4 23,8.5 23,17.5 16,22 9,17.5 9,8.5" />
      <circle cx="16" cy="4" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="23" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="23" cy="17.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="22" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="17.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
      <line x1="16" y1="22" x2="16" y2="28" />
      <circle cx="16" cy="28" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
  return (
    <svg {...props}>
      <circle cx="16" cy="16" r="4" />
      <line x1="12" y1="16" x2="6" y2="16" /><line x1="20" y1="16" x2="26" y2="16" />
      <line x1="16" y1="12" x2="16" y2="6" /><line x1="16" y1="20" x2="16" y2="26" />
      <circle cx="6" cy="16" r="2" fill="currentColor" stroke="none" />
      <circle cx="26" cy="16" r="2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="26" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Card({ k, title, body }: { k: string; title: string; body: string }) {
  return (
    <div className="border border-navy-100 rounded-xl p-10 bg-white hover:shadow-lg hover:-translate-y-[2px] transition-[box-shadow,transform] duration-300 h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div className="text-gold-600"><SectorIcon id={k} /></div>
        <div className="font-mono text-[28px] font-semibold text-navy-100 leading-none tracking-[0.04em]">
          {k}
        </div>
      </div>
      <h3 className="font-display font-bold text-[25px] text-navy-900 mt-7 mb-3 leading-[1.18]">
        {title}
      </h3>
      <p className="text-[17px] leading-[1.65] text-navy-600 m-0 flex-1">
        {body}
      </p>
    </div>
  );
}

export default function FocusCards() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const top = topRef.current;
    const bot = botRef.current;
    if (!wrap || !top || !bot) return;

    const MAX_SHIFT = 240; // px the rows travel at the extremes
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const viewportCenter = vh / 2;
      const blockCenter = rect.top + rect.height / 2;
      const range = vh / 2 + rect.height / 2;

      // t = 0 when the block is centred, +1 fully below, -1 fully above
      let t = (blockCenter - viewportCenter) / range;
      t = Math.max(-1, Math.min(1, t));

      // Quadratic ease: stays settled (≈0) near centre, accelerates at edges
      const dist = t * t;
      const shift = dist * MAX_SHIFT;
      const opacity = Math.max(0, 1 - dist);

      top.style.transform = `translate3d(${-shift}px, 0, 0)`;
      bot.style.transform = `translate3d(${shift}px, 0, 0)`;
      top.style.opacity = String(opacity);
      bot.style.opacity = String(opacity);
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
    <div ref={wrapRef} className="flex flex-col gap-5">
      <div ref={topRef} className="grid grid-cols-3 gap-5 will-change-transform">
        {focus.slice(0, 3).map((f) => (
          <Card key={f.k} k={f.k} title={f.title} body={f.body} />
        ))}
      </div>
      <div ref={botRef} className="grid grid-cols-3 gap-5 will-change-transform">
        {focus.slice(3).map((f) => (
          <Card key={f.k} k={f.k} title={f.title} body={f.body} />
        ))}
      </div>
    </div>
  );
}
