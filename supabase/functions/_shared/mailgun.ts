// Shared Mailgun email-sending helper for NexFrontier Edge Functions.

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

export function otpEmailHtml(opts: { name: string; code: string }): string {
  return emailTemplate({
    eyebrow: 'NexFrontier · Investor Data Room',
    heading: 'Your sign-in code',
    bodyHtml: `
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px">Hi ${opts.name},</p>
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px">
        Enter this code to finish signing in to the NexFrontier Investor Data Room.
      </p>
      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:20px;margin:0 0 20px;text-align:center">
        <div style="color:#22d3ee;font-size:32px;font-weight:700;letter-spacing:0.2em;font-family:monospace">${opts.code}</div>
      </div>
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px">
        This code expires in <strong style="color:#e2e8f0">10 minutes</strong> and can only be used once.
      </p>
      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0">
        If you didn't just try to sign in, you can safely ignore this email — your account is still secure.
      </p>
    `,
  });
}

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
