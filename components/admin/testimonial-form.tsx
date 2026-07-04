"use client"

import { useState } from "react"
import type { Testimonial } from "@prisma/client"
import { Field, Checkbox, controlClass } from "./field"
import { testimonialInput } from "@/lib/validation"
import { apiSend } from "@/lib/admin-fetch"

type Props = {
  initial?: Testimonial | null
  onCancel: () => void
  onSaved: (t: Testimonial) => void
  onError: (msg: string) => void
}

export function TestimonialForm({ initial, onCancel, onSaved, onError }: Props) {
  const [f, setF] = useState({
    quote: initial?.quote ?? "",
    authorName: initial?.authorName ?? "",
    authorRole: initial?.authorRole ?? "",
    authorCompany: initial?.authorCompany ?? "",
    avatarUrl: initial?.avatarUrl ?? "",
    published: initial?.published ?? true,
  })
  const [saving, setSaving] = useState(false)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }))

  async function save() {
    const payload = {
      quote: f.quote,
      authorName: f.authorName,
      authorRole: f.authorRole || undefined,
      authorCompany: f.authorCompany || undefined,
      avatarUrl: f.avatarUrl,
      published: f.published,
    }
    const parsed = testimonialInput.safeParse(payload)
    if (!parsed.success) {
      onError(parsed.error.issues[0]?.message ?? "Please check the form")
      return
    }
    setSaving(true)
    try {
      const saved = initial
        ? await apiSend<Testimonial>(`/api/testimonials/${initial.id}`, "PATCH", parsed.data)
        : await apiSend<Testimonial>("/api/testimonials", "POST", parsed.data)
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
        <Field label="Quote" full>
          <textarea rows={4} {...text("quote")} />
        </Field>
        <Field label="Author name">
          <input {...text("authorName")} />
        </Field>
        <Field label="Role" help="e.g. CTO">
          <input {...text("authorRole")} />
        </Field>
        <Field label="Company">
          <input {...text("authorCompany")} />
        </Field>
        <Field label="Avatar URL" help="optional">
          <input {...text("avatarUrl")} />
        </Field>
        <Field label="Visibility" full>
          <div className="pt-1">
            <Checkbox label="Published" checked={f.published} onChange={(v) => set("published", v)} />
          </div>
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
