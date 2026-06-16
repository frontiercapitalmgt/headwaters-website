"use client";

import { useEffect, useRef, useState } from "react";

type Segment = {
  text: string;
  /** Tailwind classes applied to this run of text (e.g. a brand color) */
  className?: string;
};

type Props = {
  segments: Segment[];
  /** ms between characters */
  speed?: number;
  /** ms to wait before typing starts */
  startDelay?: number;
  /** show the blinking caret (default true) */
  caret?: boolean;
  /** only begin typing once the text scrolls into view (default false) */
  startOnView?: boolean;
};

/**
 * Types the segments out one character at a time. Segments let part of the
 * heading carry a different color while still typing as one continuous line.
 * The full text is always present (visually hidden) for screen readers and
 * search engines. Honours reduced-motion.
 */
export default function TypewriterText({
  segments,
  speed = 42,
  startDelay = 350,
  caret = true,
  startOnView = false,
}: Props) {
  const fullText = segments.map((s) => s.text).join("");
  const total = fullText.length;

  const [count, setCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setCount(total);
      return;
    }

    let startTimer: ReturnType<typeof setTimeout> | undefined;
    const begin = () => {
      startTimer = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          setCount((c) => {
            if (c >= total) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              return c;
            }
            return c + 1;
          });
        }, speed);
      }, startDelay);
    };

    let obs: IntersectionObserver | undefined;
    if (startOnView && anchorRef.current) {
      obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            obs?.disconnect();
            begin();
          }
        },
        { threshold: 0, rootMargin: "0px 0px -15% 0px" }
      );
      obs.observe(anchorRef.current);
    } else {
      begin();
    }

    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      obs?.disconnect();
    };
  }, [total, speed, startDelay, startOnView]);

  // Reveal characters across segments in order.
  let used = 0;
  const typed = segments.map((seg, i) => {
    const show = Math.max(0, Math.min(seg.text.length, count - used));
    used += seg.text.length;
    return (
      <span key={i} className={seg.className}>
        {seg.text.slice(0, show)}
      </span>
    );
  });

  const caretEl = caret ? (
    <span
      aria-hidden="true"
      className="animate-hw-caret text-gold-600 font-normal"
      style={{ marginLeft: "1px" }}
    >
      |
    </span>
  ) : null;

  // When triggered on scroll, reserve the heading's full size with an invisible
  // ghost: gives a measurable box for the in-view trigger and types in place
  // with no layout shift.
  if (startOnView) {
    return (
      <>
        <span className="sr-only">{fullText}</span>
        <span
          ref={anchorRef}
          aria-hidden="true"
          style={{ position: "relative", display: "inline-block" }}
        >
          <span style={{ visibility: "hidden" }}>{fullText}</span>
          <span style={{ position: "absolute", left: 0, top: 0, width: "100%" }}>
            {typed}
            {caretEl}
          </span>
        </span>
      </>
    );
  }

  return (
    <>
      <span className="sr-only">{fullText}</span>
      <span aria-hidden="true">{typed}</span>
      {caretEl}
    </>
  );
}
