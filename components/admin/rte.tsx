"use client"

import { useEffect, useRef } from "react"
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link2, Eraser } from "lucide-react"

// Lightweight contenteditable rich-text editor (matches the design's toolbar).
// Emits HTML via onChange. Uses document.execCommand — deprecated but works in
// every browser and is fine for a single-author admin.
const TOOLS = [
  { cmd: "bold", icon: Bold, run: () => document.execCommand("bold") },
  { cmd: "italic", icon: Italic, run: () => document.execCommand("italic") },
  { sep: true },
  { cmd: "h2", icon: Heading2, run: () => document.execCommand("formatBlock", false, "h2") },
  { cmd: "h3", icon: Heading3, run: () => document.execCommand("formatBlock", false, "h3") },
  { cmd: "ul", icon: List, run: () => document.execCommand("insertUnorderedList") },
  { cmd: "ol", icon: ListOrdered, run: () => document.execCommand("insertOrderedList") },
  { cmd: "quote", icon: Quote, run: () => document.execCommand("formatBlock", false, "blockquote") },
  { sep: true },
  {
    cmd: "link",
    icon: Link2,
    run: () => {
      const url = prompt("Link URL:", "https://")
      if (url) document.execCommand("createLink", false, url)
    },
  },
  { cmd: "clear", icon: Eraser, run: () => document.execCommand("formatBlock", false, "p") },
] as const

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Seed the editable div once (uncontrolled thereafter to preserve the caret).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || ""
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sync = () => onChange(ref.current?.innerHTML ?? "")

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t border border-b-0 border-border bg-secondary p-2">
        {TOOLS.map((t, i) =>
          "sep" in t ? (
            <span key={i} className="mx-1 w-px bg-border" />
          ) : (
            <button
              key={t.cmd}
              type="button"
              title={t.cmd}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                ref.current?.focus()
                t.run()
                sync()
              }}
              className="grid h-8 w-8 place-items-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <t.icon className="h-4 w-4" />
            </button>
          ),
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        data-placeholder={placeholder}
        className="prose-editor min-h-[260px] rounded-b border border-border bg-card px-4 py-3.5 text-[15px] leading-7 text-foreground focus:border-brand focus:outline-none"
      />
    </div>
  )
}
