"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Founders", href: "/founders" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Insights", href: "/insights" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[200] bg-white/90 backdrop-blur-[10px] border-b border-navy-100">
      <div className="max-w-[1200px] mx-auto px-8 h-[86px] flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/headwaters-wave.png"
            alt="Headwaters"
            height={54}
            width={220}
            style={{ height: "54px", width: "auto" }}
            priority
          />
        </Link>

        <nav className="flex items-center gap-[42px]">
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
      </div>
    </header>
  );
}
