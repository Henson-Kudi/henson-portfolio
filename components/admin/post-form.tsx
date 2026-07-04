"use client"

import { useState } from "react"
import type { Post } from "@prisma/client"
import { Field, Checkbox, controlClass } from "./field"
import { RichTextEditor } from "./rte"
import { postInput } from "@/lib/validation"
import { apiSend } from "@/lib/admin-fetch"

function toDateInput(d: Date | string | null | undefined): string {
  if (!d) return ""
  const dt = typeof d === "string" ? new Date(d) : d
  return Number.isNaN(dt.getTime()) ? "" : dt.toISOString().slice(0, 10)
}

type Props = {
  initial?: Post | null
  onCancel: () => void
  onSaved: (p: Post) => void
  onError: (msg: string) => void
}

export function PostForm({ initial, onCancel, onSaved, onError }: Props) {
  const [f, setF] = useState({
    title: initial?.title ?? "",
    publishedAt: toDateInput(initial?.publishedAt),
    tags: (initial?.tags ?? []).join(", "),
    excerpt: initial?.excerpt ?? "",
    coverImage: initial?.coverImage ?? "",
    slug: initial?.slug ?? "",
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
    published: initial?.published ?? false,
    featured: initial?.featured ?? false,
  })
  const [body, setBody] = useState(initial?.body ?? "")
  const [saving, setSaving] = useState(false)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }))

  async function save() {
    const payload = {
      title: f.title,
      slug: f.slug || undefined,
      excerpt: f.excerpt || undefined,
      body,
      coverImage: f.coverImage,
      tags: f.tags.split(",").map((s) => s.trim()).filter(Boolean),
      featured: f.featured,
      published: f.published,
      publishedAt: f.publishedAt || undefined,
      seoTitle: f.seoTitle || undefined,
      seoDescription: f.seoDescription || undefined,
    }
    const parsed = postInput.safeParse(payload)
    if (!parsed.success) {
      onError(parsed.error.issues[0]?.message ?? "Please check the form")
      return
    }
    setSaving(true)
    try {
      const saved = initial
        ? await apiSend<Post>(`/api/posts/${initial.id}`, "PATCH", parsed.data)
        : await apiSend<Post>("/api/posts", "POST", parsed.data)
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
        <Field label="Title" full>
          <input {...text("title")} />
        </Field>
        <Field label="Date" help="Displayed publish date">
          <input type="date" {...text("publishedAt")} />
        </Field>
        <Field label="Tags (comma-separated)">
          <input {...text("tags")} />
        </Field>
        <Field label="Excerpt" help="Shown in the list and as the lede." full>
          <textarea rows={2} {...text("excerpt")} />
        </Field>
        <Field label="Body" full>
          <RichTextEditor value={body} onChange={setBody} placeholder="Write your post…" />
        </Field>
        <Field label="Cover image URL">
          <input {...text("coverImage")} />
        </Field>
        <Field label="Slug" help="auto from title if blank">
          <input {...text("slug")} />
        </Field>
        <Field label="SEO title" help="Overrides the post title in search (optional)">
          <input {...text("seoTitle")} />
        </Field>
        <Field label="SEO description" help="optional">
          <input {...text("seoDescription")} />
        </Field>
        <Field label="Status & visibility" full>
          <div className="flex flex-wrap gap-5 pt-1">
            <Checkbox label="Published" checked={f.published} onChange={(v) => set("published", v)} />
            <Checkbox
              label="Feature on home page"
              checked={f.featured}
              onChange={(v) => set("featured", v)}
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
