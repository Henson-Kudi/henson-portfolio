"use client"

import { useState } from "react"

const labelClass =
  "mb-2 mt-5 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground first:mt-0"
const inputClass =
  "w-full rounded-[2px] border border-border bg-background px-3.5 py-3 text-[15px] text-foreground transition-colors focus:border-brand focus:outline-none"

type State = "idle" | "sending" | "sent" | "error"

export function ContactForm() {
  const [state, setState] = useState<State>("idle")
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""), // honeypot
    }
    setState("sending")
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => null)
        throw new Error(j?.error ?? "Something went wrong")
      }
      setState("sent")
      form.reset()
    } catch (err) {
      setState("error")
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded border border-border bg-card p-9 max-sm:p-6">
        <div className="font-serif text-2xl">Thanks — message sent ✓</div>
        <p className="mt-3 text-ink-soft">I'll get back to you shortly.</p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-sm text-brand hover:underline"
        >
          Send another →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded border border-border bg-card p-9 max-sm:p-6">
      <label className={labelClass}>Name</label>
      <input
        name="name"
        type="text"
        placeholder="Your name"
        required
        suppressHydrationWarning
        className={inputClass}
      />

      <label className={labelClass}>Email</label>
      <input
        name="email"
        type="email"
        placeholder="you@company.com"
        required
        suppressHydrationWarning
        className={inputClass}
      />

      <label className={labelClass}>What are you building?</label>
      <textarea
        name="message"
        required
        suppressHydrationWarning
        placeholder="A few lines about the project, timeline and stack…"
        className={`${inputClass} min-h-[100px] resize-y`}
      />

      {/* Honeypot — hidden from users, catches bots. */}
      <input
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {state === "error" && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={state === "sending"}
        suppressHydrationWarning
        className="mt-6 flex w-full items-center justify-center rounded-[2px] border border-foreground bg-foreground px-6 py-3.5 text-sm text-background transition-colors hover:border-brand hover:bg-brand hover:text-white disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send message →"}
      </button>
    </form>
  )
}
