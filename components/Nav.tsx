"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Founders", href: "/founders" },
  { label: "Apply", href: "/portfolio" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[200] bg-white/90 backdrop-blur-[10px] border-b border-navy-100">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-[72px] sm:h-[86px] flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/headwaters-logo-seed.png"
            alt="Headwaters Seed Stage Fund I"
            height={58}
            width={192}
            className="h-[44px] sm:h-[58px] w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-[42px]">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative pb-0 text-[16px] font-semibold tracking-[0.01em] text-navy-800 hover:text-navy-900 transition-colors"
              >
                {link.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-[33px] h-[2px] bg-gold-600" />
                )}
              </Link>
            );
          })}
          <Link
            href="/founders"
            className="inline-flex items-center justify-center h-11 px-6 text-[14px] font-bold tracking-[0.03em] uppercase text-white bg-navy-900 rounded hover:bg-navy-800 transition-colors"
          >
            Get in Touch
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden -mr-2 p-2 text-navy-900"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-navy-100 bg-white">
          <nav className="flex flex-col max-w-[1200px] mx-auto px-5 py-3">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 text-[17px] font-semibold border-b border-navy-50 ${
                    active ? "text-gold-700" : "text-navy-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/founders"
              className="mt-4 inline-flex items-center justify-center h-12 px-6 text-[14px] font-bold tracking-[0.03em] uppercase text-white bg-navy-900 rounded"
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
