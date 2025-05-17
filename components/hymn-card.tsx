"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import type { Hymn } from "@/lib/types"

interface HymnCardProps {
  hymn: Hymn
  onClick: () => void
}

export function HymnCard({ hymn, onClick }: HymnCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow pt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold">{hymn.title}</h2>
            <p className="text-sm text-gray-500">Hymn #{hymn.hymnNumber}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Add to favorites">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        {hymn.author && <p className="text-sm text-gray-600 mt-1">By {hymn.author.name}</p>}
        {hymn.category && <p className="text-xs text-gray-500 mt-1">Category: {hymn.category}</p>}
        <p className="mt-4 text-gray-700 line-clamp-3">{hymn.firstLine || hymn.verses[0].substring(0, 100)}...</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button onClick={onClick} className="w-full">
          View Hymn
        </Button>
      </CardFooter>
    </Card>
  )
}
