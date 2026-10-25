"use client"

import { useMemo, useState, type ReactNode } from "react"
import type { Post } from "@prisma/client"
import { Check, Copy, Plus, Trash2 } from "lucide-react"
import { Field, Checkbox, controlClass, labelClass } from "./field"
import { RichTextEditor } from "./rte"
import { postInput, type PostSource } from "@/lib/validation"
import { apiSend } from "@/lib/admin-fetch"
import { bodyStats, buildArticleJsonLd, keywordPlacement, postSources, postStatus, postUrl } from "@/lib/post-utils"
import { fmtDateTime } from "@/lib/format"
import { slugify } from "@/lib/slug"
import { cn } from "@/lib/utils"

// <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm" in the viewer's local
// time; the value is converted back to an ISO instant before it is sent.
function toDateTimeInput(d: Date | string | null | undefined): string {
  if (!d) return ""
  const dt = typeof d === "string" ? new Date(d) : d
  if (Number.isNaN(dt.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`
}
const toInstant = (local: string): string | undefined => {
  if (!local) return undefined
  const dt = new Date(local)
  return Number.isNaN(dt.getTime()) ? undefined : dt.toISOString()
}

const splitList = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)

// Google truncates around these lengths; the counters go amber past them.
const SEO_TITLE_MAX = 60
const SEO_DESC_MAX = 160

const POST_TYPES = ["Explainer", "Story", "Guide", "Note", "Opinion"]

type Props = {
  initial?: Post | null
  /** Every post (for hub / related pickers). */
  others?: Post[]
  onCancel: () => void
  onSaved: (p: Post) => void
  onError: (msg: string) => void
}

export function PostForm({ initial, others = [], onCancel, onSaved, onError }: Props) {
  const [f, setF] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    publishedAt: toDateTimeInput(initial?.publishedAt),
    tags: (initial?.tags ?? []).join(", "),
    excerpt: initial?.excerpt ?? "",
    coverImage: initial?.coverImage ?? "",
    coverAlt: initial?.coverAlt ?? "",
    category: initial?.category ?? "",
    postType: initial?.postType ?? "",
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
    primaryKeyword: initial?.primaryKeyword ?? "",
    keywords: (initial?.keywords ?? []).join(", "),
    canonicalUrl: initial?.canonicalUrl ?? "",
    hubSlug: initial?.hubSlug ?? "",
    relatedSlugs: (initial?.relatedSlugs ?? []).join(", "),
    shareText: initial?.shareText ?? "",
    published: initial?.published ?? false,
    featured: initial?.featured ?? false,
  })
  const [body, setBody] = useState(initial?.body ?? "")
  const [sources, setSources] = useState<PostSource[]>(initial ? postSources(initial) : [])
  const [saving, setSaving] = useState(false)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }))

  const effectiveSlug = f.slug || slugify(f.title)
  const stats = useMemo(() => bodyStats(body), [body])
  const placement = useMemo(
    () =>
      keywordPlacement(f.primaryKeyword, {
        title: f.title,
        slug: effectiveSlug,
        seoDescription: f.seoDescription,
        body,
        tags: splitList(f.tags),
      }),
    [f.primaryKeyword, f.title, effectiveSlug, f.seoDescription, body, f.tags],
  )
  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        buildArticleJsonLd({
          slug: effectiveSlug || "slug",
          title: f.title,
          seoTitle: f.seoTitle,
          seoDescription: f.seoDescription,
          excerpt: f.excerpt,
          coverImage: f.coverImage,
          publishedAt: f.publishedAt || null,
          updatedAt: initial?.updatedAt ?? null,
          primaryKeyword: f.primaryKeyword,
          keywords: splitList(f.keywords),
          tags: splitList(f.tags),
          category: f.category,
          wordCount: stats.wordCount,
          canonicalUrl: f.canonicalUrl,
        }),
        null,
        2,
      ),
    [f, body, stats.wordCount, effectiveSlug, initial?.updatedAt],
  )

  const bySlug = useMemo(() => new Map(others.map((p) => [p.slug, p])), [others])
  const otherSlugs = others.filter((p) => p.id !== initial?.id).map((p) => p.slug)
  const linkStatus = (slug: string): "ok" | "draft" | "missing" => {
    const p = bySlug.get(slug)
    return !p ? "missing" : postStatus(p) === "live" ? "ok" : "draft"
  }

  async function save() {
    const payload = {
      title: f.title,
      slug: f.slug || undefined,
      excerpt: f.excerpt,
      body,
      coverImage: f.coverImage,
      coverAlt: f.coverAlt,
      tags: splitList(f.tags),
      featured: f.featured,
      published: f.published,
      publishedAt: toInstant(f.publishedAt),
      category: f.category,
      postType: f.postType,
      seoTitle: f.seoTitle,
      seoDescription: f.seoDescription,
      primaryKeyword: f.primaryKeyword,
      keywords: splitList(f.keywords),
      canonicalUrl: f.canonicalUrl,
      hubSlug: f.hubSlug.trim(),
      relatedSlugs: splitList(f.relatedSlugs),
      sources: sources.filter((s) => s.label.trim() || s.url.trim()),
      shareText: f.shareText,
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
      <Section title="Content">
        <Field label="Title" full>
          <input {...text("title")} />
        </Field>
        <Field label="Slug" help={f.slug ? undefined : `auto: /blog/${effectiveSlug || "…"}`}>
          <input {...text("slug")} placeholder={effectiveSlug} />
        </Field>
        <Field
          label="Publish date & time"
          help="Your local time. A future time schedules the post: it goes live then, automatically. Leave empty to publish immediately on save."
        >
          <input type="datetime-local" {...text("publishedAt")} />
        </Field>
        <Field label="Excerpt" help="Shown in the list and as the lede. Also the fallback meta description." full>
          <textarea rows={2} {...text("excerpt")} />
        </Field>
        <Field label="Body" full>
          <RichTextEditor value={body} onChange={setBody} placeholder="Write your post…" />
          <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
            {stats.wordCount.toLocaleString()} words · {stats.readingMinutes} min read
          </p>
        </Field>
        <Field label="Tags (comma-separated)" help="Rendered as #tags; also fed into JSON-LD keywords." full>
          <input {...text("tags")} />
        </Field>
      </Section>

      <Section title="Cover image">
        <Field label="Cover image URL" help="Shown on the list, at the top of the post, and as the social share image.">
          <input {...text("coverImage")} placeholder="https://…/cover.png" />
        </Field>
        <Field label="Cover alt text" help="Describe the image. Search engines and screen readers read this.">
          <input {...text("coverAlt")} />
        </Field>
        {f.coverImage && (
          <div className="col-span-full overflow-hidden rounded border border-border bg-secondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.coverImage} alt={f.coverAlt} className="max-h-[200px] w-full object-cover" />
          </div>
        )}
      </Section>

      <Section title="SEO">
        <Field label="SEO title" help="Overrides the title in search results (optional).">
          <Counted value={f.seoTitle} max={SEO_TITLE_MAX}>
            <input {...text("seoTitle")} placeholder={f.title} />
          </Counted>
        </Field>
        <Field label="Primary keyword" help="The one phrase this post should rank for.">
          <input {...text("primaryKeyword")} placeholder="e.g. idempotency in payment systems" />
        </Field>
        <Field label="Meta description" help="Aim for 120–160 characters. Falls back to the excerpt." full>
          <Counted value={f.seoDescription} max={SEO_DESC_MAX}>
            <textarea rows={2} {...text("seoDescription")} />
          </Counted>
        </Field>
        <Field label="Secondary keywords (comma-separated)" help="Use them naturally in H2s and body.">
          <input {...text("keywords")} />
        </Field>
        <Field label="Canonical URL" help="Only if this post was first published elsewhere.">
          <input {...text("canonicalUrl")} placeholder="https://" />
        </Field>
        {placement.length > 0 && (
          <div className="col-span-full rounded border border-border bg-card px-3.5 py-3">
            <p className={labelClass}>Primary keyword placement</p>
            <ul className="grid grid-cols-3 gap-x-4 gap-y-1 text-[13px] max-sm:grid-cols-2">
              {placement.map((p) => (
                <li key={p.where} className={cn("flex items-center gap-1.5", p.ok ? "text-foreground" : "text-muted-foreground")}>
                  <span className={cn("font-mono", p.ok ? "text-emerald-600" : "text-amber-600")}>{p.ok ? "✓" : "–"}</span>
                  {p.where}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Title, slug, meta, opening sentence, one H2 and the tags is a natural density. Do not force more.
            </p>
          </div>
        )}
        <div className="col-span-full rounded border border-border bg-card px-3.5 py-3">
          <p className={labelClass}>Search preview</p>
          <p className="truncate text-[18px] leading-tight text-[#1a0dab] dark:text-[#8ab4f8]">
            {(f.seoTitle || f.title || "Post title") + " | Henson Kudi Amah"}
          </p>
          <p className="truncate font-mono text-xs text-emerald-700 dark:text-emerald-400">{postUrl(effectiveSlug || "…")}</p>
          <p className="line-clamp-2 text-[13px] text-ink-soft">
            {f.seoDescription || f.excerpt || "Meta description appears here."}
          </p>
        </div>
      </Section>

      <Section title="Taxonomy">
        <Field label="Category / cluster" help="e.g. Money-moving systems">
          <input {...text("category")} list="post-categories" />
          <datalist id="post-categories">
            {Array.from(new Set(others.map((p) => p.category).filter(Boolean))).map((c) => (
              <option key={c as string} value={c as string} />
            ))}
          </datalist>
        </Field>
        <Field label="Type" help="Explainer, Story, Guide…">
          <input {...text("postType")} list="post-types" />
          <datalist id="post-types">
            {POST_TYPES.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </Field>
      </Section>

      <Section
        title="Internal links"
        intro="Slugs of other posts. A link only renders once its target is published, so you can wire up a hub before it ships."
      >
        <Field label="Hub post (up)" help="The pillar post this one sits under.">
          <input {...text("hubSlug")} list="post-slugs" placeholder="crypto-custody-architecture" />
          <LinkStatus slugs={f.hubSlug ? [f.hubSlug.trim()] : []} status={linkStatus} />
        </Field>
        <Field label="Related posts (across / down, comma-separated)">
          <input {...text("relatedSlugs")} list="post-slugs" />
          <LinkStatus slugs={splitList(f.relatedSlugs)} status={linkStatus} />
        </Field>
        <datalist id="post-slugs">
          {otherSlugs.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        {initial && others.some((p) => p.hubSlug === initial.slug) && (
          <p className="col-span-full text-xs text-muted-foreground">
            Posts that use this one as their hub (auto-linked below the article):{" "}
            {others
              .filter((p) => p.hubSlug === initial.slug)
              .map((p) => p.slug)
              .join(", ")}
          </p>
        )}
      </Section>

      <Section title="Sources cited" intro="Public documents referenced in the post. Rendered as a list after the article.">
        <div className="col-span-full flex flex-col gap-2">
          {sources.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] gap-2 max-sm:grid-cols-1">
              <input
                className={controlClass}
                placeholder="Label — e.g. Stripe — Idempotent requests"
                value={s.label}
                onChange={(e) => setSources((l) => l.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              />
              <input
                className={controlClass}
                placeholder="https://"
                value={s.url}
                onChange={(e) => setSources((l) => l.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
              />
              <button
                type="button"
                aria-label="Remove source"
                onClick={() => setSources((l) => l.filter((_, j) => j !== i))}
                className="grid h-10 w-10 place-items-center rounded border border-border text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSources((l) => [...l, { label: "", url: "" }])}
            className="inline-flex w-fit items-center gap-1.5 rounded border border-border px-3 py-1.5 text-sm transition-colors hover:border-foreground"
          >
            <Plus className="h-4 w-4" /> Add source
          </button>
        </div>
      </Section>

      <Section title="Share" intro="Not shown on the site. Kept here so the LinkedIn post and structured data travel with the article.">
        <Field label="Share text (LinkedIn etc.)" full>
          <textarea rows={6} {...text("shareText")} />
          <CopyButton text={f.shareText} label="Copy share text" />
        </Field>
        <Field label="JSON-LD (generated from the fields above; emitted automatically on the page)" full>
          <pre className="max-h-[220px] overflow-auto rounded border border-border bg-card px-3.5 py-3 font-mono text-[12px] leading-5 text-ink-soft">
            {jsonLd}
          </pre>
          <CopyButton text={jsonLd} label="Copy JSON-LD" />
        </Field>
      </Section>

      <Section title="Status & visibility">
        <div className="col-span-full flex flex-wrap gap-5 pt-1">
          <Checkbox label="Published" checked={f.published} onChange={(v) => set("published", v)} />
          <Checkbox label="Feature on home page" checked={f.featured} onChange={(v) => set("featured", v)} />
        </div>
        <PublishStatus published={f.published} publishedAt={f.publishedAt} />
      </Section>

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

function Section({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="mb-7">
      <h4 className="mb-1 font-serif text-base">{title}</h4>
      {intro && <p className="mb-3 text-xs text-muted-foreground">{intro}</p>}
      {!intro && <div className="mb-3" />}
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">{children}</div>
    </section>
  )
}

// Character counter under a control; amber once it passes the recommended max.
function Counted({ value, max, children }: { value: string; max: number; children: ReactNode }) {
  const n = value.length
  return (
    <div>
      {children}
      <p className={cn("mt-1 text-right font-mono text-[11px]", n > max ? "text-amber-600" : "text-muted-foreground")}>
        {n}/{max}
      </p>
    </div>
  )
}

// Plain-language readout of what saving will do, so scheduling is never a surprise.
function PublishStatus({ published, publishedAt }: { published: boolean; publishedAt: string }) {
  const at = publishedAt ? new Date(publishedAt) : null
  const status = postStatus({ published, publishedAt: at })
  let text: string
  let tone = "text-muted-foreground"
  if (status === "draft") text = "Draft — hidden from the site, feeds and sitemap."
  else if (status === "scheduled") {
    const hours = Math.max(1, Math.round((at!.getTime() - Date.now()) / 36e5))
    const when = hours < 48 ? `in about ${hours} hour${hours === 1 ? "" : "s"}` : `in ${Math.round(hours / 24)} days`
    text = `Scheduled — goes live ${fmtDateTime(at)} (${when}). Until then it is hidden everywhere, like a draft.`
    tone = "text-sky-700 dark:text-sky-400"
  } else {
    text = at ? `Live — dated ${fmtDateTime(at)}.` : "Live immediately on save — the date will be set to now."
    tone = "text-emerald-700 dark:text-emerald-400"
  }
  return <p className={cn("col-span-full font-mono text-[12px]", tone)}>{text}</p>
}

function LinkStatus({ slugs, status }: { slugs: string[]; status: (s: string) => "ok" | "draft" | "missing" }) {
  if (slugs.length === 0) return null
  const label = { ok: "live", draft: "not live yet (draft or scheduled)", missing: "no post with this slug yet" }
  return (
    <ul className="mt-1.5 flex flex-col gap-0.5 font-mono text-[11px]">
      {slugs.map((s) => {
        const st = status(s)
        return (
          <li key={s} className={cn(st === "ok" ? "text-emerald-600" : st === "draft" ? "text-amber-600" : "text-muted-foreground")}>
            {s} · {label[st]}
          </li>
        )
      })}
    </ul>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setDone(true)
          setTimeout(() => setDone(false), 1500)
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="mt-2 inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs transition-colors hover:border-foreground disabled:opacity-50"
    >
      {done ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : label}
    </button>
  )
}
