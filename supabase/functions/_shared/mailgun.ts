// Shared Mailgun email-sending helper for NexFrontier Edge Functions.
// Mirrors the proven pattern already used in production by the legacy
// site's send-email function (same domain, same auth approach).

const MAILGUN_DOMAIN = "nexfrontierlogic.nz";
const FROM_ADDRESS = "NexFrontier <noreply@nexfrontierlogic.nz>";

export interface SendEmailResult {
  sent: boolean;
  status?: number;
  error?: string;
}

export async function sendMailgunEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendEmailResult> {
  const mailgunKey = Deno.env.get("MAILGUN_API_KEY");
  if (!mailgunKey) {
    console.warn("MAILGUN_API_KEY not set — email not sent:", opts.subject, "->", opts.to);
    return { sent: false, error: "MAILGUN_API_KEY not configured" };
  }

  const formData = new FormData();
  formData.append("from", FROM_ADDRESS);
  formData.append("to", opts.to);
  formData.append("subject", opts.subject);
  formData.append("html", opts.html);
  if (opts.replyTo) {
    formData.append("h:Reply-To", opts.replyTo);
  }

  try {
    const credentials = btoa(`api:${mailgunKey}`);
    const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: { Authorization: `Basic ${credentials}` },
      body: formData,
    });
    const body = await res.text();
    if (!res.ok) {
      console.error("Mailgun error:", res.status, body);
      return { sent: false, status: res.status, error: body };
    }
    return { sent: true, status: res.status };
  } catch (err) {
    console.error("Mailgun request failed:", err);
    return { sent: false, error: String(err) };
  }
}

// Shared dark-themed wrapper matching the site's existing email branding
// (same styling already used in production by send-email/index.ts).
export function emailTemplate(opts: {
  eyebrow: string;
  heading: string;
  bodyHtml: string;
}): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0f1a;color:#e2e8f0;padding:40px 32px;border-radius:12px">
      <div style="margin-bottom:24px">
        <span style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#22d3ee;font-weight:600">${opts.eyebrow}</span>
      </div>
      <h1 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 24px">${opts.heading}</h1>
      ${opts.bodyHtml}
      <hr style="border:none;border-top:1px solid #1e293b;margin:32px 0">
      <p style="color:#475569;font-size:12px;margin:0">NexFrontier &middot; nexfrontierlogic.nz</p>
    </div>
  `;
}
