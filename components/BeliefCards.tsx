"use client";

import { useRef, useEffect } from "react";

type Item = { k: string; title: string; body: string };

function Card({ k, title, body }: Item) {
  return (
    <div className="border border-navy-100 rounded-xl p-10 bg-white hover:shadow-lg hover:-translate-y-[2px] transition-[box-shadow,transform] duration-300 h-full flex flex-col">
      <div className="font-mono text-[28px] font-semibold text-gold-600 leading-none tracking-[0.04em]">
        {k}
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

export default function BeliefCards({ items }: { items: Item[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const top = topRef.current;
    const bot = botRef.current;
    if (!wrap || !top || !bot) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

      // Quadratic ease: settled (≈0) near centre, accelerates at the edges
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
        {items.slice(0, 3).map((b) => (
          <Card key={b.k} {...b} />
        ))}
      </div>
      <div ref={botRef} className="grid grid-cols-3 gap-5 will-change-transform">
        {items.slice(3).map((b) => (
          <Card key={b.k} {...b} />
        ))}
      </div>
    </div>
  );
}
