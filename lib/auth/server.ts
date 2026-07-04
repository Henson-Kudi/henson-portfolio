import { createNeonAuth } from "@neondatabase/auth/next/server"

// Server-side Neon Auth instance (Better Auth under the hood).
// Provides: .handler() for the API route, .middleware() for route
// protection, and Better Auth server methods incl. .getSession().
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
})
