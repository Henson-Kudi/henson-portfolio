import { AdminHeader } from "@/components/admin/admin-header"
import { testimonialsRepo } from "@/lib/repositories/testimonials"
import { TestimonialsManager } from "@/components/admin/testimonials-manager"

export const dynamic = "force-dynamic"

export default async function AdminTestimonialsPage() {
  const items = await testimonialsRepo.listAll()
  return (
    <>
      <AdminHeader title="Testimonials" sub="Client & teammate quotes" />
      <div className="max-w-5xl px-8 py-7">
        <TestimonialsManager initial={items} />
      </div>
    </>
  )
}
