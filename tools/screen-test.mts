/**
 * Local test: run the automated screen against a real Airtable submission.
 *   npx tsx tools/screen-test.ts "Grizzly Systems"
 * Read-only — it does not write anything back to Airtable.
 */
import fs from "node:fs";
import path from "node:path";
import mammoth from "mammoth";
import { generateScreen, fetchSiteText } from "../lib/screen";

// load .env.local
for (const line of fs.readFileSync(path.resolve(".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const target = process.argv[2] || "Grizzly Systems";
const AT = {
  base: process.env.AIRTABLE_BASE_ID!,
  table: encodeURIComponent(process.env.AIRTABLE_TABLE!),
  headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
};

const dl = async (url: string) =>
  Buffer.from(await (await fetch(url)).arrayBuffer());

const data = await fetch(`https://api.airtable.com/v0/${AT.base}/${AT.table}`, {
  headers: AT.headers,
}).then((r) => r.json());

const rec = data.records.find((r: any) =>
  String(r.fields["Company Name"] || "").toLowerCase().includes(target.toLowerCase())
);
if (!rec) throw new Error(`no record matching ${target}`);
const f = rec.fields;
console.log(`Screening: ${f["Company Name"]}\n`);

const deckAtt = (f["Pitch Deck"] || [])[0];
const appAtt = (f["Application Form"] || [])[0];

const deckPdf = deckAtt ? await dl(deckAtt.url) : undefined;
console.log(`  deck: ${deckAtt?.filename ?? "none"} (${deckPdf?.length ?? 0} bytes)`);

let applicationText = "";
if (appAtt) {
  const buf = await dl(appAtt.url);
  if (/\.docx$/i.test(appAtt.filename)) {
    applicationText = (await mammoth.extractRawText({ buffer: buf })).value;
  } else {
    applicationText = buf.toString("utf8").slice(0, 60000);
  }
  console.log(`  application: ${appAtt.filename} (${applicationText.length} chars extracted)`);
}

const siteText = await fetchSiteText(f["Website"] as string | undefined);
console.log(`  website text: ${siteText.length} chars`);

console.log("\ncalling Claude…\n");
const t0 = Date.now();
const screen = await generateScreen({
  fields: f,
  deckPdf,
  deckFilename: deckAtt?.filename,
  applicationText,
  siteText,
});
console.log(`(took ${((Date.now() - t0) / 1000).toFixed(1)}s)\n`);
console.log(JSON.stringify(screen, null, 2));
