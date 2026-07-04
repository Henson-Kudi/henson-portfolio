import { AdminHeader } from "@/components/admin/admin-header"
import { postsRepo } from "@/lib/repositories/posts"
import { PostsManager } from "@/components/admin/posts-manager"

export const dynamic = "force-dynamic"

export default async function AdminPostsPage() {
  const { items } = await postsRepo.listAll({ pageSize: 200 })
  return (
    <>
      <AdminHeader title="Blog posts" sub="Write and manage articles" />
      <div className="max-w-5xl px-8 py-7">
        <PostsManager initial={items} />
      </div>
    </>
  )
}
