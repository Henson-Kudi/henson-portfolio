import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'henson-resume.pdf')
    const pdfBuffer = fs.readFileSync(pdfPath)
    
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="henson-resume.pdf"',
      },
    })
  } catch (error) {
    console.error("Error serving PDF:", error)
    return NextResponse.json({ error: "Failed to serve PDF" }, { status: 500 })
  }
}
