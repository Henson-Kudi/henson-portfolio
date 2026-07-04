"use client"

import { useState } from "react"
import type { Project } from "@prisma/client"
import { toast } from "sonner"
import { Star, Eye, EyeOff, Pencil, Trash2, GripVertical, Plus } from "lucide-react"
import { Drawer } from "./drawer"
import { ProjectForm } from "./project-form"
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

export function ProjectsManager({ initial }: { initial: Project[] }) {
  const [items, setItems] = useState<Project[]>(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  function startNew() {
    setEditing(null)
    setOpen(true)
  }
  function startEdit(p: Project) {
    setEditing(p)
    setOpen(true)
  }

  function onSaved(saved: Project) {
    setItems((list) => {
      const exists = list.some((p) => p.id === saved.id)
      const next = exists ? list.map((p) => (p.id === saved.id ? saved : p)) : [...list, saved]
      return next.sort((a, b) => a.order - b.order)
    })
    setOpen(false)
    toast.success(editing ? "Saved" : "Project created")
  }

  async function patch(p: Project, data: Partial<Project>) {
    const prev = items
    setItems((list) => list.map((x) => (x.id === p.id ? { ...x, ...data } : x)))
    try {
      await apiSend<Project>(`/api/projects/${p.id}`, "PATCH", data)
    } catch (e) {
      setItems(prev)
      toast.error(e instanceof Error ? e.message : "Update failed")
    }
  }

  async function remove(p: Project) {
    if (!confirm(`Delete “${p.title}”? This cannot be undone.`)) return
    const prev = items
    setItems((list) => list.filter((x) => x.id !== p.id))
    try {
      await apiSend(`/api/projects/${p.id}`, "DELETE")
      toast.success("Deleted")
    } catch (e) {
      setItems(prev)
      toast.error(e instanceof Error ? e.message : "Delete failed")
    }
  }

  async function persistOrder(list: Project[]) {
    try {
      await apiSend("/api/projects/reorder", "POST", { ids: list.map((p) => p.id) })
      toast.success("Order saved")
    } catch {
      toast.error("Could not save order")
    }
  }

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Drag the handle to reorder — order here is the order on the site. The star features a
          project on the home page; the eye toggles draft/published.
        </p>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex shrink-0 items-center gap-1.5 rounded bg-foreground px-4 py-2 text-sm text-background transition-colors hover:bg-brand"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded border border-border bg-card px-4 py-12 text-center font-mono text-[13px] text-muted-foreground">
          No projects yet. Click “New project”.
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
                  {[p.role, p.org].filter(Boolean).join(" · ")} &nbsp;/&nbsp; {p.stack.length} tech
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
                <IconBtn title="Edit" onClick={() => startEdit(p)}>
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

      <Drawer open={open} title={editing ? "Edit project" : "New project"} onClose={() => setOpen(false)}>
        {open && (
          <ProjectForm
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
