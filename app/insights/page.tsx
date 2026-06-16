"use client";

import { useState } from "react";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";

const articles = [
  {
    cat: "Thesis",
    title: "Why we invest at the headwaters",
    excerpt: "The earliest stage is the hardest to price — and the most important to get right.",
    date: "May 2026",
    read: "6 min",
  },
  {
    cat: "Hardware",
    title: "The case for pre-revenue hardware",
    excerpt: "Software ate the world. The next decade belongs to the people building atoms.",
    date: "Apr 2026",
    read: "8 min",
  },
  {
    cat: "Montana",
    title: "Building a frontier fund from Bozeman",
    excerpt: "Why more of the best hard-tech founders are building far from the coasts.",
    date: "Mar 2026",
    read: "5 min",
  },
  {
    cat: "Founders",
    title: "What a $100K first check really buys",
    excerpt: "Conviction, speed, and a partner who has built hardware before you did.",
    date: "Feb 2026",
    read: "4 min",
  },
  {
    cat: "Climate",
    title: "Hard tech for a warming world",
    excerpt: "The climate fight will be won in factories and on the grid — not in slide decks.",
    date: "Jan 2026",
    read: "7 min",
  },
  {
    cat: "Portfolio",
    title: "Welcome, Cascade Dynamics",
    excerpt: "Leading the pre-seed in autonomous heavy machinery for the resource economy.",
    date: "Dec 2025",
    read: "3 min",
  },
];

export default function InsightsPage() {
  const [email, setEmail] = useState("");
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header + Featured ── */}
      <section className="bg-white pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="max-w-[760px] flex flex-col items-start">
            <Eyebrow label="Insights" />
            <h1
              className="font-display font-extrabold text-navy-900 leading-[1.1] tracking-[-0.025em] mt-[22px] max-w-[600px]"
              style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.6rem)" }}
            >
              Notes from the headwaters
            </h1>
            <p className="max-w-[560px] mt-6 text-[19px] leading-[1.62] text-navy-700">
              Our thinking on hardware, the earliest stage, and building a
              frontier fund — written plainly, for founders and investors alike.
            </p>
          </div>

          {/* Featured article */}
          <div
            className="mt-12 bg-navy-900 rounded-lg overflow-hidden grid"
            style={{ gridTemplateColumns: "1.15fr 1fr" }}
          >
            <div className="p-12 flex flex-col justify-center">
              <span className="self-start text-[10px] font-bold tracking-[0.12em] uppercase text-navy-900 bg-gold-500 px-[11px] py-[5px] rounded-full">
                {featured.cat}
              </span>
              <h2
                className="font-display font-extrabold text-white leading-[1.12] tracking-[-0.02em] mt-[22px]"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
              >
                {featured.title}
              </h2>
              <p className="text-[17px] leading-[1.62] text-navy-200 mt-[18px] max-w-[460px]">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-[14px] mt-[26px] text-[13px] font-semibold tracking-[0.04em] uppercase text-navy-300">
                <span>{featured.date}</span>
                <span className="text-navy-500">·</span>
                <span>{featured.read} read</span>
              </div>
              <div className="mt-[30px]">
                <Button variant="accent" size="md" href="#">
                  Read Article →
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-navy-800 to-navy-950 relative min-h-[340px] overflow-hidden">
              <svg
                viewBox="0 0 600 400"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 w-full h-full"
              >
                <path d="M0,250 C120,210 240,300 360,250 C460,210 540,290 600,250" fill="none" stroke="#BB8956" strokeWidth="2" opacity="0.55"/>
                <path d="M0,280 C120,245 240,330 360,282 C460,245 540,320 600,282" fill="none" stroke="#c99970" strokeWidth="1.5" opacity="0.4"/>
                <path d="M0,220 C120,180 240,270 360,220 C460,182 540,260 600,222" fill="none" stroke="#d6ad8e" strokeWidth="1.5" opacity="0.3"/>
                <path d="M0,310 C120,280 240,360 360,312 C460,280 540,346 600,312" fill="none" stroke="#e3c4ae" strokeWidth="1" opacity="0.25"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article Grid ── */}
      <section className="bg-white pb-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-3 gap-[22px]">
            {rest.map((a) => (
              <article
                key={a.title}
                className="bg-white border border-navy-100 rounded-lg p-[30px] shadow-sm flex flex-col min-h-[260px] hover:shadow-md transition-shadow cursor-pointer"
              >
                <span className="self-start text-[10px] font-bold tracking-[0.1em] uppercase text-gold-700 bg-gold-50 border border-gold-200 px-[10px] py-[5px] rounded-full">
                  {a.cat}
                </span>
                <h3 className="font-display font-bold text-[21px] text-navy-900 leading-[1.2] mt-5 mb-[10px]">
                  {a.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-navy-600 m-0">
                  {a.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-auto pt-[22px] text-[12px] font-semibold tracking-[0.04em] uppercase text-navy-400">
                  <span>{a.date}</span>
                  <span className="text-navy-300">·</span>
                  <span>{a.read} read</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-navy-50 border-t border-navy-100 py-20">
        <div className="max-w-[880px] mx-auto px-8 text-center">
          <Eyebrow label="Stay Close" centered />
          <h2
            className="font-display font-extrabold text-navy-900 leading-[1.14] tracking-[-0.02em] mt-[18px]"
            style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)" }}
          >
            A note in your inbox, now and then
          </h2>
          <p className="max-w-[480px] mx-auto mt-4 text-[17px] leading-[1.6] text-navy-700">
            Occasional writing on hardware and the frontier. No noise, no spam
            — we hate it too.
          </p>
          <div className="flex gap-[10px] max-w-[440px] mx-auto mt-[30px] flex-wrap justify-center">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-[240px] px-4 py-[13px] text-[15px] text-navy-900 bg-white border border-navy-200 rounded outline-none focus:border-gold-600 focus:shadow-gold-focus transition-colors"
            />
            <Button variant="primary" size="md">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
