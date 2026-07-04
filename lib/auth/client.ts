"use client"

import { createAuthClient } from "@neondatabase/auth/next"

// Browser-side auth client. Infers the base URL from the /api/auth route,
// so no config/URL is passed here. Use its hooks/methods for sign-in,
// sign-out and session state in client components.
export const authClient = createAuthClient()
