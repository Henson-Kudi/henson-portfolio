import { auth } from "./server"
import { isAdminEmail } from "./admin"

// Returns the current session only if the caller is an authenticated admin
// (email in ADMIN_EMAILS), otherwise null. Use in API route handlers.
export async function getAdminSession() {
  try {
    const { data: session } = await auth.getSession()
    if (!session?.user || !isAdminEmail(session.user.email)) return null
    return session
  } catch {
    return null
  }
}
