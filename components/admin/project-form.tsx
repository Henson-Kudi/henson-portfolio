"use client"

import { useState } from "react"
import type { Project } from "@prisma/client"
import { Field, Checkbox, controlClass } from "./field"
import { projectInput } from "@/lib/validation"
import { apiSend } from "@/lib/admin-fetch"

type Props = {
  initial?: Project | null
  onCancel: () => void
  onSaved: (p: Project) => void
  onError: (msg: string) => void
}

export function ProjectForm({ initial, onCancel, onSaved, onError }: Props) {
  const [f, setF] = useState({
    title: initial?.title ?? "",
    badge: initial?.badge ?? "",
    role: initial?.role ?? "",
    org: initial?.org ?? "",
    summary: initial?.summary ?? "",
    overview: initial?.overview ?? "",
    problem: initial?.problem ?? "",
    contribution: initial?.contribution ?? "",
    challenges: initial?.challenges ?? "",
    outcomes: initial?.outcomes ?? "",
    stack: (initial?.stack ?? []).join(", "),
    liveUrl: initial?.liveUrl ?? "",
    repoUrl: initial?.repoUrl ?? "",
    caseStudyUrl: initial?.caseStudyUrl ?? "",
    slug: initial?.slug ?? "",
    published: initial?.published ?? true,
    featured: initial?.featured ?? false,
    confidential: initial?.confidential ?? false,
  })
  const [saving, setSaving] = useState(false)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }))

  async function save() {
    const payload = {
      title: f.title,
      badge: f.badge || undefined,
      role: f.role || undefined,
      org: f.org || undefined,
      summary: f.summary,
      overview: f.overview || undefined,
      problem: f.problem || undefined,
      contribution: f.contribution || undefined,
      challenges: f.challenges || undefined,
      outcomes: f.outcomes || undefined,
      stack: f.stack.split(",").map((s) => s.trim()).filter(Boolean),
      liveUrl: f.liveUrl,
      repoUrl: f.repoUrl,
      caseStudyUrl: f.caseStudyUrl,
      slug: f.slug || undefined,
      published: f.published,
      featured: f.featured,
      confidential: f.confidential,
    }
    const parsed = projectInput.safeParse(payload)
    if (!parsed.success) {
      onError(parsed.error.issues[0]?.message ?? "Please check the form")
      return
    }
    setSaving(true)
    try {
      const saved = initial
        ? await apiSend<Project>(`/api/projects/${initial.id}`, "PATCH", parsed.data)
        : await apiSend<Project>("/api/projects", "POST", parsed.data)
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
        <Field label="Title">
          <input {...text("title")} />
        </Field>
        <Field label="Badge (short label)" help="e.g. Founder, Team Lead">
          <input {...text("badge")} />
        </Field>
        <Field label="Role">
          <input {...text("role")} />
        </Field>
        <Field label="Organization">
          <input {...text("org")} />
        </Field>
        <Field label="Summary (card + hero)" help="One or two sentences." full>
          <textarea rows={2} {...text("summary")} />
        </Field>
        <Field label="Overview" full>
          <textarea rows={3} {...text("overview")} />
        </Field>
        <Field label="The problem" full>
          <textarea rows={3} {...text("problem")} />
        </Field>
        <Field label="My role / contribution" full>
          <textarea rows={3} {...text("contribution")} />
        </Field>
        <Field label="Key challenge" full>
          <textarea rows={3} {...text("challenges")} />
        </Field>
        <Field label="Outcome" full>
          <textarea rows={3} {...text("outcomes")} />
        </Field>
        <Field label="Tech stack (comma-separated)" full>
          <input {...text("stack")} />
        </Field>
        <Field label="Live URL">
          <input {...text("liveUrl")} />
        </Field>
        <Field label="Repo URL">
          <input {...text("repoUrl")} />
        </Field>
        <Field label="Case-study URL">
          <input {...text("caseStudyUrl")} />
        </Field>
        <Field label="Slug" help="URL id — auto from title if blank">
          <input {...text("slug")} />
        </Field>
        <Field label="Status & visibility" full>
          <div className="flex flex-wrap gap-5 pt-1">
            <Checkbox label="Published" checked={f.published} onChange={(v) => set("published", v)} />
            <Checkbox
              label="Feature on home page"
              checked={f.featured}
              onChange={(v) => set("featured", v)}
            />
            <Checkbox
              label="Confidential (hide links)"
              checked={f.confidential}
              onChange={(v) => set("confidential", v)}
            />
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
