import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Hymn } from "@/lib/types"

interface HymnListProps {
  hymns: Hymn[]
}

export function HymnList({ hymns }: HymnListProps) {
  return (
    <div className="space-y-4">
      {hymns.map((hymn) => (
        <div
          key={hymn.id}
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex-1">
            <Link href={`/hymns/${hymn.id}`} className="block">
              <h2 className="text-lg font-semibold hover:text-blue-600 transition-colors">{hymn.title}</h2>
              <p className="text-sm text-gray-500">Hymn #{hymn.hymnNumber}</p>
              {hymn.author && <p className="text-sm text-gray-600">By {hymn.author.name}</p>}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Add to favorites">
              <Heart className="h-4 w-4" />
            </Button>
            <Button asChild size="sm">
              <Link href={`/hymns/${hymn.id}`}>View</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
