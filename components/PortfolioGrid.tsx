"use client";

import { useState } from "react";

const companies = [
  { name: "Cascade Dynamics", sector: "Robotics & Automation", stage: "Seed", mono: "CD" },
  { name: "Granite Power", sector: "Energy & Climate", stage: "Pre-Seed", mono: "GP" },
  { name: "Meridian Aero", sector: "Space & Aerospace", stage: "Seed", mono: "MA" },
  { name: "Terraform Materials", sector: "Advanced Materials", stage: "Pre-Seed", mono: "TM" },
  { name: "Halcyon Photonics", sector: "Compute & Sensing", stage: "Seed", mono: "HP" },
  { name: "Sawtooth Robotics", sector: "Robotics & Automation", stage: "Pre-Seed", mono: "SR" },
  { name: "Blackfoot Biosystems", sector: "Industrial Systems", stage: "Seed", mono: "BB" },
  { name: "Vantage Sensors", sector: "Compute & Sensing", stage: "Pre-Seed", mono: "VS" },
  { name: "Ironwood Mobility", sector: "Energy & Climate", stage: "Seed", mono: "IM" },
  { name: "Selway Semiconductor", sector: "Compute & Sensing", stage: "Pre-Seed", mono: "SS" },
  { name: "Confluence Climate", sector: "Energy & Climate", stage: "Seed", mono: "CC" },
  { name: "Northstar Subsea", sector: "Robotics & Automation", stage: "Pre-Seed", mono: "NS" },
];

const sectors = [
  "All",
  "Robotics & Automation",
  "Energy & Climate",
  "Advanced Materials",
  "Space & Aerospace",
  "Compute & Sensing",
  "Industrial Systems",
];

export default function PortfolioGrid() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? companies : companies.filter((c) => c.sector === active);

  return (
    <>
      {/* Sector chips */}
      <div className="flex flex-wrap gap-[10px] mt-10">
        {sectors.map((s) => {
          const isActive = active === s;
          return (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`px-[18px] py-[9px] rounded-full text-[13px] font-semibold tracking-[0.01em] cursor-pointer transition-colors border ${
                isActive
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-white text-navy-700 border-navy-200 hover:border-navy-400"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Company grid */}
      <div className="grid grid-cols-3 gap-5 mt-8">
        {filtered.map((c) => (
          <div
            key={c.name}
            className="bg-white border border-navy-100 rounded-lg p-[30px] shadow-sm flex flex-col min-h-[200px] hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="w-[52px] h-[52px] rounded-[10px] bg-navy-900 text-white flex items-center justify-center font-display font-extrabold text-[19px]">
                {c.mono}
              </div>
              <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-gold-700 bg-gold-50 border border-gold-200 px-[10px] py-[5px] rounded-full">
                {c.stage}
              </span>
            </div>
            <h3 className="font-display font-bold text-[22px] text-navy-900 mt-6 mb-[6px]">
              {c.name}
            </h3>
            <div className="text-[14px] text-navy-500 mt-auto">{c.sector}</div>
          </div>
        ))}
      </div>
    </>
  );
}
