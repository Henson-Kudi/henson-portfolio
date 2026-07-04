"use client"

import { useState } from "react"
import type { SeoSettings } from "@prisma/client"
import { toast } from "sonner"
import { Field, controlClass } from "./field"
import { seoInput } from "@/lib/validation"
import { apiSend } from "@/lib/admin-fetch"

export function SeoForm({ initial }: { initial: SeoSettings | null }) {
  const [f, setF] = useState({
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    keywords: (initial?.keywords ?? []).join(", "),
    author: initial?.author ?? "",
    ogImage: initial?.ogImage ?? "",
    canonicalUrl: initial?.canonicalUrl ?? "",
    twitterHandle: initial?.twitterHandle ?? "",
  })
  const [saving, setSaving] = useState(false)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }))

  async function save() {
    const payload = {
      metaTitle: f.metaTitle,
      metaDescription: f.metaDescription,
      keywords: f.keywords.split(",").map((s) => s.trim()).filter(Boolean),
      author: f.author || undefined,
      ogImage: f.ogImage,
      canonicalUrl: f.canonicalUrl,
      twitterHandle: f.twitterHandle || undefined,
    }
    const parsed = seoInput.safeParse(payload)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form")
      return
    }
    setSaving(true)
    try {
      await apiSend("/api/seo", "PUT", parsed.data)
      toast.success("SEO saved — live on the home page now")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save")
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
    <div className="max-w-3xl">
      <p className="mb-6 rounded border border-brand/30 bg-brand/5 px-4 py-3.5 text-sm text-ink-soft">
        These control the <span className="text-foreground">home page</span> title, search snippet
        and social preview. Save here and the live pages pick them up instantly — <b>no redeploy</b>.
      </p>

      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <Field label="Page title (title / og:title)" help="Aim for 50–60 characters." full>
          <input {...text("metaTitle")} />
        </Field>
        <Field label="Meta description" help="Aim for 150–160 characters." full>
          <textarea rows={3} {...text("metaDescription")} />
        </Field>
        <Field label="Keywords (comma-separated)" full>
          <textarea rows={2} {...text("keywords")} />
        </Field>
        <Field label="Author">
          <input {...text("author")} />
        </Field>
        <Field label="Canonical URL">
          <input {...text("canonicalUrl")} />
        </Field>
        <Field label="OG image URL" help="Social share image (optional)">
          <input {...text("ogImage")} />
        </Field>
        <Field label="Twitter handle" help="e.g. @henson">
          <input {...text("twitterHandle")} />
        </Field>
      </div>

      <div className="mt-7 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        Search preview
      </div>
      <div className="mt-3 max-w-xl rounded border border-border bg-card p-5">
        <div className="font-sans text-lg text-blue-700 dark:text-blue-400">
          {f.metaTitle || "Page title"}
        </div>
        <div className="my-1 text-[13px] text-emerald-700 dark:text-emerald-500">
          {f.canonicalUrl || "https://amahkudi.dev"}
        </div>
        <div className="text-[13px] text-ink-soft">
          {(f.metaDescription || "Meta description").slice(0, 160)}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded bg-foreground px-5 py-2.5 text-sm text-background transition-colors hover:bg-brand disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save SEO settings"}
        </button>
      </div>
    </div>
  )
}
