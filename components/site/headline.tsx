// Small text helpers shared by the editorial pages.

export type HeadlineParts = readonly (string | { em: string })[]

// Renders ["plain ", { em: "accent" }, "."] with the accent in italic brand colour.
export function Headline({ parts }: { parts: HeadlineParts }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          p
        ) : (
          <em key={i} className="italic text-brand">
            {p.em}
          </em>
        ),
      )}
    </>
  )
}

// Renders **bold** spans inside a plain string.
export function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}
