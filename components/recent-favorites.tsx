"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Hymn } from "@/lib/types"

interface RecentFavoritesProps {
  onSelectHymn: (hymn: Hymn) => void
}

export function RecentFavorites({ onSelectHymn }: RecentFavoritesProps) {
  const [recentHymns, setRecentHymns] = useState<Hymn[]>([])
  const [favorites, setFavorites] = useState<Hymn[]>([])

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    const storedRecent = localStorage.getItem("recentHymns")

    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (e) {
        console.error("Error parsing favorites:", e)
      }
    }

    if (storedRecent) {
      try {
        setRecentHymns(JSON.parse(storedRecent))
      } catch (e) {
        console.error("Error parsing recent hymns:", e)
      }
    }
  }, [])

  const clearRecentHymns = () => {
    setRecentHymns([])
    localStorage.removeItem("recentHymns")
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Recent Hymns</h3>
          <Button variant="ghost" size="sm" onClick={clearRecentHymns}>
            Clear
          </Button>
        </div>
        {recentHymns.length > 0 ? (
          <div className="space-y-1">
            {recentHymns.map((hymn) => (
              <Button
                key={hymn.id}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-1"
                onClick={() => onSelectHymn(hymn)}
              >
                {hymn.hymnNumber}: {hymn.title}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent searches.</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Favorites</h3>
        {favorites.length > 0 ? (
          <div className="space-y-1">
            {favorites.map((hymn) => (
              <Button
                key={hymn.id}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-1"
                onClick={() => onSelectHymn(hymn)}
              >
                {hymn.hymnNumber}: {hymn.title}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No favorites.</p>
        )}
      </div>
    </div>
  )
}
