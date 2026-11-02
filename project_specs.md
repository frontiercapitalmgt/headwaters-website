# Project Specs — Headwaters Website

## App overview
Marketing site for Headwaters Seed Stage Fund I (pre-revenue hardtech VC).
Public pages: Home, About, Founders, Apply (`/portfolio` route).
Tech: Next.js 15 (App Router), TypeScript, Tailwind CSS. Deployed on Vercel.

---

## Feature in progress: In-house founder application form

### Goal
Replace the third-party Fillout form with our own on-brand form that submits
straight into the existing **Airtable** base. Same destination as today — we
just own the design and remove the Fillout dependency.

### User flow
1. Founder clicks **Submit Your Application** on the Apply page.
2. Our custom form opens in the on-page modal (replacing the Fillout popup).
3. They fill it in, attach files, and submit.
4. A Next.js API route (runs as a Vercel function) validates the data and
   creates a new record in Airtable with the files attached.
5. Founder sees a success message; the team sees a new row in Airtable.

### Form fields
- Founder name — text, required
- Email — email, required
- Company — text, required
- Completed Application — file upload, required (the filled template)
- Pitch Deck — file upload, required (PDF)
- Video link — URL, optional (Drive / YouTube / Loom — a link, never a file)
- Hidden honeypot field — spam protection

### Where things run / live (chosen: Supabase Storage + Airtable)
- **Form UI:** our React component (in the existing modal). Full design control.
- **File upload:** the browser uploads each file **directly to a Supabase Storage
  bucket** (private). This bypasses Vercel's request-size limit, so decks of any
  size upload reliably.
- **Submission handling:** Next.js API route `/app/api/apply/route.ts` (a Vercel
  function). Receives the text fields + the uploaded file paths, validates, then
  creates the Airtable record and saves durable links to the files.
- **Storage:** files live in **Supabase Storage**; the **Airtable** record holds
  the applicant's details plus links to each file. (Supabase scales by usage, so
  no hard cap.)

### Secrets (never committed; in `.env.local` locally + Vercel env vars in prod)
Supabase:
- `NEXT_PUBLIC_SUPABASE_URL` — project URL (safe to expose)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key for browser uploads (safe to expose)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only secret (signed links / admin ops)

Airtable:
- `AIRTABLE_TOKEN` — Personal Access Token, scoped to write records
- `AIRTABLE_BASE_ID` — the base id (looks like `appXXXXXXXX`)
- `AIRTABLE_TABLE` — table name or id that receives applications

### Supabase setup
- One Storage bucket (e.g. `applications`), **private**.
- RLS policy: allow uploads (insert) from the form; no public listing.
- Files are referenced from Airtable via long-lived signed links.

### Validation & safety
- Required-field checks (client + server)
- Allowed file types: PDF / DOC / DOCX for documents
- File-size guard with a clear error message
- Honeypot + basic checks to deter bots
- Server logs a console line at the start and end of the route

### "Done" looks like
- A real submission on localhost creates an Airtable record with both files
  attached and the link saved.
- The error path (missing field, oversized file, Airtable failure) shows a clear
  message and doesn't lose the user's input.
- Works on the deployed Vercel site with env vars set.
- Fillout popup is removed once the in-house form is verified.

### Out of scope (for now)
- Storing files anywhere other than Airtable (Supabase only if size forces it)
- Emailing applicants / auto-replies
- An admin dashboard (Airtable is the review surface)

---

## Feature: Application health-check mode (Oct 2026)

### Goal
Let a weekly scheduled check prove the founder-application pipeline works end
to end without creating a real-looking application, emailing anyone, or
paying for an AI screen.

### How it works
- `POST /api/apply` with header `x-healthcheck-token: <HEALTHCHECK_TOKEN>` and
  the normal required fields (firstName, lastName, companyName, email).
- The route validates the fields as usual, then (instead of the real flow):
  1. asks Vercel Blob for an upload token (creates no file),
  2. writes an Airtable record labelled `ZZ-HEALTHCHECK <timestamp>`,
  3. deletes that same record,
  4. confirms the email (Resend) and screening (Anthropic) keys are set.
- No confirmation email is sent and no AI screen runs.
- Response: `200 {healthcheck:true, ok:true, checks:{...}}` on success,
  `503` with an `errors` list on any failure.

### Secret
- `HEALTHCHECK_TOKEN` — long random string, set in Vercel (Production).
  If it is not set, health-check mode is off and nothing changes.

### Done looks like
- Build passes; a request without the header behaves exactly as before;
  a request with the right header returns the check result and leaves no
  record in Airtable.

---

## Feature: Move file storage from Supabase to Vercel Blob (Oct 2026) — APPROVED, built + tested locally, not yet deployed

### Why
The free Supabase project pauses after ~7 days of inactivity. While paused,
founders cannot upload files, so no application can be submitted, and the
automated screen cannot download the deck. Vercel Blob lives inside the
Vercel team that already hosts the site and does not pause.

### What changes (same flow, different storage)
- **Store:** one **private** Vercel Blob store (e.g. `headwaters-applications`)
  in the `graham-8890s-projects` team, connected to `headwaters-clone`.
  Private = no file is readable without a signed link.
- **`/api/apply/sign`:** same request/response shape as before, but returns
  presigned Blob upload URLs (`issueSignedToken` + `presignUrl`) instead of
  Supabase ones. The server picks each path; only PDF / DOC / DOCX / PPT /
  PPTX / ZIP names are accepted (the stored type comes from the extension);
  each URL is locked to its path, 105 MB ceiling, no overwrite, 10 minutes.
  (`handleUploadPresigned` was not used: it refuses to run without a
  `BLOB_WEBHOOK_PUBLIC_KEY` the CLI does not provision, for a callback we
  don't use.)
- **`ApplyForm.tsx`:** PUTs each file to its presigned URL instead of using the
  Supabase browser client, and rejects non-PDF/Word/PowerPoint files up front.
  Form, fields and other messages unchanged.
- **New helpers:** `lib/blob.ts` (server-only read / save / signed link) and
  `lib/uploadTypes.ts` (allowed types + size limits, shared with the form).
- **`/api/apply`:** gives Airtable a 1-hour presigned *read* link for each file
  (as it does today with Supabase signed links). Airtable still copies the files.
- **`lib/enrich.ts`:** reads the deck + application with Blob `get()`, saves the
  screen PDF and rebuilt bundle with `put()`, hands Airtable presigned links.
- **`lib/healthcheck.ts`:** the storage check issues a Blob upload token instead
  of a Supabase one (creates no file). Its result key is now `blobStorage`
  (was `supabaseStorage`).
- **`tools/deal.mjs`:** overview upload switches to Blob the same way.
- **Remove:** `lib/supabaseServer.ts`, `lib/supabaseBrowser.ts`, the
  `@supabase/*` packages, and the Supabase env vars, once Blob is verified.

### Store + secrets
- Store `headwaters-applications` (`store_Oh0sPsdwOtOpktAF`), private, iad1,
  connected to `headwaters-clone` in all environments.
- `BLOB_READ_WRITE_TOKEN` — added to Vercel (all environments) automatically
  when the store was connected; also in `.env.local` for local dev + `tools/`.

### Existing data
Nothing to migrate: every past application's files already live in Airtable.
Supabase can be deleted (or left paused) after the switch.

### Cost
Tiny volume (a few applications/month, ~10–50 MB each) — within the free
allowance on Hobby, pennies on Pro.

### Done looks like
- `npm run build` passes.
- A real test submission on localhost uploads to Blob, creates the Airtable
  record with all three files attached, sends the confirmation email, and
  attaches the Auto Screen + rebuilt bundle.
- Error path: a wrong file type or oversized file shows a clear message and
  keeps the founder's input.
- Health check returns `ok: true` on the deployed site.
- Same test passes on the deployed Vercel site.
