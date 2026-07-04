import { AdminHeader } from "@/components/admin/admin-header"
import { projectsRepo } from "@/lib/repositories/projects"
import { ProjectsManager } from "@/components/admin/projects-manager"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  const { items } = await projectsRepo.listAll({ pageSize: 200 })
  return (
    <>
      <AdminHeader title="Projects" sub="Add, edit, reorder and retire projects" />
      <div className="max-w-5xl px-8 py-7">
        <ProjectsManager initial={items} />
      </div>
    </>
  )
}
