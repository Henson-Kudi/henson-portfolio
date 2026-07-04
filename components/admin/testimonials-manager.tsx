"use client"

import { useState } from "react"
import type { Testimonial } from "@prisma/client"
import { toast } from "sonner"
import { Eye, EyeOff, Pencil, Trash2, GripVertical, Plus } from "lucide-react"
import { Drawer } from "./drawer"
import { TestimonialForm } from "./testimonial-form"
import { StatusPill } from "./pills"
import { IconBtn } from "./icon-btn"
import { apiSend } from "@/lib/admin-fetch"
import { cn } from "@/lib/utils"

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const [items, setItems] = useState<Testimonial[]>(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  function onSaved(saved: Testimonial) {
    setItems((list) => {
      const exists = list.some((t) => t.id === saved.id)
      const next = exists ? list.map((t) => (t.id === saved.id ? saved : t)) : [...list, saved]
      return next.sort((a, b) => a.order - b.order)
    })
    setOpen(false)
    toast.success(editing ? "Saved" : "Testimonial added")
  }

  async function patch(t: Testimonial, data: Partial<Testimonial>) {
    const prev = items
    setItems((list) => list.map((x) => (x.id === t.id ? { ...x, ...data } : x)))
    try {
      await apiSend<Testimonial>(`/api/testimonials/${t.id}`, "PATCH", data)
    } catch (e) {
      setItems(prev)
      toast.error(e instanceof Error ? e.message : "Update failed")
    }
  }

  async function remove(t: Testimonial) {
    if (!confirm(`Delete this testimonial from ${t.authorName}?`)) return
    const prev = items
    setItems((list) => list.filter((x) => x.id !== t.id))
    try {
      await apiSend(`/api/testimonials/${t.id}`, "DELETE")
      toast.success("Deleted")
    } catch (e) {
      setItems(prev)
      toast.error(e instanceof Error ? e.message : "Delete failed")
    }
  }

  async function persistOrder(list: Testimonial[]) {
    try {
      await apiSend("/api/testimonials/reorder", "POST", { ids: list.map((t) => t.id) })
      toast.success("Order saved")
    } catch {
      toast.error("Could not save order")
    }
  }

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Published testimonials appear on the home page. Drag to reorder.
        </p>
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded bg-foreground px-4 py-2 text-sm text-background transition-colors hover:bg-brand"
        >
          <Plus className="h-4 w-4" /> New testimonial
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded border border-border bg-card px-4 py-12 text-center font-mono text-[13px] text-muted-foreground">
          No testimonials yet. Add real quotes from clients or teammates.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((t, i) => (
            <div
              key={t.id}
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
                  <span className="truncate">{t.authorName}</span>
                  <StatusPill published={t.published} />
                </h3>
                <div className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                  {[t.authorRole, t.authorCompany].filter(Boolean).join(" · ")}
                  {(t.authorRole || t.authorCompany) && " — "}“{t.quote}”
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <IconBtn
                  on={t.published}
                  title={t.published ? "Published — click to hide" : "Hidden — click to publish"}
                  onClick={() => patch(t, { published: !t.published })}
                >
                  {t.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </IconBtn>
                <IconBtn title="Edit" onClick={() => { setEditing(t); setOpen(true) }}>
                  <Pencil className="h-4 w-4" />
                </IconBtn>
                <IconBtn title="Delete" onClick={() => remove(t)}>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer
        open={open}
        title={editing ? "Edit testimonial" : "New testimonial"}
        onClose={() => setOpen(false)}
      >
        {open && (
          <TestimonialForm
            initial={editing}
            onCancel={() => setOpen(false)}
            onSaved={onSaved}
            onError={(m) => toast.error(m)}
          />
        )}
      </Drawer>
    </>
  )
}
