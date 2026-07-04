import { AdminHeader } from "@/components/admin/admin-header"
import { experienceRepo } from "@/lib/repositories/experience"
import { ExperienceManager } from "@/components/admin/experience-manager"

export const dynamic = "force-dynamic"

export default async function AdminExperiencePage() {
  const items = await experienceRepo.listAll()
  return (
    <>
      <AdminHeader title="Experience" sub="Roles that appear on the site & CV" />
      <div className="max-w-5xl px-8 py-7">
        <ExperienceManager initial={items} />
      </div>
    </>
  )
}
