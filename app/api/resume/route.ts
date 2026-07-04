import { NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { experienceRepo } from "@/lib/repositories/experience"
import { CvDocument } from "@/components/cv/cv-document"
import { cvProfile } from "@/lib/cv-content"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// PUBLIC: generate the CV as a PDF, live, from the CV profile + published
// experience. Always current — no manual upload. Add ?download to force save.
export async function GET(req: Request) {
  const download = new URL(req.url).searchParams.has("download")
  const experiences = await experienceRepo.listPublished()

  // CvDocument is a pure react-pdf component (no hooks); calling it returns the
  // <Document> element renderToBuffer expects.
  const buffer = await renderToBuffer(CvDocument({ experiences }))
  const filename = `${cvProfile.name.replace(/\s+/g, "_")}_CV.pdf`

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
