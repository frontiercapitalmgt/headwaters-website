"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Fades and lifts its children as the visitor scrolls down through the first
 * viewport, so the full-screen hero dissolves into the sections below.
 * Respects reduced-motion (then it just stays put, fully visible).
 */
export default function HeroScrollFade({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const y = window.scrollY;
      // Match the landing page: exit upward ~1.6× faster than scroll,
      // fully faded by 380px of scroll.
      el.style.transform = `translateY(${-y * 0.6}px)`;
      el.style.opacity = String(Math.max(0, 1 - y / 380));
      // once fully faded, stop intercepting any hover/pointer events
      el.style.pointerEvents = y >= 380 ? "none" : "";
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ willChange: "opacity, transform" }}>
      {children}
    </div>
  );
}
