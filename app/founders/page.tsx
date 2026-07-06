import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import CriteriaList from "@/components/CriteriaList";
import HeroGears from "@/components/HeroGears";
import HeroScrollFade from "@/components/HeroScrollFade";
import StatCards from "@/components/StatCards";
import RiverDivider from "@/components/RiverDivider";
import FadeIn from "@/components/FadeIn";

const steps = [
  { k: "01", title: "Reach out", body: "View our application page to submit an application form and deck. We read everything that comes in." },
  { k: "02", title: "First conversation", body: "A 30-minute call, founder to operator. No formal pitch, just an honest talk about what you're building." },
  { k: "03", title: "Technical deep-dive", body: "We dig into the hard parts with you. When needed, we bring in domain specialists and technical advisors to pressure-test the thesis alongside us." },
  { k: "04", title: "A clear answer in two weeks", body: "A definitive yes or no — fast. If it's a yes, the investment moves quickly and the work begins." },
];

export default function FoundersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white min-h-[78vh]">
        <HeroGears />
        <HeroScrollFade className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 max-w-[940px] px-8 text-center">
            <FadeIn yOffset={22}>
              <h1
                className="font-display font-extrabold text-navy-900 leading-[1.08] tracking-[-0.025em] mx-auto max-w-[900px]"
                style={{ fontSize: "clamp(2.6rem, 5.4vw, 4.4rem)" }}
              >
                What we back, and{" "}
                <span className="text-gold-600">
                  how to know if we&apos;re a fit
                </span>
              </h1>
            </FadeIn>
            <FadeIn yOffset={22} delay={180}>
              <div className="mt-[34px] flex justify-center">
                <Button variant="primary" size="lg" href="/portfolio">
                  How to Apply →
                </Button>
              </div>
            </FadeIn>
          </div>
        </HeroScrollFade>
      </section>

      {/* ── River reach: stats + criteria share one canvas. Sections are
          transparent (the page root is white) so the river can sit ABOVE the
          background but BEHIND the section content (z-10) ── */}
      <div className="relative isolate">
        <RiverDivider />

        {/* ── Stats Bar ── */}
        <section className="relative z-10 pt-[16vh] pb-[33vh]">
          <div className="max-w-[1200px] mx-auto px-8">
            <StatCards />
          </div>
        </section>

        {/* ── What We Look For ── */}
        <section className="relative z-10 pt-[8vh] pb-28">
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="text-center max-w-[640px] mx-auto">
              <FadeIn yOffset={20}>
                <Eyebrow label="What We Look For" centered />
              </FadeIn>
              <FadeIn yOffset={24} delay={120}>
                <h2
                  className="font-display font-extrabold text-navy-900 leading-[1.12] tracking-[-0.02em] mt-[18px]"
                  style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)" }}
                >
                  The criteria — and what tips the balance
                </h2>
              </FadeIn>
            </div>
            <CriteriaList />
          </div>
        </section>
      </div>

      {/* ── How It Works ── */}
      <section className="bg-navy-50 border-t border-navy-100 py-24">
        <div className="max-w-[1100px] mx-auto px-8">
          <Eyebrow label="How It Works" />
          <h2
            className="font-display font-extrabold text-navy-900 leading-[1.12] tracking-[-0.02em] mt-[18px] mb-11"
            style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)" }}
          >
            From first note to first check ASAP
          </h2>
          <div className="flex flex-col">
            {steps.map((s) => (
              <div
                key={s.k}
                className="grid gap-7 items-start py-7 border-t border-navy-100"
                style={{ gridTemplateColumns: "88px 1fr" }}
              >
                <div className="font-display font-extrabold text-[40px] text-gold-600 leading-none">
                  {s.k}
                </div>
                <div>
                  <h3 className="font-display font-bold text-[22px] text-navy-900 m-0 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[16px] leading-[1.62] text-navy-700 m-0 max-w-[640px]">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA ── */}
      <section className="bg-navy-900">
        <div className="max-w-[1000px] mx-auto px-8 py-[104px] text-center">
          <Eyebrow label="Get in Touch" centered dark />
          <h2
            className="font-display font-extrabold text-white leading-[1.08] tracking-[-0.02em] mt-6"
            style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)" }}
          >
            Building something hard? We'd like to meet you.
          </h2>
          <p className="max-w-[560px] mx-auto mt-[22px] text-[18px] leading-[1.6] text-navy-200">
            No formal pitch required. Submit your application in a few minutes —
            we read every one.
          </p>
          <div className="mt-9 flex justify-center">
            <Button variant="accent" size="lg" href="/portfolio">
              How to Apply →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
