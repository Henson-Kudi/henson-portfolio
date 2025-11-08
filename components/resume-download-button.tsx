import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Link from "next/link"

export function ResumeDownloadButton() {

  return (
    <Link href={'/api/resume'} target="_blank">
      <Button>
        <Download className="mr-2 h-4 w-4" />
        Open PDF
      </Button>
    </Link>
  )
}
