import { PrismaClient, Prisma } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"

// The Neon serverless driver connects over HTTP/WebSocket instead of a
// persistent TCP pool — no idle connections to reap ("connection closed"
// noise gone) and it wakes a suspended compute automatically. In Node it
// needs a WebSocket implementation for sessions/transactions.
neonConfig.webSocketConstructor = ws

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Defense in depth: retry the rare transient connection blip (e.g. a compute
// that's still waking). Safe — a connection error means nothing ran.
function isTransientConnectionError(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientInitializationError) return true
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P1001") return true
  const msg = e instanceof Error ? e.message : String(e)
  return /can't reach database server|connection refused|ECONNREFUSED|connection.*closed|timed out|fetch failed/i.test(
    msg,
  )
}

function createPrisma() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  const base = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

  return base.$extends({
    query: {
      async $allOperations({ args, query }) {
        let lastError: unknown
        for (let attempt = 0; attempt < 4; attempt++) {
          try {
            return await query(args)
          } catch (e) {
            lastError = e
            if (attempt < 3 && isTransientConnectionError(e)) {
              await sleep(400 * (attempt + 1))
              continue
            }
            throw e
          }
        }
        throw lastError
      },
    },
  })
}

// Reuse a single client across hot-reloads (dev) and serverless invocations.
const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createPrisma> }

export const prisma = globalForPrisma.prisma ?? createPrisma()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
