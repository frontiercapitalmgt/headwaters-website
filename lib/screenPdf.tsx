import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Screen } from "@/lib/screen";

// House palette (matches the Company Overview builder)
const NAVY = "#14223B";
const GOLD = "#A67C25";
const BODY = "#222222";
const GRAY = "#6B7280";
const ALT = "#F1F3F5";
const GREEN = "#1B7A43";
const AMBER = "#B45309";
const LINE = "#D9DEE5";

const PASS_SCORES = new Set(["STRONG", "PASS", "MET", "YES"]);

// Hard caps so the memo always fits two pages, whatever the model returns.
const MAX_CONCERNS = 8;
const MAX_UNKNOWNS = 8;

// Every text style carries its own fontSize: @react-pdf cannot resolve a
// unitless lineHeight against an inherited size, and silently falls back to a
// much looser default if you leave it off.
const s = StyleSheet.create({
  page: { paddingTop: 26, paddingBottom: 34, paddingHorizontal: 34, fontSize: 9, color: BODY, fontFamily: "Helvetica" },
  banner: { backgroundColor: NAVY, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6, paddingHorizontal: 11 },
  brand: { color: "#FFFFFF", fontSize: 13, fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  bannerRight: { color: "#C7CEDA", fontSize: 7, fontFamily: "Helvetica-Bold" },
  company: { fontSize: 16, fontFamily: "Helvetica-Bold", color: NAVY, marginTop: 10 },
  hook: { fontSize: 9, lineHeight: 1.3, color: GRAY, fontFamily: "Helvetica-Oblique", marginTop: 3 },
  disclaimer: { marginTop: 8, borderWidth: 0.8, borderColor: GOLD, backgroundColor: "#FDF8F0", paddingVertical: 4, paddingHorizontal: 6, fontSize: 7, lineHeight: 1.3, color: "#7A4E18" },
  snapshot: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  snapCell: { width: "50%", flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: LINE, paddingVertical: 2.5 },
  snapLabel: { width: "40%", fontSize: 7.5, lineHeight: 1.25, fontFamily: "Helvetica-Bold", color: NAVY },
  snapValue: { width: "60%", fontSize: 7.5, lineHeight: 1.25, color: BODY },
  h2wrap: { marginTop: 11, borderBottomWidth: 0.8, borderBottomColor: GOLD, paddingBottom: 2, flexDirection: "row" },
  h2num: { fontSize: 9.5, lineHeight: 1.2, fontFamily: "Helvetica-Bold", color: GOLD, marginRight: 6 },
  h2: { fontSize: 9.5, lineHeight: 1.2, fontFamily: "Helvetica-Bold", color: NAVY, letterSpacing: 0.4 },
  para: { marginTop: 4, fontSize: 9, lineHeight: 1.35, textAlign: "justify" },
  tHead: { flexDirection: "row", backgroundColor: NAVY, marginTop: 5 },
  th: { color: "#FFFFFF", fontSize: 7.5, lineHeight: 1.2, fontFamily: "Helvetica-Bold", paddingVertical: 3.5, paddingHorizontal: 4 },
  tRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: LINE },
  td: { paddingVertical: 3.5, paddingHorizontal: 4 },
  tdText: { fontSize: 8, lineHeight: 1.3 },
  cPillar: { width: "20%" },
  cScore: { width: "15%" },
  cWhy: { width: "65%" },
  pill: { fontSize: 6.8, lineHeight: 1.2, fontFamily: "Helvetica-Bold", paddingVertical: 2, paddingHorizontal: 5, borderRadius: 2, color: "#FFFFFF", alignSelf: "flex-start" },
  bullet: { flexDirection: "row", marginTop: 2.5 },
  dot: { color: GOLD, fontFamily: "Helvetica-Bold", marginRight: 5, fontSize: 8.5, lineHeight: 1.32 },
  bulletText: { flex: 1, fontSize: 8.5, lineHeight: 1.32 },
  footer: { position: "absolute", bottom: 16, left: 34, right: 34, borderTopWidth: 0.5, borderTopColor: LINE, paddingTop: 4, fontSize: 6.5, color: GRAY, flexDirection: "row", justifyContent: "space-between" },
});

function Heading({ n, children }: { n: number; children: string }) {
  return (
    <View style={s.h2wrap} minPresenceAhead={44}>
      <Text style={s.h2num}>{String(n).padStart(2, "0")}</Text>
      <Text style={s.h2}>{children.toUpperCase()}</Text>
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((b, i) => (
        <View style={s.bullet} key={i} wrap={false}>
          <Text style={s.dot}>-</Text>
          <Text style={s.bulletText}>{b}</Text>
        </View>
      ))}
    </>
  );
}

export interface ScreenPdfMeta {
  company: string;
  founder?: string;
  website?: string;
  founded?: string;
  legalStructure?: string;
  location?: string;
  capitalRaised?: string;
  currentAsk?: string;
}

function ScreenDoc({ screen, meta }: { screen: Screen; meta: ScreenPdfMeta }) {
  const snap: [string, string][] = [
    ["Founder", meta.founder || "—"],
    ["Founded", meta.founded || "—"],
    ["Location", meta.location || "—"],
    ["Legal structure", meta.legalStructure || "—"],
    ["Capital raised", meta.capitalRaised || "—"],
    ["Current round / ask", meta.currentAsk || "—"],
    ["Website", meta.website || "—"],
    ["Screened", new Date().toISOString().slice(0, 10)],
  ];
  let n = 0;
  return (
    <Document title={`${meta.company} — Automated Screen`}>
      <Page size="LETTER" style={s.page}>
        <View style={s.banner} fixed>
          <Text style={s.brand}>HEADWATERS</Text>
          <Text style={s.bannerRight}>AUTOMATED SCREEN  ·  CONFIDENTIAL</Text>
        </View>

        <Text style={s.company}>{meta.company.toUpperCase()}</Text>
        <Text style={s.hook}>{screen.hook}</Text>

        <Text style={s.disclaimer}>
          AI-GENERATED FIRST-PASS SCREEN — NOT A RECOMMENDATION. Produced automatically
          from the submitted deck, application, and public website; not verified against
          primary sources. Claims are the company&apos;s unless stated otherwise.
        </Text>

        <View style={s.snapshot}>
          {snap.map(([k, v]) => (
            <View style={s.snapCell} key={k}>
              <Text style={s.snapLabel}>{k}</Text>
              <Text style={s.snapValue}>{v}</Text>
            </View>
          ))}
        </View>

        <Heading n={++n}>Company Overview</Heading>
        <Text style={s.para}>{screen.overview}</Text>

        <Heading n={++n}>The Problem</Heading>
        <Text style={s.para}>{screen.problem}</Text>

        <Heading n={++n}>Product &amp; Technology</Heading>
        <Text style={s.para}>{screen.technology}</Text>

        <Heading n={++n}>Markets &amp; Evidence</Heading>
        <Text style={s.para}>{screen.market}</Text>

        {/* heading + all four rows travel together */}
        <View wrap={false}>
          <Heading n={++n}>Thesis Alignment — Four Pillars</Heading>
          <View style={s.tHead}>
            <Text style={[s.th, s.cPillar]}>Pillar</Text>
            <Text style={[s.th, s.cScore]}>Assessment</Text>
            <Text style={[s.th, s.cWhy]}>Rationale</Text>
          </View>
          {screen.pillars.map((p, i) => {
            const pass = PASS_SCORES.has(p.score.toUpperCase());
            return (
              <View style={[s.tRow, { backgroundColor: i % 2 ? ALT : "#FFFFFF" }]} key={p.pillar} wrap={false}>
                <View style={[s.td, s.cPillar]}>
                  <Text style={[s.tdText, { fontFamily: "Helvetica-Bold", color: NAVY }]}>{p.pillar}</Text>
                </View>
                <View style={[s.td, s.cScore]}>
                  <Text style={[s.pill, { backgroundColor: pass ? GREEN : AMBER }]}>{p.score}</Text>
                </View>
                <View style={[s.td, s.cWhy]}>
                  <Text style={s.tdText}>{p.rationale}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Heading n={++n}>Main Concerns</Heading>
        <Bullets items={screen.concerns.slice(0, MAX_CONCERNS)} />

        <Heading n={++n}>Open Questions for Diligence</Heading>
        <Bullets items={screen.unknowns.slice(0, MAX_UNKNOWNS)} />

        <View style={s.footer} fixed>
          <Text>Headwaters Seed Stage Fund I · Confidential · Automated draft</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

export async function renderScreenPdf(
  screen: Screen,
  meta: ScreenPdfMeta
): Promise<Buffer> {
  return renderToBuffer(<ScreenDoc screen={screen} meta={meta} />);
}
