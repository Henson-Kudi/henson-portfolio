import { site } from "@/lib/site-content"

function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  )
}

// Editorial palette (email-safe hex; web-safe Georgia serif since Newsreader
// won't load in mail clients).
const C = {
  pageBg: "#efeadf",
  card: "#fbf9f4",
  quote: "#f6f3ec",
  ink: "#1c1a15",
  soft: "#3b382f",
  muted: "#78725f",
  brand: "#a54a24",
  line: "#ddd6c6",
}

/**
 * Confirmation email sent to whoever submitted the contact form.
 * Returns subject + HTML + plain-text (both provided for deliverability).
 */
export function contactConfirmationEmail({ name, message }: { name: string; message: string }) {
  const firstName = (name.trim().split(/\s+/)[0] || "there").slice(0, 40)
  const safeName = esc(firstName)
  const safeMsg = esc(message.trim()).replace(/\n/g, "<br>")
  const subject = "Thanks for reaching out — I've got your message"

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${C.pageBg};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">Thanks — I received your message and will get back to you shortly.</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.pageBg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:6px;overflow:hidden;">
          <tr><td style="height:4px;background:${C.brand};font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:36px 40px 8px;">
              <p style="margin:0 0 14px;font-family:'Courier New',monospace;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${C.brand};">Message received</p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:28px;line-height:1.2;color:${C.ink};">Thanks, ${safeName} — I've got your message.</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 40px 0;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:${C.soft};">
                This is a quick note to confirm I received your message. I read every one personally and will get back to you — usually within a couple of days.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.quote};border-left:3px solid ${C.brand};border-radius:2px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">Your message</p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${C.soft};">${safeMsg}</p>
                </td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 40px 0;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:${C.ink};">— Henson Kudi Amah</p>
              <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${C.muted};">${esc(site.role)} · ${esc(site.location)}</p>
            </td>
          </tr>
          <tr><td style="padding:22px 40px 0;"><table role="presentation" width="100%"><tr><td style="border-top:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
          <tr>
            <td style="padding:16px 40px 34px;">
              <a href="${site.website}" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${C.brand};text-decoration:none;">Portfolio</a>
              <span style="color:${C.line};">&nbsp;·&nbsp;</span>
              <a href="${site.socials.linkedin}" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${C.brand};text-decoration:none;">LinkedIn</a>
              <span style="color:${C.line};">&nbsp;·&nbsp;</span>
              <a href="${site.socials.github}" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${C.brand};text-decoration:none;">GitHub</a>
            </td>
          </tr>
        </table>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
          <tr><td style="padding:16px 40px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${C.muted};text-align:center;">
              You're receiving this because you contacted me via ${esc(site.website.replace(/^https?:\/\//, ""))}. No need to reply — I'll be in touch.
            </p>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Thanks, ${firstName} — I've got your message.

This is a quick note to confirm I received your message. I read every one personally and will get back to you, usually within a couple of days.

Your message:
${message.trim()}

— Henson Kudi Amah
${site.role} · ${site.location}
${site.website}

You're receiving this because you contacted me via ${site.website.replace(/^https?:\/\//, "")}. No need to reply — I'll be in touch.`

  return { subject, html, text }
}
