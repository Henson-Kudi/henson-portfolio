"use client"

import { useState } from "react"
import { apiSend } from "@/lib/admin-fetch"

type Result = { ok: boolean; status: number; urls: string[]; skipped?: string }

// One click: submit every live URL to IndexNow (Bing, Yandex, Naver, DuckDuckGo).
// Saves already do this for the post or project they touch; this button is
// for the cases with no save: a scheduled post going live, or edits to the
// static Hire / About copy.
export function IndexNowButton() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle")
  const [msg, setMsg] = useState("")

  async function run() {
    setState("busy")
    setMsg("")
    try {
      const r = await apiSend<Result>("/api/indexnow", "POST")
      if (r.skipped) {
        setState("done")
        setMsg(`Skipped (${r.skipped}): ${r.urls.length} URLs would be sent.`)
      } else {
        setState("done")
        setMsg(`Submitted ${r.urls.length} URLs. Bing answered ${r.status}.`)
      }
    } catch (e) {
      setState("error")
      setMsg(e instanceof Error ? e.message : "Failed")
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={run}
        disabled={state === "busy"}
        className="rounded border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-foreground disabled:opacity-60"
      >
        {state === "busy" ? "Notifying…" : "Notify Bing of all live URLs"}
      </button>
      {msg && (
        <span className={`font-mono text-xs ${state === "error" ? "text-red-600" : "text-muted-foreground"}`}>{msg}</span>
      )}
    </div>
  )
}
