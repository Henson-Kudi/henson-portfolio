"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type ClipboardEvent } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Code,
  SquareCode,
  Image as ImageIcon,
  Minus,
  Eraser,
  FileCode2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Lightweight contenteditable rich-text editor. Emits HTML via onChange.
// Uses document.execCommand — deprecated but works in every browser and is
// fine for a single-author admin. Output is rendered on the public post page
// under `.article-body` (see globals.css), so every element this toolbar can
// produce must have a style there: h2/h3, p, a, ul/ol, blockquote, code,
// pre, img/figure, hr.

const exec = (cmd: string, value?: string) => document.execCommand(cmd, false, value)

function closest(node: Node | null, selector: string): HTMLElement | null {
  const el = node instanceof HTMLElement ? node : node?.parentElement
  return el?.closest(selector) ?? null
}

function selectionNode(): Node | null {
  const sel = window.getSelection()
  return sel && sel.rangeCount ? sel.getRangeAt(0).commonAncestorContainer : null
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

// Inline <code>: toggle around the selection. Collapsed selection inserts a placeholder.
function toggleInlineCode() {
  const node = selectionNode()
  const code = closest(node, "code")
  if (code && !code.closest("pre")) {
    const parent = code.parentNode
    if (!parent) return
    while (code.firstChild) parent.insertBefore(code.firstChild, code)
    parent.removeChild(code)
    return
  }
  const sel = window.getSelection()
  const text = sel?.toString() || "code"
  exec("insertHTML", `<code>${escapeHtml(text)}</code>`)
}

// Code block: wrap the current block(s) in <pre>, or unwrap back to <p>.
function toggleCodeBlock() {
  const pre = closest(selectionNode(), "pre")
  exec("formatBlock", pre ? "p" : "pre")
}

function insertImage() {
  const src = prompt("Image URL:", "https://")
  if (!src || src === "https://") return
  const alt = prompt("Alt text (describe the image for search engines and screen readers):", "") ?? ""
  const caption = prompt("Caption (optional):", "") ?? ""
  exec(
    "insertHTML",
    `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />` +
      (caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "") +
      `</figure><p><br></p>`,
  )
}

function insertLink() {
  const existing = closest(selectionNode(), "a") as HTMLAnchorElement | null
  const url = prompt("Link URL:", existing?.href ?? "https://")
  if (url === null) return
  if (!url || url === "https://") {
    if (existing) exec("unlink")
    return
  }
  exec("createLink", url)
}

type Tool =
  | { sep: true }
  | { cmd: string; label: string; icon: typeof Bold; run: () => void; active?: (n: Node | null) => boolean }

const TOOLS: Tool[] = [
  { cmd: "bold", label: "Bold (Ctrl+B)", icon: Bold, run: () => exec("bold") },
  { cmd: "italic", label: "Italic (Ctrl+I)", icon: Italic, run: () => exec("italic") },
  { cmd: "underline", label: "Underline (Ctrl+U)", icon: Underline, run: () => exec("underline") },
  { cmd: "strike", label: "Strikethrough", icon: Strikethrough, run: () => exec("strikeThrough") },
  { sep: true },
  { cmd: "h2", label: "Heading 2", icon: Heading2, run: () => exec("formatBlock", "h2"), active: (n) => !!closest(n, "h2") },
  { cmd: "h3", label: "Heading 3", icon: Heading3, run: () => exec("formatBlock", "h3"), active: (n) => !!closest(n, "h3") },
  { cmd: "ul", label: "Bulleted list", icon: List, run: () => exec("insertUnorderedList") },
  { cmd: "ol", label: "Numbered list", icon: ListOrdered, run: () => exec("insertOrderedList") },
  { cmd: "quote", label: "Quote", icon: Quote, run: () => exec("formatBlock", "blockquote"), active: (n) => !!closest(n, "blockquote") },
  { sep: true },
  { cmd: "code", label: "Inline code", icon: Code, run: toggleInlineCode, active: (n) => !!closest(n, "code") && !closest(n, "pre") },
  { cmd: "pre", label: "Code block (Enter twice to leave)", icon: SquareCode, run: toggleCodeBlock, active: (n) => !!closest(n, "pre") },
  { cmd: "link", label: "Link (empty URL removes it)", icon: Link2, run: insertLink, active: (n) => !!closest(n, "a") },
  { cmd: "image", label: "Image", icon: ImageIcon, run: insertImage },
  { cmd: "hr", label: "Divider", icon: Minus, run: () => exec("insertHorizontalRule") },
  { sep: true },
  { cmd: "clear", label: "Clear formatting → paragraph", icon: Eraser, run: () => { exec("removeFormat"); exec("formatBlock", "p") } },
]

// Pasted HTML from Docs / Word / web pages drags in inline styles, classes and
// span soup. Keep the structure (headings, lists, links, code) and drop the rest.
function cleanPastedHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html")
  doc.querySelectorAll("script, style, meta, link, title").forEach((el) => el.remove())
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const keep =
        (el.tagName === "A" && attr.name === "href") ||
        (el.tagName === "IMG" && (attr.name === "src" || attr.name === "alt"))
      if (!keep) el.removeAttribute(attr.name)
    }
  })
  doc.querySelectorAll("span, font").forEach((el) => {
    const parent = el.parentNode
    if (!parent) return
    while (el.firstChild) parent.insertBefore(el.firstChild, el)
    parent.removeChild(el)
  })
  // Word/Docs emit <b>/<i> for bold/italic; normalise to semantic tags.
  doc.querySelectorAll("b").forEach((el) => el.replaceWith(Object.assign(doc.createElement("strong"), { innerHTML: el.innerHTML })))
  doc.querySelectorAll("i").forEach((el) => el.replaceWith(Object.assign(doc.createElement("em"), { innerHTML: el.innerHTML })))
  return doc.body.innerHTML
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  maxHeight = 560,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  /** Max height (px) of the writing area before it scrolls. */
  maxHeight?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<"visual" | "html">("visual")
  const [activeNode, setActiveNode] = useState<Node | null>(null)

  // Seed the editable div when entering visual mode (uncontrolled thereafter
  // to preserve the caret).
  useEffect(() => {
    if (mode !== "visual") return
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || ""
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const sync = () => onChange(ref.current?.innerHTML ?? "")
  const refreshActive = () => setActiveNode(selectionNode())

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const pre = closest(selectionNode(), "pre")
    if (!pre) return
    if (e.key === "Tab") {
      e.preventDefault()
      exec("insertText", "  ")
      sync()
      return
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const sel = window.getSelection()
      const atEnd =
        sel && sel.isCollapsed && sel.rangeCount
          ? (() => {
              const r = sel.getRangeAt(0).cloneRange()
              r.selectNodeContents(pre)
              r.setStart(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset)
              return r.toString().replace(/\n$/, "") === ""
            })()
          : false
      // Enter on an empty last line leaves the block and starts a paragraph.
      if (atEnd && /\n$/.test(pre.textContent ?? "")) {
        pre.textContent = (pre.textContent ?? "").replace(/\n+$/, "")
        const p = document.createElement("p")
        p.innerHTML = "<br>"
        pre.after(p)
        const range = document.createRange()
        range.setStart(p, 0)
        range.collapse(true)
        sel?.removeAllRanges()
        sel?.addRange(range)
      } else {
        exec("insertText", "\n")
      }
      sync()
    }
  }

  function onPaste(e: ClipboardEvent<HTMLDivElement>) {
    const html = e.clipboardData.getData("text/html")
    const text = e.clipboardData.getData("text/plain")
    const inPre = !!closest(selectionNode(), "pre")
    if (inPre || !html) {
      if (!text) return
      e.preventDefault()
      exec("insertText", text)
    } else {
      e.preventDefault()
      exec("insertHTML", cleanPastedHtml(html))
    }
    sync()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t border border-b-0 border-border bg-secondary p-2">
        {mode === "visual" &&
          TOOLS.map((t, i) =>
            "sep" in t ? (
              <span key={i} className="mx-1 h-5 w-px bg-border" />
            ) : (
              <button
                key={t.cmd}
                type="button"
                title={t.label}
                aria-label={t.label}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  ref.current?.focus()
                  t.run()
                  sync()
                  refreshActive()
                }}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
                  t.active?.(activeNode) && "bg-background text-brand",
                )}
              >
                <t.icon className="h-4 w-4" />
              </button>
            ),
          )}
        <button
          type="button"
          title={mode === "visual" ? "Edit raw HTML" : "Back to visual editor"}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setMode((m) => (m === "visual" ? "html" : "visual"))}
          className={cn(
            "ml-auto inline-flex h-8 items-center gap-1.5 rounded px-2 font-mono text-[11px] uppercase tracking-[0.05em] text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
            mode === "html" && "bg-background text-brand",
          )}
        >
          <FileCode2 className="h-4 w-4" /> HTML
        </button>
      </div>

      {mode === "visual" ? (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          onKeyDown={onKeyDown}
          onKeyUp={refreshActive}
          onMouseUp={refreshActive}
          onPaste={onPaste}
          data-placeholder={placeholder}
          style={{ maxHeight }}
          className="prose-editor min-h-[260px] overflow-y-auto rounded-b border border-border bg-card px-4 py-3.5 text-[15px] leading-7 text-foreground focus:border-brand focus:outline-none"
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          style={{ maxHeight, height: maxHeight }}
          className="min-h-[260px] w-full resize-none rounded-b border border-border bg-card px-4 py-3.5 font-mono text-[13px] leading-6 text-foreground focus:border-brand focus:outline-none"
        />
      )}
    </div>
  )
}
