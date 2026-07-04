import { NextResponse } from "next/server"
import { Resend } from "resend"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  )
}

// Resend inbound-email webhook. On `email.received`, fetches the full message
// and RE-SENDS it as a clean email from your verified domain (aligned SPF/DKIM
// so Gmail reliably accepts it), with the original sender as reply-to.
// Configure this URL in Resend → Webhooks with the `email.received` event.
export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
  if (!apiKey || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 })
  }

  // Raw body is required — parsing to JSON first would break signature checks.
  const payload = await req.text()
  const headers = {
    id: req.headers.get("svix-id") ?? req.headers.get("webhook-id") ?? "",
    timestamp: req.headers.get("svix-timestamp") ?? req.headers.get("webhook-timestamp") ?? "",
    signature: req.headers.get("svix-signature") ?? req.headers.get("webhook-signature") ?? "",
  }

  const resend = new Resend(apiKey)

  let event
  try {
    event = resend.webhooks.verify({ payload, headers, webhookSecret })
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  if (event.type === "email.received") {
    const to = process.env.INBOUND_FORWARD_TO || "amahkudi.dev@gmail.com"
    // Must be a verified sender on your Resend domain.
    const from = process.env.INBOUND_FORWARD_FROM || "Inbound <inbound@amahkudi.dev>"

    try {
      // The webhook has metadata only — fetch the full body/headers.
      const { data: received, error: getError } = await resend.emails.receiving.get(
        event.data.email_id,
      )
      if (getError || !received) {
        console.error("[resend-webhook] fetch received email failed:", getError)
        return NextResponse.json({ error: "Fetch failed" }, { status: 502 })
      }

      const origFrom = received.from
      const subject = received.subject || "(no subject)"
      const banner = `Forwarded from ${origFrom} — ${subject}`
      const attachNote = received.attachments.length
        ? ` [${received.attachments.length} attachment(s) not included]`
        : ""

      const bodyHtml = received.html
        ? received.html
        : `<pre style="white-space:pre-wrap;font-family:Arial,Helvetica,sans-serif;margin:0">${escapeHtml(
            received.text || "(no content)",
          )}</pre>`

      const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#3b382f;font-size:15px;line-height:1.6">
  <p style="color:#78725f;font-size:13px;margin:0 0 14px;padding-bottom:12px;border-bottom:1px solid #ddd6c6">${escapeHtml(
    banner,
  )}${escapeHtml(attachNote)}</p>
  ${bodyHtml}
</div>`

      const text = `${banner}${attachNote}\n${"-".repeat(48)}\n\n${
        received.text || received.html?.replace(/<[^>]+>/g, " ") || "(no content)"
      }`

      const { data: sent, error: sendError } = await resend.emails.send({
        from,
        to,
        replyTo: origFrom, // replying goes to the original sender
        subject: `Fwd: ${subject}`,
        html,
        text,
      })
      if (sendError) {
        console.error("[resend-webhook] forward send error:", sendError)
        return NextResponse.json({ error: "Forward failed" }, { status: 502 })
      }

      // Trace id → find this in Resend → Emails to confirm delivery.
      console.log(
        `[resend-webhook] forwarded ${event.data.email_id} from "${origFrom}" → ${to} (sent id: ${sent?.id})${attachNote}`,
      )
    } catch (e) {
      console.error("[resend-webhook] forward threw:", e)
      return NextResponse.json({ error: "Forward failed" }, { status: 502 })
    }
  }

  // 200 for handled + ignored events so Resend marks the delivery successful.
  return NextResponse.json({ ok: true })
}
