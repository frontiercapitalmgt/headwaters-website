import JSZip from "jszip";
import mammoth from "mammoth";
import { getServiceClient, BUCKET } from "@/lib/supabaseServer";
import { generateScreen, fetchSiteText } from "@/lib/screen";
import { renderScreenPdf } from "@/lib/screenPdf";
import { updateApplicationRecord } from "@/lib/airtable";

/**
 * Runs AFTER the founder has already been told their application was received.
 * Nothing here is on their critical path — it screens the submission, renders a
 * PDF, and replaces the bundle with an enriched one. Every failure is contained:
 * if this throws, the record and the original bundle are left exactly as they were.
 */

export interface EnrichFile {
  field: string; // "application" | "deck" | "bundle"
  path: string;
  filename: string;
}

export interface EnrichInput {
  recordId: string;
  fields: Record<string, unknown>;
  files: EnrichFile[];
}

const slug = (s: string) =>
  String(s || "application").trim().replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 60) ||
  "application";

const line = (k: string, v: unknown) =>
  `${k}: ${v && String(v).trim() ? v : "—"}`;

export async function enrichSubmission(input: EnrichInput): Promise<void> {
  const t0 = Date.now();
  console.log("[enrich] start", input.recordId);
  const supabase = getServiceClient();
  const f = input.fields;

  const byField = Object.fromEntries(input.files.map((x) => [x.field, x]));
  const appRef = byField.application;
  const deckRef = byField.deck;
  if (!appRef || !deckRef) {
    console.log("[enrich] missing application or deck — skipping");
    return;
  }

  // 1) pull the two source files back out of storage
  const grab = async (path: string): Promise<Buffer> => {
    const { data, error } = await supabase.storage.from(BUCKET).download(path);
    if (error || !data) throw new Error(`download ${path}: ${error?.message}`);
    return Buffer.from(await data.arrayBuffer());
  };
  const [appBuf, deckBuf] = await Promise.all([grab(appRef.path), grab(deckRef.path)]);

  // 2) application text (the template is .docx; fall back to raw text)
  let applicationText = "";
  try {
    applicationText = /\.docx$/i.test(appRef.filename)
      ? (await mammoth.extractRawText({ buffer: appBuf })).value
      : appBuf.toString("utf8");
  } catch (e) {
    console.log("[enrich] could not extract application text:", (e as Error).message);
  }

  // 3) best-effort website context
  const siteText = await fetchSiteText(f["Website"] as string | undefined);

  // 4) the screen itself
  const isPdfDeck = /\.pdf$/i.test(deckRef.filename);
  const screen = await generateScreen({
    fields: f,
    deckPdf: isPdfDeck ? deckBuf : undefined,
    deckFilename: deckRef.filename,
    applicationText,
    siteText,
  });

  const company = String(f["Company Name"] || "Applicant");
  const pdfBuf = await renderScreenPdf(screen, {
    company,
    founder: f["Founder Name"] as string,
    website: f["Website"] as string,
    founded: f["Founded"] as string,
    legalStructure: f["Legal Structure"] as string,
    location: f["Location"] as string,
    capitalRaised: f["Capital Raised to Date"] as string,
    currentAsk: f["Current Round Ask"] as string,
  });
  const screenName = `${slug(company)}-screen.pdf`;

  // 5) upload the screen + a rebuilt bundle that contains it
  const put = async (path: string, buf: Buffer, contentType: string) => {
    const up = await supabase.storage
      .from(BUCKET)
      .upload(path, buf, { contentType, upsert: true });
    if (up.error) throw new Error(`upload ${path}: ${up.error.message}`);
    const s = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
    if (s.error || !s.data) throw new Error(`sign ${path}: ${s.error?.message}`);
    return s.data.signedUrl;
  };

  const screenUrl = await put(
    `screens/${input.recordId}/${screenName}`,
    pdfBuf,
    "application/pdf"
  );

  const zip = new JSZip();
  zip.file(appRef.filename, appBuf);
  zip.file(deckRef.filename, deckBuf);
  zip.file(screenName, pdfBuf);
  if (f["Video URL"]) {
    zip.file("video-link.txt", `Founder video:\n${f["Video URL"]}\n`);
  }
  zip.file(
    "summary.txt",
    [
      "Headwaters Seed Stage Fund I — Application",
      "",
      line("Company", f["Company Name"]),
      line("Founder", f["Founder Name"]),
      line("Email", f["Email"]),
      line("Phone", f["Phone Number"]),
      line("Website", f["Website"]),
      line("Founded", f["Founded"]),
      line("Legal structure", f["Legal Structure"]),
      line("Location", f["Location"]),
      line("Capital raised to date", f["Capital Raised to Date"]),
      line("Current round / ask", f["Current Round Ask"]),
      line("Video link", f["Video URL"]),
      "",
      "Files included in this bundle:",
      `  - ${appRef.filename} (completed application)`,
      `  - ${deckRef.filename} (pitch deck)`,
      `  - ${screenName} (automated first-pass screen — AI draft, not a recommendation)`,
      "  - video-link.txt (founder video URL)",
    ].join("\n")
  );
  const bundleBuf = await zip.generateAsync({ type: "nodebuffer" });
  const bundleName = `${slug(company)}-application.zip`;
  const bundleUrl = await put(
    `bundles/${input.recordId}/${bundleName}`,
    bundleBuf,
    "application/zip"
  );

  // 6) attach both (adds/updates fields only — never deletes)
  await updateApplicationRecord(input.recordId, {
    "Auto Screen": [{ url: screenUrl, filename: screenName }],
    "Application Bundle": [{ url: bundleUrl, filename: bundleName }],
  });

  console.log(
    `[enrich] done ${input.recordId} in ${((Date.now() - t0) / 1000).toFixed(1)}s ` +
      `(screen ${pdfBuf.length}b, bundle ${bundleBuf.length}b)`
  );
}
