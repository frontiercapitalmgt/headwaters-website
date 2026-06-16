"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

/**
 * Plays a video a single time once it scrolls into view, then leaves it parked
 * on its final frame — it never loops or replays.
 */
export default function MissionVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playedRef.current) {
          playedRef.current = true;
          v.play().catch(() => {});
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    obs.observe(v);
    return () => obs.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={className}
      muted
      playsInline
      preload="metadata"
    />
  );
}
