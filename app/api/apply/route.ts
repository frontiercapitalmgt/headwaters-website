import { NextResponse } from "next/server";
import { getServiceClient, BUCKET } from "@/lib/supabaseServer";
import { createApplicationRecord } from "@/lib/airtable";
import { sendApplicationReceivedEmail } from "@/lib/email";
import { enrichSubmission } from "@/lib/enrich";
import { waitUntil } from "@vercel/functions";

// Background enrichment runs after the response; Pro allows up to 300s.
export const maxDuration = 300;

// Receives the form fields + the storage paths of already-uploaded files,
// then creates the Airtable record (with the files attached by signed URL).
export async function POST(req: Request) {
  console.log("[api/apply] start");
  try {
    const body = await req.json();

    // Honeypot: real users never fill this hidden field; bots do.
    if (body.hp) {
      console.log("[api/apply] honeypot triggered — ignoring");
      return NextResponse.json({ ok: true });
    }

    const required = ["firstName", "lastName", "companyName", "email"];
    for (const k of required) {
      if (!body[k] || !String(body[k]).trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${k}` },
          { status: 400 }
        );
      }
    }

    const supabase = getServiceClient();
    const files = Array.isArray(body.files) ? body.files : [];
    const signed: Record<string, { url: string; filename: string }> = {};
    for (const file of files) {
      if (!file?.path) continue;
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(file.path, 3600); // 1h — long enough for Airtable to fetch
      if (error || !data) {
        console.log("[api/apply] signed-url error", error?.message);
        return NextResponse.json(
          { error: "Could not read an uploaded file" },
          { status: 500 }
        );
      }
      signed[file.field] = {
        url: data.signedUrl,
        filename: file.filename || "file",
      };
    }

    const created = await createApplicationRecord({
      founderName: `${body.firstName} ${body.lastName}`.trim(),
      companyName: body.companyName,
      email: body.email,
      phone: body.phone,
      website: body.website,
      founded: body.founded,
      legalStructure: body.legalStructure,
      location: body.location,
      capitalRaised: body.capitalRaised,
      currentAsk: body.currentAsk,
      videoUrl: body.videoUrl,
      applicationFile: signed.application,
      pitchDeck: signed.deck,
      bundle: signed.bundle,
    });

    // Confirmation email to the founder (CC the fund). Never fails the submission.
    await sendApplicationReceivedEmail({
      firstName: body.firstName,
      companyName: body.companyName,
      toEmail: body.email,
    });

    // Fire-and-forget: screen the submission and rebuild the bundle with it.
    // The founder is NOT waiting on any of this.
    const recordId = created?.id as string | undefined;
    if (recordId) {
      const task = enrichSubmission({
        recordId,
        fields: {
          "Company Name": body.companyName,
          "Founder Name": `${body.firstName} ${body.lastName}`.trim(),
          Email: body.email,
          "Phone Number": body.phone,
          Website: body.website,
          Founded: body.founded,
          "Legal Structure": body.legalStructure,
          Location: body.location,
          "Capital Raised to Date": body.capitalRaised,
          "Current Round Ask": body.currentAsk,
          "Video URL": body.videoUrl,
        },
        files,
      }).catch((err) =>
        console.log("[api/apply] enrichment failed (non-fatal):", (err as Error).message)
      );
      try {
        waitUntil(task);
      } catch {
        // Not on Vercel (local dev) — the promise still runs to completion.
      }
    }

    console.log("[api/apply] done — record created");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.log("[api/apply] error", (e as Error).message);
    return NextResponse.json(
      { error: "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}
