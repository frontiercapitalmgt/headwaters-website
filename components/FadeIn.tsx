"use client";

import { useRef, useEffect, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  yOffset?: number;
  xOffset?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  className = "",
  yOffset = 28,
  xOffset = 0,
}: FadeInProps) {
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate(0, 0)"
          : `translate(${xOffset}px, ${yOffset}px)`,
        transition: `opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
