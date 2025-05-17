"use client"

import { Button } from "@/components/ui/button"
import { useHymnContext } from "@/lib/hymn-context"
import type { Hymn } from "@/lib/types"

interface RecentFavoritesProps {
  onSelectHymn: (hymn: Hymn) => void
}

export function RecentFavorites({ onSelectHymn }: RecentFavoritesProps) {
  // Use the shared context instead of local state
  const { recentHymns, favorites, clearRecent } = useHymnContext()

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Recent Hymns</h3>
          <Button variant="ghost" size="sm" onClick={clearRecent}>
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
          <p className="text-sm text-gray-500">No recent hymns.</p>
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
