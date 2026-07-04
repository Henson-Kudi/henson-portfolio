import { AdminHeader } from "@/components/admin/admin-header"
import { seoRepo } from "@/lib/repositories/seo"
import { SeoForm } from "@/components/admin/seo-form"

export const dynamic = "force-dynamic"

export default async function AdminSeoPage() {
  const seo = await seoRepo.get()
  return (
    <>
      <AdminHeader title="SEO & meta" sub="Home-page search & social metadata — no redeploy needed" />
      <div className="max-w-5xl px-8 py-7">
        <SeoForm initial={seo} />
      </div>
    </>
  )
}
