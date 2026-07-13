"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const questions = [
  {
    k: "1",
    title: "What problem are you solving, and why is it hard?",
    body: "We invest where the problem demands real technical or scientific innovation — not incremental improvement. Tell us what the problem is, who has it, and what technical or scientific barriers have prevented others from solving it.",
  },
  {
    k: "2",
    title: "Why is the solution valuable, and to whom?",
    body: "A hard problem only qualifies if solving it creates meaningful value. What is the market opportunity? Who are the customers, and what evidence — conversations, letters of intent, pilot commitments, market data — shows they will pay to close this gap?",
  },
  {
    k: "3",
    title: "Who is on your team, and what have you built before?",
    body: "At pre-revenue seed stage, the team is the primary asset. For each founder, share your technical background and domain experience — then tell us the most impressive thing you've personally built or achieved.",
  },
  {
    k: "4",
    title: "Where is the technology today, and what are your next three milestones?",
    body: "We don't require proof that the technology works — but we do require a credible technical pathway. Share your current stage, what you've demonstrated, and your next three milestones. For each, be specific: what must be true, and how will you know?",
  },
  {
    k: "5",
    title: "How will you use this investment, and what will it unlock?",
    body: "We make initial investments with deployment and execution in mind. Tell us how the capital will be deployed, what milestones it funds, and what those milestones unlock — a next round, a technical proof point, or a customer pilot. Mention any non-dilutive sources (grants, SBIR, partnerships) too.",
  },
];

// Which tiles connect, the direction of the gap they cross, and when each draws
const connectors: { a: number; b: number; dir: "h" | "v"; delay: number }[] = [
  { a: 0, b: 1, dir: "h", delay: 0 },
  { a: 0, b: 2, dir: "v", delay: 500 },
  { a: 1, b: 3, dir: "v", delay: 700 },
  { a: 2, b: 3, dir: "h", delay: 1150 },
  { a: 2, b: 4, dir: "v", delay: 1650 },
  { a: 3, b: 4, dir: "v", delay: 1850 },
];

const DRAW_MS = 900; // slow, deliberate draw

interface Seg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  len: number;
  delay: number;
}

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function QuestionsGrid() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [segs, setSegs] = useState<Seg[]>([]);
  const [visible, setVisible] = useState(false);

  // Measure tile positions and build the connector segments that sit in the gaps
  useIso(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const o = wrap.getBoundingClientRect();
      const rects = tileRefs.current.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          left: r.left - o.left,
          right: r.right - o.left,
          top: r.top - o.top,
          bottom: r.bottom - o.top,
          cx: (r.left + r.right) / 2 - o.left,
          cy: (r.top + r.bottom) / 2 - o.top,
        };
      });
      const next: Seg[] = [];
      for (const c of connectors) {
        const a = rects[c.a];
        const b = rects[c.b];
        if (!a || !b) continue;
        let x1: number, y1: number, x2: number, y2: number;
        if (c.dir === "h") {
          y1 = y2 = a.cy;
          x1 = a.right;
          x2 = b.left;
        } else {
          x1 = a.cx;
          x2 = a.cx;
          y1 = a.bottom;
          y2 = b.top;
        }
        next.push({ x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1), delay: c.delay });
      }
      setSegs(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Trigger the draw when the section scrolls into view
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      {/* Connector lines, behind the tiles — only visible in the gaps */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      >
        {segs.map((s, i) => (
          <g key={i}>
            <line
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke="#BB8956"
              strokeWidth={2}
              strokeLinecap="round"
              style={{
                strokeDasharray: s.len,
                strokeDashoffset: visible ? 0 : s.len,
                transition: `stroke-dashoffset ${DRAW_MS}ms cubic-bezier(0.4, 0, 0.2, 1) ${s.delay}ms`,
              }}
            />
            <circle
              cx={s.x1}
              cy={s.y1}
              r={3}
              fill="#BB8956"
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 300ms ease ${s.delay}ms`,
              }}
            />
            <circle
              cx={s.x2}
              cy={s.y2}
              r={3}
              fill="#BB8956"
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 300ms ease ${s.delay + DRAW_MS}ms`,
              }}
            />
          </g>
        ))}
      </svg>

      {/* The spaced-out tiles */}
      <div ref={gridRef} className="relative z-10 grid grid-cols-2 gap-9">
        {questions.map((q, i) => (
          <div
            key={q.k}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            className={`bg-white border border-navy-100 rounded-xl p-9 shadow-sm hover:shadow-md hover:border-gold-200 transition-shadow duration-300 ${
              i === 4 ? "col-span-2" : ""
            }`}
          >
            <div className="font-display font-extrabold text-[38px] leading-none text-gold-600 mb-4">
              {q.k}
            </div>
            <h3 className="font-display font-bold text-[21px] text-navy-900 mb-3 leading-[1.25]">
              {q.title}
            </h3>
            <p className="text-[15.5px] leading-[1.65] text-navy-600 m-0">
              {q.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
