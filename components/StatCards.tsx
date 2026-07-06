"use client";

import { useRef, useEffect, useState } from "react";

type Stat = {
  value: string;
  label: string;
  icon: "check" | "growth" | "seed";
};

const stats: Stat[] = [
  { value: "$100k–$250k", label: "First check", icon: "check" },
  { value: "$250K", label: "Max follow-on per company", icon: "growth" },
  { value: "Pre-revenue", label: "The stage we invest", icon: "seed" },
];

function Icon({ id }: { id: Stat["icon"] }) {
  const p = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-10 h-10",
  };
  if (id === "check")
    return (
      <svg {...p}>
        <rect x="4" y="8" width="24" height="16" rx="2.5" />
        <circle cx="16" cy="16" r="3.5" />
        <line x1="8" y1="12" x2="8" y2="12.01" />
        <line x1="24" y1="20" x2="24" y2="20.01" />
      </svg>
    );
  if (id === "growth")
    return (
      <svg {...p}>
        <polyline points="5,22 13,15 18,19 27,9" />
        <polyline points="21,9 27,9 27,15" />
      </svg>
    );
  // seed / sprout
  return (
    <svg {...p}>
      <path d="M16 27 V15" />
      <path d="M16 18 C10.5 18 7.5 14.5 7.5 9.5 C13 9.5 16 13 16 18 Z" />
      <path d="M16 15.5 C21.5 15.5 24.5 12 24.5 7 C19 7 16 10.5 16 15.5 Z" />
    </svg>
  );
}

function Card({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const delay = index * 150;

  const connector = (h: number, d: number) => (
    <span
      className="block w-px bg-gold-300 mx-auto"
      style={{
        height: h,
        transformOrigin: "top",
        transform: visible ? "scaleY(1)" : "scaleY(0)",
        transition: `transform 0.55s ${ease} ${delay + d}ms`,
      }}
    />
  );

  return (
    <div
      ref={ref}
      className="relative px-3 py-8 text-center flex flex-col items-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(26px)",
        transition: `opacity 0.8s ${ease} ${delay}ms, transform 0.8s ${ease} ${delay}ms`,
      }}
    >
      {/* icon — no background, just the mark */}
      <div
        className="text-gold-600"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.6)",
          transition: `opacity 0.7s ${ease} ${delay + 100}ms, transform 0.7s ${ease} ${delay + 100}ms`,
        }}
      >
        <Icon id={stat.icon} />
      </div>

      {/* line connecting the icon down to the number */}
      {connector(26, 240)}

      {/* number — masked slide-up reveal */}
      <span className="block overflow-hidden">
        <span
          className="block font-display font-extrabold text-navy-900 leading-none whitespace-nowrap"
          style={{
            fontSize: "clamp(2.5rem, 4.2vw, 3.4rem)",
            transform: visible ? "translateY(0)" : "translateY(112%)",
            transition: `transform 0.9s ${ease} ${delay + 320}ms`,
          }}
        >
          {stat.value}
        </span>
      </span>

      {/* line connecting the number down to the label */}
      {connector(22, 520)}

      <div
        className="mt-3 text-[13px] font-semibold tracking-[0.07em] uppercase text-navy-500"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity 0.8s ${ease} ${delay + 600}ms`,
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

export default function StatCards() {
  return (
    <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <Card key={s.value} stat={s} index={i} />
      ))}
    </div>
  );
}
