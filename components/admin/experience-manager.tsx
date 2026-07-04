"use client"

import { useState } from "react"
import type { Experience } from "@prisma/client"
import { toast } from "sonner"
import { Eye, EyeOff, Pencil, Trash2, Plus } from "lucide-react"
import { Drawer } from "./drawer"
import { ExperienceForm } from "./experience-form"
import { StatusPill } from "./pills"
import { IconBtn } from "./icon-btn"
import { apiSend } from "@/lib/admin-fetch"
import { fmtPeriod } from "@/lib/format"

function sortByStart(a: Experience, b: Experience) {
  return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
}

export function ExperienceManager({ initial }: { initial: Experience[] }) {
  const [items, setItems] = useState<Experience[]>(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Experience | null>(null)

  function onSaved(saved: Experience) {
    setItems((list) => {
      const exists = list.some((x) => x.id === saved.id)
      const next = exists ? list.map((x) => (x.id === saved.id ? saved : x)) : [...list, saved]
      return next.sort(sortByStart)
    })
    setOpen(false)
    toast.success(editing ? "Saved" : "Experience added")
  }

  async function patch(x: Experience, data: Partial<Experience>) {
    const prev = items
    setItems((list) => list.map((i) => (i.id === x.id ? { ...i, ...data } : i)))
    try {
      await apiSend<Experience>(`/api/experience/${x.id}`, "PATCH", data)
    } catch (e) {
      setItems(prev)
      toast.error(e instanceof Error ? e.message : "Update failed")
    }
  }

  async function remove(x: Experience) {
    if (!confirm(`Delete “${x.role} · ${x.company}”?`)) return
    const prev = items
    setItems((list) => list.filter((i) => i.id !== x.id))
    try {
      await apiSend(`/api/experience/${x.id}`, "DELETE")
      toast.success("Deleted")
    } catch (e) {
      setItems(prev)
      toast.error(e instanceof Error ? e.message : "Delete failed")
    }
  }

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Drives the homepage timeline and your generated CV. Sorted by start date automatically.
        </p>
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded bg-foreground px-4 py-2 text-sm text-background transition-colors hover:bg-brand"
        >
          <Plus className="h-4 w-4" /> New role
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded border border-border bg-card px-4 py-12 text-center font-mono text-[13px] text-muted-foreground">
          No experience yet. Click “New role”.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((x) => (
            <div
              key={x.id}
              className="grid grid-cols-[1fr_auto] items-center gap-3.5 rounded border border-border bg-card px-4 py-3.5"
            >
              <div className="min-w-0">
                <h3 className="flex flex-wrap items-center gap-2 font-serif text-base">
                  <span className="truncate">{x.role}</span>
                  <StatusPill published={x.published} />
                </h3>
                <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {[x.company, x.location].filter(Boolean).join(" · ")} &nbsp;/&nbsp;{" "}
                  {fmtPeriod(x.startDate, x.endDate)}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <IconBtn
                  on={x.published}
                  title={x.published ? "Published — click to hide" : "Hidden — click to publish"}
                  onClick={() => patch(x, { published: !x.published })}
                >
                  {x.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </IconBtn>
                <IconBtn title="Edit" onClick={() => { setEditing(x); setOpen(true) }}>
                  <Pencil className="h-4 w-4" />
                </IconBtn>
                <IconBtn title="Delete" onClick={() => remove(x)}>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer open={open} title={editing ? "Edit role" : "New role"} onClose={() => setOpen(false)}>
        {open && (
          <ExperienceForm
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
