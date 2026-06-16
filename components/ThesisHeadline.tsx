"use client";

import { useEffect, useRef, useState } from "react";

const SENTENCE_1 = "The most valuable problems left are in the physical world. ";
const SENTENCE_2 = "Most capital still isn't built for them.";
const FULL = SENTENCE_1 + SENTENCE_2;

const TYPE_SPEED = 28;   // ms per character
const PAUSE = 600;       // ms pause between the two sentences

export default function ThesisHeadline() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  // Start typing only once the headline scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = (i: number) => {
      setCount(i);
      if (i >= FULL.length) return;
      // Pause when the first sentence finishes, before starting the second
      const delay = i === SENTENCE_1.length ? PAUSE : TYPE_SPEED;
      timer = setTimeout(() => tick(i + 1), delay);
    };
    timer = setTimeout(() => tick(1), 200);
    return () => clearTimeout(timer);
  }, [started]);

  const s1Len = SENTENCE_1.length;
  // First sentence stays navy; second sentence is gold — each revealed as it types
  const typed1 = FULL.slice(0, Math.min(count, s1Len));
  const typed2 = count > s1Len ? FULL.slice(s1Len, count) : "";
  const untyped = FULL.slice(count);
  const done = count >= FULL.length;

  return (
    <div ref={ref} className="relative">
      {/* The full text is ALWAYS in the layout — only its colour changes as it
          types — so line breaks are computed once and never reflow or flicker. */}
      <h2
        className="font-display font-extrabold text-navy-900 leading-[1.08] tracking-[-0.03em] m-0"
        style={{ fontSize: "clamp(2.8rem, 5.2vw, 4.4rem)" }}
      >
        <span>{typed1}</span>
        <span className="text-gold-600">{typed2}</span>
        {/* Zero-width caret sits at the typing frontier without affecting layout */}
        {!done && (
          <span style={{ position: "relative", display: "inline-block", width: 0, verticalAlign: "baseline" }}>
            <span
              className="animate-hw-caret"
              style={{
                position: "absolute",
                left: 0,
                bottom: "0.04em",
                width: "0.05em",
                height: "0.74em",
                background: "#BB8956",
              }}
            />
          </span>
        )}
        <span style={{ color: "transparent" }}>{untyped}</span>
      </h2>
    </div>
  );
}
