import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { hymns } from "@/lib/hymns"

// Helper to get current index once to use for nav buttons
const getIndex = (id: string) => hymns.findIndex((h) => h.id === id)

export default function HymnPage({ params }: { params: { id: string } }) {
  const hymn = hymns.find((h) => h.id === params.id) || hymns[0]
  const currentIndex = getIndex(hymn.id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/hymns">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hymns
        </Link>
      </Button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{hymn.title}</h1>
            <p className="text-gray-500">Hymn #{hymn.hymnNumber}</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Add to favorites">
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {hymn.author && <p className="text-gray-600 mb-4">By {hymn.author.name}</p>}

        <div className="mt-6 space-y-4">
          {hymn.verses.map((verse, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold text-sm text-gray-500 mb-1">Verse {index + 1}</p>
              <div className="whitespace-pre-line">{verse}</div>
            </div>
          ))}

          {hymn.chorus && (
            <div className="mb-4 pl-4 border-l-4 border-gray-200">
              <p className="font-semibold text-sm text-gray-500 mb-1">Chorus</p>
              <div className="whitespace-pre-line">{hymn.chorus}</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" disabled={currentIndex <= 0}>
          Previous Hymn
        </Button>
        <Button variant="outline" disabled={currentIndex >= hymns.length - 1}>
          Next Hymn
        </Button>
      </div>
    </div>
  )
}
