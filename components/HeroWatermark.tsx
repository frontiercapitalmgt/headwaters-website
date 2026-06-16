"use client";

import { useEffect, useState, useRef } from "react";

const WORD = "Headwaters";

export default function HeroWatermark() {
  const [typed, setTyped] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      i += 1;
      setTyped(WORD.slice(0, i));
      if (i < WORD.length) {
        timerRef.current = setTimeout(tick, 165);
      }
    };
    timerRef.current = setTimeout(tick, 650);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none whitespace-nowrap flex items-baseline"
    >
      <span
        className="font-cormorant font-semibold leading-none text-navy-100"
        style={{ fontSize: "clamp(7rem, 22vw, 20rem)", letterSpacing: "0.01em" }}
      >
        {typed}
      </span>
      <span
        className="inline-block bg-gold-300 animate-hw-caret"
        style={{
          width: "0.04em",
          height: "0.72em",
          marginLeft: "0.05em",
          alignSelf: "center",
          fontSize: "clamp(7rem, 22vw, 20rem)",
        }}
      />
    </div>
  );
}
