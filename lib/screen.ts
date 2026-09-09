import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

/**
 * Automated first-pass screen for an incoming application.
 *
 * This is deliberately NOT the full researched Company Overview (that is the
 * human-run skill). It reads the deck + application + site and scores the four
 * core criteria so the IC has instant triage. Every output is labelled a draft.
 */

// Anthropic caps a request at 32MB; base64 inflates ~1.33x. Stay well under.
const MAX_PDF_BYTES = 18 * 1024 * 1024;
// Combined ceiling across every PDF attached to one request.
const MAX_TOTAL_PDF_BYTES = 20 * 1024 * 1024;

export const PILLARS = [
  "Pre-Revenue",
  "Hardware-Related",
  "Hard Problem",
  "Valuable Problem",
] as const;

export const ScreenSchema = z.object({
  hook: z.string().describe("One sentence: what the company does and why it matters."),
  overview: z.string().describe("Short paragraph on the company, stage, and origin."),
  problem: z.string().describe("The problem and specifically why it is technically hard."),
  technology: z.string().describe("How the product actually works — the mechanism."),
  market: z.string().describe("Market size and any evidence customers will pay."),
  pillars: z.array(
    z.object({
      pillar: z.enum(PILLARS),
      score: z.enum(["STRONG", "PASS", "WEAK", "CONCERN", "FAIL"]),
      rationale: z.string().describe("One sentence justifying the score."),
    })
  ).describe("Exactly four entries, one per core criterion, in order."),
  // No .max() here on purpose. A schema bound is a hard validation rule: one
  // extra item and the whole parsed response is rejected and the API call is
  // wasted. Length is steered by the prompt and enforced by slicing at render.
  concerns: z
    .array(z.string())
    .describe("The 4-6 most material thesis tensions and company-level risks, most material first. One sentence each."),
  unknowns: z
    .array(z.string())
    .describe("The 4-6 most material questions the materials do not answer, most material first. One sentence each."),
});

export type Screen = z.infer<typeof ScreenSchema>;

const SYSTEM = `You are screening an inbound application for Headwaters Seed Stage Fund I, a pre-revenue hardware-enabled deep-tech fund.

Score the company against the fund's FOUR CORE CRITERIA. Every deal must pass all four; be honest, because a failing score is more useful to the Investment Committee than a generous one.

1. PRE-REVENUE — Binary filter. The fund backs concept through early prototype, before meaningful recurring revenue. Grant income, SBIR/STTR awards and small pilot fees do NOT disqualify. Established commercial revenue does.

2. HARDWARE-RELATED — Hardware-enabled innovation is the primary lens: a physical device, system, or a physical-world technical challenge. Non-hardware deep tech is allowed only when the problem is genuinely hard scientifically and the team exceptional. Pure software with no physical-world problem is a weak fit.

3. HARD PROBLEM — Must require real technical or scientific innovation, not incremental improvement. Ask what barrier has stopped others. A known technology repackaged is not a hard problem — say so.

4. VALUABLE PROBLEM — Must address a large market, critical infrastructure need, or a gap customers will pay meaningfully to close. Look for concrete evidence: LOIs, pilots, pre-orders, named design partners. A hard problem with no market is an academic exercise.

Scoring: STRONG or PASS = genuine pass. WEAK, CONCERN or FAIL = miss or material doubt.

Rules:
- Ground every claim in the supplied materials. Do NOT invent funding, customers, traction, or credentials.
- If the materials do not establish something, list it under "unknowns" rather than guessing.
- Supporting dimensions (team, capital plan, defensibility, portfolio fit) belong in "concerns", not the pillar table.
- Be concise and information-dense. This is a screening memo, not marketing copy. Keep each of the five prose sections to 3-5 sentences. Give 4-6 concerns and 4-6 unknowns, one sentence each, ranked most material first — merge overlapping points rather than listing them separately.`;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Best-effort website text. Never throws — a dead site just means less context. */
export async function fetchSiteText(url?: string): Promise<string> {
  if (!url) return "";
  const target = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  try {
    const res = await fetch(target, {
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "HeadwatersBot/1.0" },
    });
    if (!res.ok) return "";
    return stripHtml(await res.text()).slice(0, 12000);
  } catch {
    return "";
  }
}

export interface ScreenInput {
  fields: Record<string, unknown>;
  deckPdf?: Buffer;
  deckFilename?: string;
  /** Set when the completed application is itself a PDF. */
  applicationPdf?: Buffer;
  /** Set when the application text could be extracted (.docx). */
  applicationText?: string;
  siteText?: string;
}

export async function generateScreen(input: ScreenInput): Promise<Screen> {
  // Org-level keys must name a workspace; workspace-scoped keys need no header.
  const workspaceId = process.env.ANTHROPIC_WORKSPACE_ID;
  const client = new Anthropic(
    workspaceId
      ? { defaultHeaders: { "anthropic-workspace-id": workspaceId } }
      : {}
  ); // reads ANTHROPIC_API_KEY from env
  const { fields } = input;

  const content: Anthropic.ContentBlockParam[] = [];

  // PDFs first, per API guidance. Anthropic caps the whole request at 32MB
  // once base64-inflated, so track what we have already attached.
  let budget = MAX_TOTAL_PDF_BYTES;
  const attach = (buf?: Buffer): boolean => {
    if (!buf || buf.length > MAX_PDF_BYTES || buf.length > budget) return false;
    budget -= buf.length;
    content.push({
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: buf.toString("base64"),
      },
    });
    return true;
  };

  const deckAttached = attach(input.deckPdf);
  const applicationAttached = attach(input.applicationPdf);

  const facts = [
    `Company: ${fields["Company Name"] ?? "—"}`,
    `Founder: ${fields["Founder Name"] ?? "—"}`,
    `Website: ${fields["Website"] ?? "—"}`,
    `Founded: ${fields["Founded"] ?? "—"}`,
    `Legal structure: ${fields["Legal Structure"] ?? "—"}`,
    `Location: ${fields["Location"] ?? "—"}`,
    `Capital raised to date: ${fields["Capital Raised to Date"] ?? "—"}`,
    `Current round / ask: ${fields["Current Round Ask"] ?? "—"}`,
  ].join("\n");

  const parts = [
    "Screen this application against the four core criteria.",
    "",
    "=== SUBMITTED DETAILS ===",
    facts,
  ];
  if (!deckAttached) {
    parts.push("", input.deckPdf
      ? "(Pitch deck was too large to attach; judge from the other materials.)"
      : "(No pitch deck was readable for this submission.)");
  }
  if (input.applicationPdf && !applicationAttached) {
    parts.push("", "(Completed application was too large to attach.)");
  }
  if (applicationAttached) {
    parts.push("", "(The completed application is attached as the second PDF above.)");
  } else if (input.applicationText?.trim()) {
    parts.push("", "=== COMPLETED APPLICATION ===", input.applicationText.slice(0, 60000));
  }
  if (input.siteText?.trim()) {
    parts.push("", "=== COMPANY WEBSITE (extracted text) ===", input.siteText);
  }
  content.push({ type: "text", text: parts.join("\n") });

  const response = await client.messages.parse({
    model: "claude-opus-5",
    max_tokens: 16000,
    system: SYSTEM,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: zodOutputFormat(ScreenSchema),
    },
    messages: [{ role: "user", content }],
  });

  const u = response.usage;
  console.log(
    "[screen] usage in=" + u.input_tokens + " out=" + u.output_tokens +
    " est=$" + ((u.input_tokens * 5 + u.output_tokens * 25) / 1e6).toFixed(3)
  );

  if (response.stop_reason === "refusal") {
    throw new Error(
      `Screen refused: ${response.stop_details?.category ?? "unknown"}`
    );
  }
  if (!response.parsed_output) {
    throw new Error("Screen returned no parsable output");
  }
  return response.parsed_output;
}
