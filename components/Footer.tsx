import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="max-w-[1200px] mx-auto px-8 pt-[72px] pb-9">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
          <div>
            <Image
              src="/headwaters-wordmark-white.png"
              alt="Headwaters"
              height={28}
              width={160}
              style={{ height: "28px", width: "auto" }}
            />
            <p className="max-w-[300px] mt-5 text-sm leading-relaxed text-navy-300">
              Early-stage venture capital for hardware founders solving hard
              problems. Bozeman, Montana — investing everywhere the frontier is.
            </p>
            <div className="mt-5 pt-4 border-t border-white/10">
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-navy-500">
                Affiliated with
              </span>
              <div className="mt-[6px] text-[13px] text-navy-300 font-medium">
                Frontier Angels
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-gold-500 mb-4">
              Fund
            </div>
            <div className="flex flex-col gap-[11px]">
              {[
                { label: "About", href: "/about" },
                { label: "Apply", href: "/portfolio" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-navy-200 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-gold-500 mb-4">
              Founders
            </div>
            <div className="flex flex-col gap-[11px]">
              {[
                "See if we're a fit",
                "What we look for",
                "Apply",
              ].map((label) => (
                <Link
                  key={label}
                  href="/founders"
                  className="text-sm text-navy-200 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-gold-500 mb-4">
              Connect
            </div>
            <div className="flex flex-col gap-[11px]">
              <a
                href="mailto:hello@headwaters.com"
                className="text-sm text-navy-200 hover:text-white transition-colors"
              >
                hello@headwaters.com
              </a>
              <a
                href="#"
                className="text-sm text-navy-200 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-sm text-navy-200 hover:text-white transition-colors"
              >
                X / Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center gap-4 flex-wrap">
          <span className="text-[13px] text-navy-400">
            © {year} Headwaters Capital. All rights reserved.
          </span>
          <span className="text-[13px] text-navy-400">
            Investments involve risk, including loss of principal.
          </span>
        </div>
      </div>
    </footer>
  );
}
