import { Skeleton } from "@/components/ui/skeleton"

export default function ResumeLoading() {
  return (
    <div className="container py-12">
      <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Skeleton className="h-10 w-40 mb-2" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="space-y-6">
            <Skeleton className="h-8 w-48 mb-4" />

            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              ))}
          </div>

          <div className="space-y-4">
            <Skeleton className="h-8 w-24 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-20">
            <Skeleton className="h-64 w-full rounded-lg mb-6" />
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
            </div>
            <div className="mt-6">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
