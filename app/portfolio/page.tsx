import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import FadeIn from "@/components/FadeIn";

const APPLY_EMAIL = "investments@headwatersfund.com";

const submitItems = [
  {
    k: "01",
    title: "The Application",
    body: "Answer the five questions below. Brief, direct answers are preferred — there are no word limits, but concise is better.",
  },
  {
    k: "02",
    title: "Pitch Deck",
    body: "A 10–15 slide PDF covering the problem, your solution, the team, the technology, the market, and your ask.",
  },
  {
    k: "03",
    title: "Founder Video",
    tag: "Encouraged",
    body: "3–5 minutes, max. Tell us why you're solving this now and demo your prototype if you have one. A phone recording is perfectly fine.",
  },
];

const questions = [
  {
    k: "1",
    title: "What problem are you solving, and why is it hard?",
    body: "We invest where the problem demands real technical or scientific innovation — not incremental improvement. Tell us what the problem is, who has it, and what technical or scientific barriers have prevented others from solving it.",
    principle: "Principle 1 · The problem must be hard and valuable",
  },
  {
    k: "2",
    title: "Why is this problem valuable, and to whom?",
    body: "A hard problem only qualifies if solving it creates meaningful value. What is the market opportunity? Who are the customers, and what evidence — conversations, letters of intent, pilot commitments, market data — shows they will pay to close this gap?",
    principle: "Principle 1 · The problem must be hard and valuable",
  },
  {
    k: "3",
    title: "Who is on your team, and what have you built before?",
    body: "At pre-revenue seed stage, the team is the primary asset. For each founder, share your technical background and domain experience — then tell us the most impressive thing you've personally built or achieved.",
    principle: "Principle 2 · Founders first — technical depth required",
  },
  {
    k: "4",
    title: "Where is the technology today, and what are your next three milestones?",
    body: "We don't require proof that the technology works — but we do require a credible technical pathway. Share your current stage, what you've demonstrated, and your next three milestones. For each, be specific: what must be true, and how will you know?",
    principle: "Principle 3 · Flexible on stage, rigorous on feasibility",
  },
  {
    k: "5",
    title: "How will you use this investment, and what will it unlock?",
    body: "Our initial investment is at least $100,000, with follow-on reserves of up to $250,000. Tell us how the capital will be deployed, what milestones it funds, and what those milestones unlock — a next round, a technical proof point, or a customer pilot. Mention any non-dilutive sources (grants, SBIR, partnerships) too.",
    principle: "Principle 4 · Capital preservation through discipline",
  },
];

const companyFields = [
  "Company Name",
  "Website (if any)",
  "Founded",
  "Legal Structure",
  "Location",
  "Founder(s)",
  "Contact Email",
  "Contact Phone",
  "Capital Raised to Date",
  "Current Round / Ask",
];

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="bg-white pt-24 pb-[72px]">
        <div className="max-w-[880px] mx-auto px-8 text-center">
          <Eyebrow label="Application" centered />
          <h1
            className="font-display font-extrabold text-navy-900 leading-[1.1] tracking-[-0.025em] mt-6 mx-auto max-w-[760px]"
            style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.6rem)" }}
          >
            Apply for investment consideration
          </h1>
          <p className="max-w-[640px] mx-auto mt-[26px] text-[19px] leading-[1.62] text-navy-700">
            We make initial investments of {" "}
            <span className="text-navy-900 font-semibold">$100,000</span> in
            pre-revenue companies solving intricate, valuable problems.{" "}
            <span className="font-bold text-navy-900">
              Read below for instructions on what to submit.
            </span>
          </p>
          <div className="mt-[34px] flex justify-center gap-4 flex-wrap">
            <Button variant="primary" size="lg" href={`mailto:${APPLY_EMAIL}`}>
              Email Your Application →
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/headwaters-seed-application.docx"
              download
            >
              Download Template
            </Button>
          </div>
        </div>
      </section>

      {/* ── What to Submit ── */}
      <section className="bg-white py-24">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center max-w-[640px] mx-auto">
            <Eyebrow label="What to Submit" centered />
            <h2
              className="font-display font-extrabold text-navy-900 leading-[1.12] tracking-[-0.02em] mt-[18px]"
              style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)" }}
            >
              Three things, in one email
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-5 mt-12">
            {submitItems.map((s, i) => (
              <FadeIn key={s.k} delay={i * 80}>
                <div className="border border-navy-100 rounded-xl p-9 bg-white hover:shadow-lg hover:-translate-y-[2px] transition-[box-shadow,transform] duration-300 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[15px] font-semibold text-gold-600 tracking-[0.05em]">
                      {s.k}
                    </div>
                    {s.tag && (
                      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-gold-700 bg-gold-50 border border-gold-200 px-[10px] py-[5px] rounded-full">
                        {s.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-[22px] text-navy-900 mt-5 mb-3 leading-[1.2]">
                    {s.title}
                  </h3>
                  <p className="text-[16px] leading-[1.6] text-navy-600 m-0 flex-1">
                    {s.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Five Questions ── */}
      <section className="bg-navy-50 border-t border-navy-100 py-24">
        <div className="max-w-[1100px] mx-auto px-8">
          <Eyebrow label="The Five Questions" />
          <h2
            className="font-display font-extrabold text-navy-900 leading-[1.12] tracking-[-0.02em] mt-[18px] mb-3 max-w-[680px]"
            style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)" }}
          >
            The questions that guide our decision
          </h2>
          <p className="text-[16px] leading-[1.6] text-navy-600 max-w-[600px] mb-11">
            Each maps to a principle our Investment Committee uses to evaluate
            every company. Your answers are shared with them exactly as you write
            them.
          </p>
          <div className="flex flex-col">
            {questions.map((q, i) => (
              <FadeIn key={q.k} delay={i * 60}>
                <div
                  className="grid gap-7 items-start py-9 border-t border-navy-200"
                  style={{ gridTemplateColumns: "72px 1fr" }}
                >
                  <div className="font-display font-extrabold text-[48px] text-gold-600 leading-none">
                    {q.k}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[23px] text-navy-900 m-0 mb-3 leading-[1.22] max-w-[760px]">
                      {q.title}
                    </h3>
                    <p className="text-[16px] leading-[1.65] text-navy-700 m-0 max-w-[760px]">
                      {q.body}
                    </p>
                    <div className="mt-4 text-[11px] font-bold tracking-[0.1em] uppercase text-gold-700">
                      {q.principle}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Information + Video ── */}
      <section className="bg-white py-24">
        <div className="max-w-[1100px] mx-auto px-8 grid grid-cols-[1fr_1fr] gap-[72px] items-start">
          {/* Company info checklist */}
          <FadeIn>
            <div>
              <Eyebrow label="Company Information" />
              <h2 className="font-display font-extrabold text-navy-900 leading-[1.14] tracking-[-0.02em] mt-[18px] mb-7 text-[28px]">
                What to include at the top
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-[14px]">
                {companyFields.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <span className="w-[6px] h-[6px] rounded-full bg-gold-600 shrink-0" />
                    <span className="text-[15px] text-navy-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* About the video */}
          <FadeIn delay={120}>
            <div className="bg-navy-50 border border-navy-100 rounded-xl p-10">
              <Eyebrow label="About the Video" />
              <h2 className="font-display font-extrabold text-navy-900 leading-[1.14] tracking-[-0.02em] mt-[18px] mb-6 text-[28px]">
                If you record one, cover two things
              </h2>
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-display font-bold text-[18px] text-navy-900 mb-[6px]">
                    Why now?
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-navy-600 m-0">
                    What's happening in your field or the technology that makes
                    this the right time — and why you're the right person to build
                    it.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-bold text-[18px] text-navy-900 mb-[6px]">
                    Demo, if applicable
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-navy-600 m-0">
                    Walk us through a prototype, simulation, or test results.
                    We're engineers and investors — we appreciate seeing the work,
                    even if it's early.
                  </p>
                </div>
              </div>
              <p className="text-[14px] leading-[1.6] text-navy-500 mt-7 mb-0">
                Not a pitch competition. Upload to Drive, Dropbox, YouTube
                (unlisted), or Loom, and include the link.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Submission CTA ── */}
      <FadeIn yOffset={16}>
        <section className="bg-navy-900">
          <div className="max-w-[1000px] mx-auto px-8 py-[100px] text-center">
            <Eyebrow label="Submission" centered dark />
            <h2
              className="font-display font-extrabold text-white leading-[1.1] tracking-[-0.02em] mt-6"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              Send it all to one inbox
            </h2>
            <p className="max-w-[600px] mx-auto mt-[22px] text-[18px] leading-[1.6] text-navy-200">
              Email your completed application, pitch deck (PDF), and video link.
              We review every application and respond within two weeks — our goal
              is first meeting to decision in four to six.
            </p>
            <div className="mt-8 flex flex-col items-center gap-5">
              <Button variant="accent" size="lg" href={`mailto:${APPLY_EMAIL}`}>
                Email Your Application →
              </Button>
              <a
                href={`mailto:${APPLY_EMAIL}`}
                className="text-[15px] text-gold-300 hover:text-gold-200 transition-colors"
              >
                {APPLY_EMAIL}
              </a>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Legal note ── */}
      <section className="bg-navy-950 py-8">
        <div className="max-w-[1000px] mx-auto px-8 text-center">
          <p className="text-[13px] leading-[1.6] text-navy-400 m-0">
            Headwaters Seed Stage Fund I is managed by Frontier Capital Management
            LLC, affiliated with Frontier Angels, Bozeman, Montana. This is not an
            offer of securities.
          </p>
        </div>
      </section>
    </div>
  );
}
