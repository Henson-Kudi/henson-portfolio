import { NextResponse } from "next/server"
import { Resend } from "resend"
import { contactInput } from "@/lib/validation"
import { contactConfirmationEmail } from "@/lib/emails/contact-confirmation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Public endpoint — the portfolio contact form posts here and it emails Henson.
export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const parsed = contactInput.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 },
    )
  }

  const { name, email, message, company } = parsed.data

  // Honeypot tripped → pretend success, send nothing (don't tip off bots).
  if (company && company.trim()) return NextResponse.json({ ok: true })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Email is not configured yet." }, { status: 503 })
  }

  const to = process.env.CONTACT_TO_EMAIL || "amahkudi@gmail.com"
  // onboarding@resend.dev works out of the box (delivers to your Resend account
  // email) until you verify amahkudi.dev and set a branded CONTACT_FROM_EMAIL.
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@amahkudi.dev>"

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    })
    if (error) {
      console.error("[contact] resend error:", error)
      return NextResponse.json({ error: "Could not send your message." }, { status: 502 })
    }

    // Best-effort acknowledgement to the sender — never fails the submission.
    try {
      const ack = contactConfirmationEmail({ name, message })
      await resend.emails.send({
        from,
        to: email,
        replyTo: to, // replies to the confirmation reach Henson's inbox
        subject: ack.subject,
        html: ack.html,
        text: ack.text,
      })
    } catch (e) {
      console.error("[contact] confirmation failed:", e)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[contact] send failed:", e)
    return NextResponse.json({ error: "Could not send your message." }, { status: 502 })
  }
}
