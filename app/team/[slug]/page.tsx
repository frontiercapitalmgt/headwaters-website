import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { team, getMember, initials } from "@/lib/team";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getMember(slug);
  if (!m) return { title: "Team — Headwaters" };
  return { title: `${m.name} — Headwaters`, description: m.excerpt };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getMember(slug);
  if (!member) notFound();

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-16 pb-28">
        <div className="max-w-[1120px] mx-auto px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.06em] uppercase text-gold-700 hover:text-gold-600 transition-colors"
          >
            ← Back to About
          </Link>

          <div className="grid grid-cols-[minmax(300px,400px)_1fr] gap-16 items-start mt-9">
            {/* Left: portrait + name + role */}
            <div>
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-navy-100 to-navy-200 flex items-center justify-center shadow-sm">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display font-bold text-[64px] text-navy-500">
                    {initials(member.name)}
                  </span>
                )}
              </div>
              <h1
                className="font-display font-extrabold text-navy-900 leading-[1.05] tracking-[-0.02em] mt-7"
                style={{ fontSize: "clamp(2.2rem, 3.6vw, 3rem)" }}
              >
                {member.name}
              </h1>
              <p className="text-[16px] text-navy-500 mt-2">{member.role}</p>
              {member.role2 && (
                <p className="text-[16px] text-navy-500 mt-1">{member.role2}</p>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 text-[14px] font-semibold text-gold-700 hover:text-gold-600 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 17V9.99H6V17h2.34zM7.17 8.96a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72zM18 17v-3.84c0-2.05-1.1-3.01-2.56-3.01-1.18 0-1.71.65-2 1.11V9.99h-2.34V17h2.34v-3.9c0-.21.02-.41.08-.56.16-.41.54-.84 1.17-.84.82 0 1.16.63 1.16 1.55V17H18z" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>

            {/* Right: full bio */}
            <div className="pt-1">
              {member.bio.map((para, i) => (
                <p
                  key={i}
                  className="text-[17px] leading-[1.75] text-navy-700 mb-5 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
