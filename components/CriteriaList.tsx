"use client";

import { useRef, useEffect, useState } from "react";

const criteria = [
  { k: "01", title: "Pre-revenue", body: "We invest from concept stage through early prototype — before a company has generated meaningful recurring revenue." },
  { k: "02", title: "Hardware-related", body: "Hardware-enabled innovation is our primary lens. We stay open to genuine deep tech, with no sector dogma." },
  { k: "03", title: "A genuinely hard problem", body: "The work must demand real technical or scientific innovation — not incremental improvement on what already exists." },
  { k: "04", title: "A valuable problem", body: "A large market, a critical infrastructure need, or a gap that customers will pay meaningfully to close." },
  { k: "05", title: "Founders first", body: "The earlier and less proven the technology, the more exceptional the founding team has to be." },
  { k: "06", title: "Capital discipline", body: "A clear path from initial investment to defined technical milestones and a credible next round." },
];

function CriteriaRow({
  k,
  title,
  body,
  flip,
}: {
  k: string;
  title: string;
  body: string;
  flip: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

  // The number slides in from its outer edge; the text slides from the inner edge.
  const numFrom = flip ? 60 : -60;
  const textFrom = flip ? -48 : 48;

  return (
    <div
      ref={ref}
      className="group grid items-center gap-8 md:gap-12 py-12 md:py-16 border-t border-navy-100"
      style={{ gridTemplateColumns: "1fr" }}
    >
      <div
        className={`grid items-center gap-6 md:gap-12 ${
          flip ? "md:[grid-template-columns:1fr_auto]" : "md:[grid-template-columns:auto_1fr]"
        }`}
      >
        {/* ── Number ── */}
        <div
          className={`relative select-none ${flip ? "md:order-2" : "md:order-1"}`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateX(0) scale(1)"
              : `translateX(${numFrom}px) scale(0.85)`,
            transition: `opacity 0.9s ${ease}, transform 0.9s ${ease}`,
          }}
        >
          <span
            className="block font-display font-extrabold leading-none tracking-[-0.04em] text-transparent transition-transform duration-500 group-hover:scale-[1.04]"
            style={{
              fontSize: "clamp(4.5rem, 11vw, 9rem)",
              WebkitTextStroke: "2px rgb(203 178 106 / 0.55)",
            }}
          >
            {k}
          </span>
          {/* solid overlay that wipes in on reveal */}
          <span
            aria-hidden
            className="absolute inset-0 block font-display font-extrabold leading-none tracking-[-0.04em] text-gold-500 overflow-hidden transition-transform duration-500 group-hover:scale-[1.04]"
            style={{
              fontSize: "clamp(4.5rem, 11vw, 9rem)",
              clipPath: visible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              transition: `clip-path 1s ${ease} 0.25s`,
            }}
          >
            {k}
          </span>
        </div>

        {/* ── Title + body ── */}
        <div
          className={`${flip ? "md:order-1 md:text-right" : "md:order-2"}`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : `translateX(${textFrom}px)`,
            transition: `opacity 0.9s ${ease} 0.12s, transform 0.9s ${ease} 0.12s`,
          }}
        >
          <div
            className={`h-[3px] bg-gold-500 rounded-full mb-5 ${flip ? "md:ml-auto" : ""}`}
            style={{
              width: visible ? 48 : 0,
              transition: `width 0.7s ${ease} 0.4s`,
            }}
          />
          <h3 className="font-display font-bold text-[clamp(1.4rem,2.6vw,2rem)] text-navy-900 leading-[1.15] m-0 mb-3">
            {title}
          </h3>
          <p
            className={`text-[17px] leading-[1.65] text-navy-600 m-0 max-w-[460px] ${
              flip ? "md:ml-auto" : ""
            }`}
          >
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CriteriaList() {
  return (
    <div className="mt-16 max-w-[920px] mx-auto border-b border-navy-100">
      {criteria.map((c, i) => (
        <CriteriaRow
          key={c.k}
          k={c.k}
          title={c.title}
          body={c.body}
          flip={i % 2 === 1}
        />
      ))}
    </div>
  );
}
