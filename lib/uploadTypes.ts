// File types founders may upload. Shared by the form (to check files before
// uploading) and the upload-signing route (to refuse anything else).

const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
};

// Per-file limit shown to founders.
export const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB
// Hard ceiling enforced by storage. The bundle zip holds both files, so it can
// be up to twice the per-file limit.
export const MAX_STORED_BYTES = 2 * MAX_FILE_BYTES + 5 * 1024 * 1024;

/** The media type for a filename, or undefined if it isn't an allowed type. */
export function contentTypeFor(filename: string): string | undefined {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return TYPES[ext];
}
