import { auth } from "@/lib/auth/server"

// Proxies all Neon Auth requests (sign-in, sign-out, session, callbacks).
export const { GET, POST } = auth.handler()
