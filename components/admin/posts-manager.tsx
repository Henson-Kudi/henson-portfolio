"use client"

import { useState } from "react"
import type { Post } from "@prisma/client"
import { toast } from "sonner"
import { Star, Eye, EyeOff, Pencil, Trash2, GripVertical, Plus } from "lucide-react"
import { Drawer } from "./drawer"
import { PostForm } from "./post-form"
import { StatusPill, FeaturedPill } from "./pills"
import { IconBtn } from "./icon-btn"
import { apiSend } from "@/lib/admin-fetch"
import { cn } from "@/lib/utils"

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "—"
  const dt = typeof d === "string" ? new Date(d) : d
  return Number.isNaN(dt.getTime())
    ? "—"
    : dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function PostsManager({ initial }: { initial: Post[] }) {
  const [items, setItems] = useState<Post[]>(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  function onSaved(saved: Post) {
    setItems((list) => {
      const exists = list.some((p) => p.id === saved.id)
      const next = exists ? list.map((p) => (p.id === saved.id ? saved : p)) : [...list, saved]
      return next.sort((a, b) => a.order - b.order)
    })
    setOpen(false)
    toast.success(editing ? "Saved" : "Post created")
  }

  async function patch(p: Post, data: Partial<Post>) {
    const prev = items
    setItems((list) => list.map((x) => (x.id === p.id ? { ...x, ...data } : x)))
    try {
      await apiSend<Post>(`/api/posts/${p.id}`, "PATCH", data)
    } catch (e) {
      setItems(prev)
      toast.error(e instanceof Error ? e.message : "Update failed")
    }
  }

  async function remove(p: Post) {
    if (!confirm(`Delete “${p.title}”? This cannot be undone.`)) return
    const prev = items
    setItems((list) => list.filter((x) => x.id !== p.id))
    try {
      await apiSend(`/api/posts/${p.id}`, "DELETE")
      toast.success("Deleted")
    } catch (e) {
      setItems(prev)
      toast.error(e instanceof Error ? e.message : "Delete failed")
    }
  }

  async function persistOrder(list: Post[]) {
    try {
      await apiSend("/api/posts/reorder", "POST", { ids: list.map((p) => p.id) })
      toast.success("Order saved")
    } catch {
      toast.error("Could not save order")
    }
  }

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Drafts stay hidden from the site. Featured posts show on the home page; all published
          posts appear under “Writing”. Drag to reorder.
        </p>
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded bg-foreground px-4 py-2 text-sm text-background transition-colors hover:bg-brand"
        >
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded border border-border bg-card px-4 py-12 text-center font-mono text-[13px] text-muted-foreground">
          No posts yet. Click “New post”.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((p, i) => (
            <div
              key={p.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => {
                e.preventDefault()
                if (dragIndex === null || dragIndex === i) return
                setItems((list) => move(list, dragIndex, i))
                setDragIndex(i)
              }}
              onDragEnd={() => {
                setDragIndex(null)
                persistOrder(items)
              }}
              className={cn(
                "grid grid-cols-[24px_1fr_auto] items-center gap-3.5 rounded border border-border bg-card px-4 py-3.5",
                dragIndex === i && "border-brand opacity-50",
              )}
            >
              <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
              <div className="min-w-0">
                <h3 className="flex flex-wrap items-center gap-2 font-serif text-base">
                  <span className="truncate">{p.title}</span>
                  {p.featured && <FeaturedPill />}
                  <StatusPill published={p.published} />
                </h3>
                <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {fmtDate(p.publishedAt)} &nbsp;/&nbsp; {p.tags.length} tags
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <IconBtn
                  on={p.featured}
                  title="Feature on home"
                  onClick={() => patch(p, { featured: !p.featured })}
                >
                  <Star className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  on={p.published}
                  title={p.published ? "Published — click to draft" : "Draft — click to publish"}
                  onClick={() => patch(p, { published: !p.published })}
                >
                  {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </IconBtn>
                <IconBtn title="Edit" onClick={() => { setEditing(p); setOpen(true) }}>
                  <Pencil className="h-4 w-4" />
                </IconBtn>
                <IconBtn title="Delete" onClick={() => remove(p)}>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer open={open} title={editing ? "Edit post" : "New post"} onClose={() => setOpen(false)}>
        {open && (
          <PostForm
            initial={editing}
            others={items}
            onCancel={() => setOpen(false)}
            onSaved={onSaved}
            onError={(m) => toast.error(m)}
          />
        )}
      </Drawer>
    </>
  )
}
