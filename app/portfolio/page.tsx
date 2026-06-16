import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import PortfolioGrid from "@/components/PortfolioGrid";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <section className="bg-white pt-24 pb-14">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="max-w-[760px] flex flex-col items-start">
            <Eyebrow label="Portfolio" />
            <h1
              className="font-display font-extrabold text-navy-900 leading-[1.1] tracking-[-0.025em] mt-[22px] max-w-[640px]"
              style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.6rem)" }}
            >
              Companies at the source
            </h1>
            <p className="max-w-[580px] mt-6 text-[19px] leading-[1.62] text-navy-700">
              We were the first institutional check into every company here —
              most before they had revenue, some before they had a working
              prototype.
            </p>
          </div>
          <PortfolioGrid />
        </div>
      </section>

      {/* ── Dark CTA ── */}
      <section className="bg-navy-900 pb-[100px]">
        <div className="max-w-[1000px] mx-auto px-8 py-[84px] text-center">
          <h2
            className="font-display font-extrabold text-white leading-[1.12] tracking-[-0.02em] m-0"
            style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)" }}
          >
            Your company could be next
          </h2>
          <p className="max-w-[520px] mx-auto mt-[18px] text-[17px] leading-[1.6] text-navy-200">
            If you're building hard technology at the earliest stage, we want to
            hear from you.
          </p>
          <div className="mt-[30px] flex justify-center">
            <Button variant="accent" size="lg" href="/founders">
              Pitch Headwaters →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
