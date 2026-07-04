export type PageParams = { page: number; pageSize: number }

export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 50

// Normalize arbitrary page/pageSize (from query params or callers) into safe,
// clamped values.
export function normalizePageParams(
  input?: { page?: number | string | null; pageSize?: number | string | null },
  opts?: { defaultPageSize?: number; maxPageSize?: number },
): PageParams {
  const defaultPageSize = opts?.defaultPageSize ?? DEFAULT_PAGE_SIZE
  const maxPageSize = opts?.maxPageSize ?? MAX_PAGE_SIZE

  const rawPage = Number.parseInt(String(input?.page ?? 1), 10)
  const rawSize = Number.parseInt(String(input?.pageSize ?? defaultPageSize), 10)

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1
  const pageSize = Number.isFinite(rawSize) && rawSize > 0 ? Math.min(rawSize, maxPageSize) : defaultPageSize

  return { page, pageSize }
}

export function parsePageParams(
  searchParams: URLSearchParams,
  opts?: { defaultPageSize?: number; maxPageSize?: number },
): PageParams {
  return normalizePageParams(
    { page: searchParams.get("page"), pageSize: searchParams.get("pageSize") },
    opts,
  )
}

export function buildPaginated<T>(items: T[], total: number, params: PageParams): Paginated<T> {
  const totalPages = total === 0 ? 0 : Math.ceil(total / params.pageSize)
  return {
    items,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages,
    hasMore: params.page < totalPages,
  }
}
