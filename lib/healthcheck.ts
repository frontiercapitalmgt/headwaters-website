import { timingSafeEqual } from "crypto";
import { getServiceClient, BUCKET } from "@/lib/supabaseServer";
import {
  createApplicationRecord,
  deleteApplicationRecord,
} from "@/lib/airtable";

/**
 * Health-check mode for the application routes.
 *
 * A request is a health check only when it carries the header
 * `x-healthcheck-token` and that value matches the HEALTHCHECK_TOKEN
 * environment variable. If HEALTHCHECK_TOKEN is not set, health-check mode
 * is off entirely and every request is treated as a real submission.
 *
 * In health-check mode the routes exercise the same storage and Airtable
 * plumbing as a real submission, but never send email, never run the paid
 * AI screen, and remove the test record they created before responding.
 */
export function isHealthCheck(req: Request): boolean {
  const expected = process.env.HEALTHCHECK_TOKEN;
  const given = req.headers.get("x-healthcheck-token");
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Label used on every health-check record so it can never be mistaken for a real application. */
export function healthCheckLabel(): string {
  return `ZZ-HEALTHCHECK ${new Date().toISOString()}`;
}

export interface HealthCheckResult {
  ok: boolean;
  checks: Record<string, "pass" | "fail">;
  errors: string[];
}

/**
 * Runs the application pipeline end to end without side effects that reach
 * anyone: confirms Supabase storage can issue an upload URL, writes a clearly
 * labelled test record to Airtable, deletes it again, and confirms the email
 * and screening keys are configured. Sends no email and makes no AI call.
 */
export async function runApplicationHealthCheck(): Promise<HealthCheckResult> {
  const checks: HealthCheckResult["checks"] = {};
  const errors: string[] = [];
  const label = healthCheckLabel();

  // 1. Storage: the same call /api/apply/sign makes. Issuing an upload URL
  //    creates no file, so nothing is left behind.
  try {
    const { error } = await getServiceClient()
      .storage.from(BUCKET)
      .createSignedUploadUrl(`healthcheck/${Date.now()}-probe.txt`);
    if (error) throw new Error(error.message);
    checks.supabaseStorage = "pass";
  } catch (e) {
    checks.supabaseStorage = "fail";
    errors.push(`supabaseStorage: ${(e as Error).message}`);
  }

  // 2. Airtable write, then remove the test record.
  let recordId: string | undefined;
  try {
    const created = await createApplicationRecord({
      founderName: label,
      companyName: label,
      email: "healthcheck@invalid.example",
    });
    recordId = created?.id;
    if (!recordId) throw new Error("no record id returned");
    checks.airtableWrite = "pass";
  } catch (e) {
    checks.airtableWrite = "fail";
    errors.push(`airtableWrite: ${(e as Error).message}`);
  }
  if (recordId) {
    try {
      await deleteApplicationRecord(recordId);
      checks.airtableCleanup = "pass";
    } catch (e) {
      checks.airtableCleanup = "fail";
      errors.push(
        `airtableCleanup: ${(e as Error).message} (test record ${recordId} labelled "${label}" left in table)`
      );
    }
  }

  // 3. Config presence only — no email is sent and no AI call is made.
  const emailReady = !!process.env.RESEND_API_KEY && !!process.env.APPLY_FROM_EMAIL;
  checks.emailConfig = emailReady ? "pass" : "fail";
  if (!emailReady) errors.push("emailConfig: RESEND_API_KEY or APPLY_FROM_EMAIL not set");

  const screenReady = !!process.env.ANTHROPIC_API_KEY;
  checks.screeningConfig = screenReady ? "pass" : "fail";
  if (!screenReady) errors.push("screeningConfig: ANTHROPIC_API_KEY not set");

  return { ok: errors.length === 0, checks, errors };
}
