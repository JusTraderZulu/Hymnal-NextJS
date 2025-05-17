"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Hymn } from "@/lib/types"

interface HymnDetailProps {
  hymn: Hymn
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
  onSave?: (hymn: Hymn) => Promise<boolean>
}

export function HymnDetail({
  hymn,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  onSave,
}: HymnDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedLyrics, setEditedLyrics] = useState(hymn.lyrics)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Check if hymn is in favorites
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      try {
        const favorites = JSON.parse(storedFavorites)
        setIsFavorite(favorites.some((fav: Hymn) => fav.id === hymn.id))
      } catch (e) {
        console.error("Error parsing favorites:", e)
      }
    }

    // Reset edited lyrics when hymn changes
    setEditedLyrics(hymn.lyrics)
    setIsEditing(false)
  }, [hymn])

  const toggleFavorite = () => {
    const storedFavorites = localStorage.getItem("favorites")
    let favorites: Hymn[] = []

    if (storedFavorites) {
      try {
        favorites = JSON.parse(storedFavorites)
      } catch (e) {
        console.error("Error parsing favorites:", e)
      }
    }

    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter((fav: Hymn) => fav.id !== hymn.id)
    } else {
      // Add to favorites
      favorites.push(hymn)
    }

    localStorage.setItem("favorites", JSON.stringify(favorites))
    setIsFavorite(!isFavorite)
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      // Reset to original lyrics when entering edit mode
      setEditedLyrics(hymn.lyrics)
    }
  }

  const saveChanges = async () => {
    if (!onSave) {
      toast({
        title: "Save not implemented",
        description: "The save functionality is not available in this demo.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Create updated hymn object
      const updatedHymn = {
        ...hymn,
        lyrics: editedLyrics,
      }

      const success = await onSave(updatedHymn)

      if (success) {
        toast({
          title: "Hymn saved",
          description: "The hymn lyrics have been updated successfully.",
        })
        setIsEditing(false)
      } else {
        toast({
          title: "Save failed",
          description: "Failed to save the hymn. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving hymn:", error)
      toast({
        title: "Save error",
        description: "An error occurred while saving the hymn.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addToRecent = () => {
    const storedRecent = localStorage.getItem("recentHymns")
    let recentHymns: Hymn[] = []

    if (storedRecent) {
      try {
        recentHymns = JSON.parse(storedRecent)
      } catch (e) {
        console.error("Error parsing recent hymns:", e)
      }
    }

    // Remove if already exists
    recentHymns = recentHymns.filter((recent: Hymn) => recent.id !== hymn.id)

    // Add to beginning of array
    recentHymns.unshift(hymn)

    // Limit to 5 recent hymns
    recentHymns = recentHymns.slice(0, 5)

    localStorage.setItem("recentHymns", JSON.stringify(recentHymns))
  }

  // Add to recent hymns when component mounts
  useEffect(() => {
    addToRecent()
  }, [hymn.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{hymn.title}</h1>
          <p className="text-gray-500">Hymn #{hymn.hymnNumber}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>

      {hymn.author && <p className="text-gray-600 mb-4">By {hymn.author.name}</p>}

      {hymn.category && <p className="text-gray-600 mb-4">Category: {hymn.category}</p>}

      {!isEditing ? (
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
      ) : (
        <div className="mt-6">
          <Textarea
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            className="min-h-[300px] font-mono"
          />
          <p className="text-sm text-gray-500 mt-2">
            Note: Format verses with "1." and chorus with "CHORUS:" to maintain structure.
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <div>
          {isEditing ? (
            <>
              <Button onClick={saveChanges} disabled={isSaving} className="mr-2">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={toggleEditMode} disabled={isSaving}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={toggleEditMode}>
              Edit Lyrics
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" disabled={!hasPrevious} onClick={onPrevious}>
            Previous Hymn
          </Button>
          <Button variant="outline" disabled={!hasNext} onClick={onNext}>
            Next Hymn
          </Button>
        </div>
      </div>
    </div>
  )
}
