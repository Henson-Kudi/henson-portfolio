import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ExternalLink, FileText } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

export const metadata = {
  title: "Publications",
  description: "Academic and technical publications authored or contributed to by Giovani Moutinho.",
}

// Sample publications data
const publications = [
  {
    id: 1,
    title: "Estratégias Pedagógicas para o Processo de Ensino-Aprendizagem de Algoritmos",
    description: "Effective pedagogical strategies for teaching and learning complex algorithms.",
    date: "2019",
    image: null,
    link: "#",
    pdf: "#",
  },
  {
    id: 2,
    title: "Estudos de Técnicas de Mineração de Dados Aplicadas em Ambientes Sistematizados de Bibliotecas",
    description: "Data mining techniques applied to digital library systems for improved resource management.",
    date: "2018",
    image: null,
    link: "#",
    pdf: "#",
  },
  {
    id: 3,
    title: "Carros de Combate na Selva: Utilização de VBCCCs no Teatro de Operações da Amazônia",
    description: "Analysis of combat vehicles deployment in jungle environments of the Amazon region.",
    date: "2017",
    image: null,
    link: "#",
    pdf: "#",
  },
]

export default function PublicationsPage() {
  return (
    <div className="container py-12">
      <div>
        <h1 className="text-4xl font-bold mb-4">Publications</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Academic and technical publications I've authored or contributed to
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {publications.map((publication) => (
          <Card key={publication.id} className="overflow-hidden bg-zinc-900/50 border-zinc-800/50">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
              <div className="relative w-full h-[200px] bg-zinc-900">
                {publication.image ? (
                  <Image
                    src={publication.image || "/placeholder.svg"}
                    alt={publication.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <PlaceholderImage type="publication" className="absolute inset-0" />
                )}
              </div>
              <CardContent className="p-5">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{publication.title}</h2>
                    <p className="text-zinc-400 mb-4 line-clamp-1">{publication.description}</p>

                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Calendar className="h-4 w-4 text-primary" />
                      {publication.date}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link href={publication.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="default" size="sm" className="bg-white text-black hover:bg-zinc-200">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Publication
                      </Button>
                    </Link>
                    <Link href={publication.pdf} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">
                        <FileText className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
