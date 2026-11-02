import { put, get, issueSignedToken, presignUrl } from "@vercel/blob";

// Server-only helpers for the private Vercel Blob store that holds founder
// uploads, screens and bundles. Nothing in the store can be read without a
// signed link. Never import this into a client component.

/** A time-limited download link — used to hand a file to Airtable. */
export async function signedReadUrl(pathname: string, seconds = 3600): Promise<string> {
  const token = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil: Date.now() + seconds * 1000,
  });
  const { presignedUrl } = await presignUrl(token, {
    operation: "get",
    pathname,
    access: "private",
  });
  return presignedUrl;
}

/** Downloads a stored file. Throws if it doesn't exist. */
export async function readFile(pathname: string): Promise<Buffer> {
  const res = await get(pathname, { access: "private" });
  if (!res || res.statusCode !== 200) throw new Error(`read ${pathname}: not found`);
  return Buffer.from(await new Response(res.stream).arrayBuffer());
}

/** Saves a file at an exact path, replacing any earlier version. */
export async function saveFile(pathname: string, buf: Buffer, contentType: string) {
  await put(pathname, buf, {
    access: "private",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
