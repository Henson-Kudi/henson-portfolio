import Link from "next/link"

export function Pager({
  page,
  totalPages,
  basePath,
}: {
  page: number
  totalPages: number
  basePath: string
}) {
  if (totalPages <= 1) return null
  const href = (n: number) => (n <= 1 ? basePath : `${basePath}?page=${n}`)

  return (
    <div className="mt-12 flex items-center justify-between border-t border-border pt-6 font-mono text-sm">
      {page > 1 ? (
        <Link href={href(page - 1)} className="text-brand hover:underline">
          ← Previous
        </Link>
      ) : (
        <span className="text-muted-foreground/40">← Previous</span>
      )}
      <span className="text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className="text-brand hover:underline">
          Next →
        </Link>
      ) : (
        <span className="text-muted-foreground/40">Next →</span>
      )}
    </div>
  )
}
