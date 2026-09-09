import { Resend } from "resend";

interface ConfirmationOpts {
  firstName: string;
  companyName: string;
  toEmail: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends the founder a "we received your application" confirmation, CC'ing the
 * fund. No-ops (without throwing) if the email env vars aren't configured, so a
 * missing key can never break a submission.
 */
export async function sendApplicationReceivedEmail(opts: ConfirmationOpts) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.APPLY_FROM_EMAIL;
  const cc = process.env.APPLY_CC_EMAIL || undefined;
  // The from-domain has no inbox, so point replies at a real mailbox.
  const replyTo = process.env.APPLY_REPLY_TO || cc;

  if (!apiKey || !from) {
    console.log("[email] skipped — RESEND_API_KEY or APPLY_FROM_EMAIL not set");
    return;
  }

  const { firstName, companyName, toEmail } = opts;
  const first = firstName.trim() || "there";
  const company = companyName.trim();

  const text = [
    `Hi ${first},`,
    "",
    `Thank you for sharing ${company} with us. Your application and materials came through, and we will be looking over them as soon as possible.`,
    "",
    "We greatly appreciate the time you took to put together these materials and we are looking forward to learning more about you and the company!",
    "",
    "Warm regards,",
    "The Headwaters Team",
    "Headwaters Seed Stage Fund I",
  ].join("\n");

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#0C2140;max-width:560px;">
    <p style="margin:0 0 18px;">Hi ${escapeHtml(first)},</p>
    <p style="margin:0 0 18px;">
      Thank you for sharing <strong>${escapeHtml(company)}</strong> with us. Your
      application and materials came through, and we will be looking over them as
      soon as possible.
    </p>
    <p style="margin:0 0 18px;">
      We greatly appreciate the time you took to put together these materials and we
      are looking forward to learning more about you and the company!
    </p>
    <p style="margin:28px 0 0;">Warm regards,</p>
    <p style="margin:0;font-weight:600;">The Headwaters Team</p>
    <p style="margin:0;color:#255da5;font-size:14px;">Headwaters Seed Stage Fund I</p>
    <hr style="border:none;border-top:1px solid #d9e6f3;margin:28px 0 12px;" />
    <p style="margin:0;font-size:12px;color:#4f7fbf;">
      This is an automated confirmation that your application was received.
    </p>
  </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: toEmail,
      cc,
      replyTo,
      subject: `We received your application — ${company}`,
      text,
      html,
    });
    if (error) {
      console.log("[email] send error:", JSON.stringify(error));
    } else {
      console.log("[email] confirmation sent to", toEmail, cc ? `(cc ${cc})` : "");
    }
  } catch (e) {
    console.log("[email] send threw:", (e as Error).message);
  }
}
