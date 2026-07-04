"use client"

import { useState } from "react"
import type { Experience } from "@prisma/client"
import { Field, Checkbox, controlClass } from "./field"
import { experienceInput } from "@/lib/validation"
import { apiSend } from "@/lib/admin-fetch"

function toMonthInput(d: Date | string | null | undefined): string {
  if (!d) return ""
  const dt = typeof d === "string" ? new Date(d) : d
  return Number.isNaN(dt.getTime()) ? "" : dt.toISOString().slice(0, 7) // YYYY-MM
}

type Props = {
  initial?: Experience | null
  onCancel: () => void
  onSaved: (e: Experience) => void
  onError: (msg: string) => void
}

export function ExperienceForm({ initial, onCancel, onSaved, onError }: Props) {
  const [f, setF] = useState({
    role: initial?.role ?? "",
    company: initial?.company ?? "",
    location: initial?.location ?? "",
    startMonth: toMonthInput(initial?.startDate),
    endMonth: toMonthInput(initial?.endDate),
    current: initial ? initial.endDate == null : true,
    summary: initial?.summary ?? "",
    highlights: (initial?.highlights ?? []).join("\n"),
    published: initial?.published ?? true,
  })
  const [saving, setSaving] = useState(false)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }))

  async function save() {
    if (!f.startMonth) {
      onError("Start date is required")
      return
    }
    const payload = {
      role: f.role,
      company: f.company,
      location: f.location || undefined,
      startDate: `${f.startMonth}-01`,
      endDate: f.current ? null : f.endMonth ? `${f.endMonth}-01` : null,
      summary: f.summary,
      highlights: f.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      published: f.published,
    }
    const parsed = experienceInput.safeParse(payload)
    if (!parsed.success) {
      onError(parsed.error.issues[0]?.message ?? "Please check the form")
      return
    }
    setSaving(true)
    try {
      const saved = initial
        ? await apiSend<Experience>(`/api/experience/${initial.id}`, "PATCH", parsed.data)
        : await apiSend<Experience>("/api/experience", "POST", parsed.data)
      onSaved(saved)
    } catch (e) {
      onError(e instanceof Error ? e.message : "Could not save")
    } finally {
      setSaving(false)
    }
  }

  const text = (k: keyof typeof f) => ({
    className: controlClass,
    value: f[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(k, e.target.value as (typeof f)[typeof k]),
  })

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <Field label="Role / title">
          <input {...text("role")} />
        </Field>
        <Field label="Company" help="May include the product, e.g. 'ITSEC · Nexus Exchange'">
          <input {...text("company")} />
        </Field>
        <Field label="Location">
          <input {...text("location")} />
        </Field>
        <Field label="Start month">
          <input type="month" {...text("startMonth")} />
        </Field>
        <Field label="End month" help="Ignored while “Current” is on">
          <input type="month" {...text("endMonth")} disabled={f.current} />
        </Field>
        <Field label="Status" full>
          <div className="flex flex-wrap gap-5 pt-1">
            <Checkbox
              label="Current position (Present)"
              checked={f.current}
              onChange={(v) => set("current", v)}
            />
            <Checkbox label="Published" checked={f.published} onChange={(v) => set("published", v)} />
          </div>
        </Field>
        <Field label="Summary" help="Paragraph shown on the homepage timeline." full>
          <textarea rows={3} {...text("summary")} />
        </Field>
        <Field label="Highlights (one per line)" help="Bullet points used on the CV." full>
          <textarea rows={4} {...text("highlights")} />
        </Field>
      </div>

      <div className="mt-6 flex justify-end gap-2.5 border-t border-border pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-border px-4 py-2 text-sm transition-colors hover:border-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded bg-foreground px-4 py-2 text-sm text-background transition-colors hover:bg-brand disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  )
}
