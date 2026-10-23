import type { Metadata } from "next"
import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"
import { PageHead } from "@/components/site/page-head"
import { ProjectCard } from "@/components/site/project-card"
import { Pager } from "@/components/site/pager"
import { projectsRepo } from "@/lib/repositories/projects"
import { normalizePageParams } from "@/lib/pagination"
import { SITE_URL } from "@/lib/post-utils"

export const dynamic = "force-dynamic"

const description =
  "Backends and products for fintech, payments and crypto — from a VARA-regulated exchange to an offline-first platform for shop owners in Cameroon."

export const metadata: Metadata = {
  title: "Selected work",
  description,
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: { type: "website", url: `${SITE_URL}/projects`, title: "Selected work", description },
}

const wrap = "mx-auto max-w-[1120px] px-10 max-sm:px-6"

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const sp = await searchParams
  const { page, pageSize } = normalizePageParams({ page: sp.page }, { defaultPageSize: 9 })
  const result = await projectsRepo.listPublished({ page, pageSize })

  return (
    <>
      <SiteNav />
      <div className={wrap}>
        <PageHead
          kicker="Selected work"
          title={
            <>
              Things I've <em className="italic text-brand">built &amp; shipped.</em>
            </>
          }
          intro="Backends and products for fintech, payments and crypto — from a VARA-regulated exchange to an offline-first platform for shop owners in Cameroon."
        />
        <div className="py-[60px]">
          {result.items.length === 0 ? (
            <div className="py-20 text-center font-mono text-[13px] text-muted-foreground">
              No published projects yet.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-[22px] max-md:grid-cols-1">
                {result.items.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
              <Pager page={result.page} totalPages={result.totalPages} basePath="/projects" />
            </>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
