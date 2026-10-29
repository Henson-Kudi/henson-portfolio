import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { liveWhere } from "@/lib/repositories/posts"
import { AdminHeader } from "@/components/admin/admin-header"
import { IndexNowButton } from "@/components/admin/indexnow-button"

export const dynamic = "force-dynamic"

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded border border-border bg-card p-5">
      <div className="font-serif text-3xl">{value}</div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </div>
    </div>
  )
}

export default async function AdminDashboard() {
  const [projPublished, projFeatured, postPublished, projDrafts, postDrafts, featured] =
    await Promise.all([
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { published: true, featured: true } }),
      prisma.post.count({ where: liveWhere() }),
      prisma.project.count({ where: { published: false } }),
      prisma.post.count({ where: { NOT: liveWhere() } }),
      prisma.project.findMany({
        where: { published: true, featured: true },
        orderBy: { order: "asc" },
        select: { id: true, title: true, role: true },
      }),
    ])

  return (
    <>
      <AdminHeader title="Dashboard" sub="Overview of your content" />
      <div className="max-w-5xl px-8 py-7">
        <div className="grid grid-cols-4 gap-3.5 max-sm:grid-cols-2">
          <Stat value={projPublished} label="Published projects" />
          <Stat value={projFeatured} label="Featured on home" />
          <Stat value={postPublished} label="Live posts" />
          <Stat value={projDrafts + postDrafts} label="Drafts & scheduled" />
        </div>

        <div className="mt-7 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          Quick actions
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {[
            { href: "/admin/projects", label: "Manage projects" },
            { href: "/admin/posts", label: "Manage posts" },
            { href: "/admin/experience", label: "Manage experience" },
            { href: "/admin/seo", label: "Edit SEO" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-foreground"
            >
              {a.label}
            </Link>
          ))}
        </div>

        <div className="mt-7 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          Search engines
        </div>
        <div className="mt-3">
          <IndexNowButton />
          <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-muted-foreground">
            Saving a live post or project already notifies Bing (IndexNow). Use this after a scheduled post goes
            live, or after editing the Hire or About copy. Google is separate: request indexing in Search Console.
          </p>
        </div>

        <div className="mt-7 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          On the home page now
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {featured.length === 0 ? (
            <div className="rounded border border-border bg-card px-4 py-8 text-center font-mono text-[13px] text-muted-foreground">
              No featured projects — star a few in Projects.
            </div>
          ) : (
            featured.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded border border-border bg-card px-4 py-3.5"
              >
                <div>
                  <h3 className="flex items-center gap-2 font-serif text-lg">
                    {p.title}
                    <span className="rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.05em] text-brand">
                      featured
                    </span>
                  </h3>
                  {p.role && <div className="font-mono text-xs text-muted-foreground">{p.role}</div>}
                </div>
                <Link
                  href="/admin/projects"
                  className="rounded border border-border px-3 py-1.5 text-sm transition-colors hover:border-foreground"
                >
                  Edit
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
