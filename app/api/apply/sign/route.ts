import { NextResponse } from "next/server";
import { issueSignedToken, presignUrl } from "@vercel/blob";
import { contentTypeFor, MAX_STORED_BYTES } from "@/lib/uploadTypes";

const FIELDS = ["application", "deck", "bundle"];

// Returns short-lived presigned upload URLs so the browser can upload files
// directly to private Vercel Blob storage (bypassing the serverless
// request-size limit). The form has no login, so each URL is locked to one
// path we choose, a size ceiling, no overwriting, and a 10-minute window.
// The stored file's type comes from the path's extension, so only allowed
// types can be stored.
export async function POST(req: Request) {
  console.log("[api/apply/sign] start");
  try {
    const { files } = await req.json();
    if (!Array.isArray(files) || files.length === 0 || files.length > FIELDS.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const folder = `submissions/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const validUntil = Date.now() + 10 * 60 * 1000;

    const uploads = [];
    for (const f of files) {
      const contentType = contentTypeFor(String(f?.name || ""));
      if (!FIELDS.includes(f?.field) || !contentType) {
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
      }
      const safe = String(f.name)
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .slice(-80);
      const path = `${folder}/${f.field}-${safe}`;
      const token = await issueSignedToken({
        pathname: path,
        operations: ["put"],
        maximumSizeInBytes: MAX_STORED_BYTES,
        validUntil,
      });
      const { presignedUrl } = await presignUrl(token, {
        operation: "put",
        pathname: path,
        access: "private",
        maximumSizeInBytes: MAX_STORED_BYTES,
        addRandomSuffix: false,
        allowOverwrite: false,
      });
      uploads.push({ field: f.field, path, url: presignedUrl, contentType });
    }

    console.log("[api/apply/sign] done", uploads.length, "file(s)");
    return NextResponse.json({ uploads });
  } catch (e) {
    console.log("[api/apply/sign] error", (e as Error).message);
    return NextResponse.json({ error: "Could not prepare upload" }, { status: 500 });
  }
}
