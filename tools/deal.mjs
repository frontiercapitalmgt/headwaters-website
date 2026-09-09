#!/usr/bin/env node
/**
 * Internal ops tool for Headwaters deal overviews.
 *
 *   node tools/deal.mjs list
 *   node tools/deal.mjs fetch "Grizzly Systems"        # pull deck + application locally
 *   node tools/deal.mjs attach "Grizzly Systems" out/overview.pdf
 *
 * `attach` uploads the overview, attaches it to the record's "Company Overview"
 * column, and rebuilds that record's "Application Bundle" zip so the overview
 * ships inside it. It only ever ADDS/UPDATES fields — it never deletes records.
 *
 * Credentials are read from .env.local (never hard-coded, never committed).
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

// ---- env -----------------------------------------------------------------
function loadEnv() {
  const p = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) throw new Error("Missing .env.local");
  const env = {};
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  const need = [
    "AIRTABLE_TOKEN",
    "AIRTABLE_BASE_ID",
    "AIRTABLE_TABLE",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];
  for (const k of need) if (!env[k]) throw new Error(`Missing ${k} in .env.local`);
  return env;
}
const env = loadEnv();
const AT = {
  base: env.AIRTABLE_BASE_ID,
  table: encodeURIComponent(env.AIRTABLE_TABLE),
  headers: {
    Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
    "Content-Type": "application/json",
  },
};
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
const BUCKET = "applications";

// ---- helpers -------------------------------------------------------------
const slug = (s) =>
  String(s || "deal").trim().replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 60) || "deal";

async function allRecords() {
  const r = await fetch(`https://api.airtable.com/v0/${AT.base}/${AT.table}`, {
    headers: AT.headers,
  });
  const d = await r.json();
  if (!r.ok) throw new Error("Airtable: " + JSON.stringify(d));
  return d.records;
}

async function findRecord(target) {
  const recs = await allRecords();
  const t = String(target).toLowerCase();
  const hit =
    recs.find((r) => r.id === target) ||
    recs.find((r) => String(r.fields["Company Name"] || "").toLowerCase() === t) ||
    recs.find((r) => String(r.fields["Company Name"] || "").toLowerCase().includes(t));
  if (!hit) throw new Error(`No record matching "${target}"`);
  return hit;
}

async function download(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download failed ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

const line = (k, v) => `${k}: ${v && String(v).trim() ? v : "—"}`;
function summaryText(f, files) {
  return [
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
    ...files.map((n) => `  - ${n}`),
  ].join("\n");
}

async function uploadAndSign(storagePath, buf, contentType) {
  const up = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buf, { contentType, upsert: true });
  if (up.error) throw new Error("upload: " + up.error.message);
  const s = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 3600);
  if (s.error) throw new Error("sign: " + s.error.message);
  return s.data.signedUrl;
}

async function patchRecord(id, fields) {
  const r = await fetch(`https://api.airtable.com/v0/${AT.base}/${AT.table}/${id}`, {
    method: "PATCH",
    headers: AT.headers,
    body: JSON.stringify({ fields }),
  });
  if (!r.ok) throw new Error("patch " + r.status + ": " + (await r.text()));
  return r.json();
}

// ---- commands ------------------------------------------------------------
async function cmdList() {
  for (const r of await allRecords()) {
    const f = r.fields;
    const has = (k) => ((f[k] || []).length ? "yes" : "—");
    console.log(
      `${r.id}  ${String(f["Company Name"] || "(blank)").padEnd(42)} ` +
        `app:${has("Application Form")}  deck:${has("Pitch Deck")}  ` +
        `bundle:${has("Application Bundle")}  overview:${has("Company Overview")}`
    );
  }
}

async function cmdFetch(target) {
  const rec = await findRecord(target);
  const f = rec.fields;
  const dir = path.resolve(process.cwd(), ".deal-work", slug(f["Company Name"]));
  fs.mkdirSync(dir, { recursive: true });

  for (const [field, label] of [
    ["Application Form", "application"],
    ["Pitch Deck", "deck"],
  ]) {
    const a = (f[field] || [])[0];
    if (!a) {
      console.log(`  (no ${field})`);
      continue;
    }
    const out = path.join(dir, a.filename);
    fs.writeFileSync(out, await download(a.url));
    console.log(`  saved ${label}: ${out}`);
  }
  fs.writeFileSync(
    path.join(dir, "record.json"),
    JSON.stringify({ id: rec.id, fields: f }, null, 2)
  );
  console.log(`  saved fields: ${path.join(dir, "record.json")}`);
  console.log(`\nRecord ${rec.id} — ${f["Company Name"]}`);
}

async function cmdAttach(target, overviewPath) {
  if (!overviewPath || !fs.existsSync(overviewPath)) {
    throw new Error(`Overview file not found: ${overviewPath}`);
  }
  const rec = await findRecord(target);
  const f = rec.fields;
  const company = f["Company Name"] || "deal";
  const overviewName = `${slug(company)}-overview${path.extname(overviewPath)}`;
  const overviewBuf = fs.readFileSync(overviewPath);
  const ctype = overviewPath.toLowerCase().endsWith(".pdf")
    ? "application/pdf"
    : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  // 1) attach the overview on its own column
  const overviewUrl = await uploadAndSign(
    `overviews/${rec.id}/${overviewName}`,
    overviewBuf,
    ctype
  );
  await patchRecord(rec.id, {
    "Company Overview": [{ url: overviewUrl, filename: overviewName }],
  });
  console.log(`  attached Company Overview: ${overviewName}`);

  // 2) rebuild the bundle so the overview ships inside it
  const app = (f["Application Form"] || [])[0];
  const deck = (f["Pitch Deck"] || [])[0];
  if (!app || !deck) {
    console.log("  (missing application or deck — bundle not rebuilt)");
    return;
  }
  const zip = new JSZip();
  zip.file(app.filename, await download(app.url));
  zip.file(deck.filename, await download(deck.url));
  zip.file(overviewName, overviewBuf);
  if (f["Video URL"]) zip.file("video-link.txt", `Founder video:\n${f["Video URL"]}\n`);
  zip.file(
    "summary.txt",
    summaryText(f, [app.filename, deck.filename, overviewName, "video-link.txt"])
  );
  const bundleBuf = await zip.generateAsync({ type: "nodebuffer" });
  const bundleName = `${slug(company)}-application.zip`;
  const bundleUrl = await uploadAndSign(
    `bundles/${rec.id}/${bundleName}`,
    bundleBuf,
    "application/zip"
  );
  await patchRecord(rec.id, {
    "Application Bundle": [{ url: bundleUrl, filename: bundleName }],
  });
  console.log(`  rebuilt Application Bundle with overview (${bundleBuf.length}b)`);
}

// ---- main ----------------------------------------------------------------
const [cmd, ...args] = process.argv.slice(2);
try {
  if (cmd === "list") await cmdList();
  else if (cmd === "fetch") await cmdFetch(args[0]);
  else if (cmd === "attach") await cmdAttach(args[0], args[1]);
  else {
    console.log("Usage:");
    console.log("  node tools/deal.mjs list");
    console.log('  node tools/deal.mjs fetch "Company Name"');
    console.log('  node tools/deal.mjs attach "Company Name" path/to/overview.pdf');
    process.exit(1);
  }
} catch (e) {
  console.error("ERROR:", e.message);
  process.exit(1);
}
