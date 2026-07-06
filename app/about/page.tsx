import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import AboutHeroIcons from "@/components/AboutHeroIcons";
import TypewriterText from "@/components/TypewriterText";
import HeroScrollFade from "@/components/HeroScrollFade";
import Reveal from "@/components/Reveal";
import BeliefCards from "@/components/BeliefCards";
import MissionVideo from "@/components/MissionVideo";

const beliefs = [
  {
    k: "01",
    title: "Founders first",
    body: "The earlier and less proven the technology, the more exceptional the founding team has to be. Technical depth, domain experience, and the ability to recruit — we back people before proof.",
  },
  {
    k: "02",
    title: "No sector dogma",
    body: "Hardware is our primary lens, but the defining filter is the problem itself. Any genuinely hard, genuinely valuable challenge — chemistry, space, biotech, industrial systems — falls within our mandate.",
  },
  {
    k: "03",
    title: "Decisive and founder-friendly",
    body: "Hardtech founders are consistently underserved by traditional capital. We move fast: no warm intro required, clean terms, and a clear answer within two weeks of first contact.",
  },
  {
    k: "04",
    title: "Patient capital, defined milestones",
    body: "Our perpetual structure means no fund clock forcing premature exits. Hardtech companies need 7–12 years. We're designed for that — with clear technical checkpoints expected at every stage.",
  },
  {
    k: "05",
    title: "Engaged partners, not passive capital",
    body: "Our investors are hardware founders and operators who have built companies and shipped products. That experience is available to portfolio companies at the governance level and beyond.",
  },
  {
    k: "06",
    title: "Intellectual honesty",
    body: "We invest at the frontier of science and engineering. When the IC cannot develop sufficient confidence in the underlying science, we decline — or wait for milestone evidence that de-risks the thesis.",
  },
];

const team = [
  {
    name: "Sarah Whitfield",
    role: "Founder & Managing Partner",
    bio: "Former hardware operator with two exits in industrial robotics.",
  },
  {
    name: "James Calloway",
    role: "General Partner",
    bio: "Twenty-five years backing deep-tech founders across the Rockies.",
  },
  {
    name: "Maya Okafor",
    role: "Partner, Technical",
    bio: "PhD in materials science. A decade in the lab before the cap table.",
  },
  {
    name: "Daniel Reyes",
    role: "Partner, Platform",
    bio: "Builds the operator network founders lean on after the check clears.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden bg-white"
        style={{ minHeight: "86vh" }}
      >
        <AboutHeroIcons />
        <HeroScrollFade className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 max-w-[880px] px-8 text-center">
            <Eyebrow label="About Headwaters" centered />
            <h1
              className="font-display font-extrabold text-navy-900 leading-[1.1] tracking-[-0.025em] mt-6 mx-auto max-w-[760px] min-h-[1.1em]"
              style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.6rem)" }}
            >
              <TypewriterText
                segments={[
                  { text: "Capital designed to " },
                  { text: "solve the hard problems", className: "text-gold-600" },
                ]}
              />
            </h1>
            <p className="max-w-[620px] mx-auto mt-[26px] text-[19px] leading-[1.62] text-navy-700">
              A headwater is where a river starts — a trickle in the high
              country, long before it becomes anything. Every great hardware
              company begins the same way. We exist to fund that beginning.
            </p>
          </div>
        </HeroScrollFade>
      </section>

      {/* ── Mission ── */}
      <section className="bg-white border-b border-navy-100 py-[90px]">
        <div className="max-w-[1200px] mx-auto px-8">
          <Reveal>
            <Eyebrow label="Our Mission" />
          </Reveal>
          <div className="grid grid-cols-[1.1fr_1fr] gap-[72px] items-start mt-[26px]">
            <Reveal delay={80}>
              <h2
                className="font-display font-extrabold text-navy-900 leading-[1.14] tracking-[-0.02em] m-0"
                style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.7rem)" }}
              >
                <TypewriterText
                  segments={[
                    { text: "We back the builders the rest of venture overlooks." },
                  ]}
                  caret={false}
                  startOnView
                  startDelay={150}
                />
              </h2>
              <MissionVideo
                src="/crane-gold.mp4"
                poster="/crane-gold-poster.jpg"
                className="block h-auto mt-8 w-[118%] ml-[48px]"
              />
            </Reveal>
            <Reveal delay={180}>
              <p className="text-[17px] leading-[1.7] text-navy-700 mb-[18px]">
                The Fund exists to provide early-stage capital to founders
                solving hard, physical-world problems — companies that require
                genuine technical or scientific breakthroughs and that are
                consistently underserved by traditional venture capital. Our
                primary focus is hardware-enabled innovation, but the defining
                filter is the problem itself.
              </p>
              <p className="text-[17px] leading-[1.7] text-navy-700 mb-[18px]">
                We make initial investments from concept stage through early
                prototype — then roll up our sleeves. We're operators who have
                built physical products before. We know the road because we've
                walked it.
              </p>
              <p className="text-[17px] leading-[1.7] text-navy-700">
                Headwaters is structured as a perpetual vehicle because hardtech
                development timelines do not conform to traditional fund
                lifecycles. No fund clock. No forced exits. Returns recycled into
                the next cohort of portfolio companies. We are affiliated with
                Frontier Angels and anchored in Montana and the Rockies West,
                with national scope.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── What We Believe ── */}
      <section className="bg-white py-[90px]">
        <div className="max-w-[1200px] mx-auto px-8">
          <Eyebrow label="What We Believe" />
          <div className="mt-8">
            <BeliefCards items={beliefs} />
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-navy-50 border-t border-navy-100 pt-24 pb-24">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center max-w-[680px] mx-auto">
            <h2
              className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] m-0"
              style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)" }}
            >
              <span className="text-gold-600">The team</span>{" "}
              <span className="text-navy-900">behind the work</span>
            </h2>
            <p className="text-[18px] leading-[1.62] text-navy-700 mt-[22px]">
              Headwaters was founded by operators and investors who have spent
              their careers building and backing hard technology across the
              Northern Rockies and beyond.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-5 mt-[52px]">
            {team.map((m) => (
              <div
                key={m.name}
                className="bg-white border border-navy-100 rounded-lg overflow-hidden shadow-sm"
              >
                <div
                  className="w-full bg-navy-100 flex items-end justify-center"
                  style={{ height: "280px" }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-navy-50 to-navy-100 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-navy-200 flex items-center justify-center">
                      <span className="font-display font-bold text-[22px] text-navy-700">
                        {m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-[22px]">
                  <div className="font-display font-bold text-[19px] text-navy-900">
                    {m.name}
                  </div>
                  <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-gold-700 mt-[6px]">
                    {m.role}
                  </div>
                  <p className="text-[14px] leading-[1.55] text-navy-600 mt-[14px] mb-0">
                    {m.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Investor CTA ── */}
      <section className="bg-navy-900">
        <div className="max-w-[1000px] mx-auto px-8 py-20 text-center">
          <h2
            className="font-display font-extrabold text-white leading-[1.12] tracking-[-0.02em] m-0"
            style={{ fontSize: "clamp(1.7rem, 3vw, 2.5rem)" }}
          >
            Investor inquiries welcome
          </h2>
          <p className="max-w-[520px] mx-auto mt-[18px] text-[17px] leading-[1.6] text-navy-200">
            Headwaters Seed Stage Fund I is an evergreen vehicle targeting $5M
            across 20 pre-revenue hardtech investments. Accredited investors
            seeking frontier hardware exposure — let's talk.
          </p>
          <div className="mt-[30px] flex justify-center">
            <Button variant="accent" size="lg" href="/founders">
              Get in Touch →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
