"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useHymnContext } from "@/lib/hymn-context"
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
  const [isEditing, setIsEditing] = useState(false)
  const [editedLyrics, setEditedLyrics] = useState(hymn.lyrics)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  
  // Use the shared hymn context
  const { favorites, addToRecent, toggleFavorite } = useHymnContext()
  
  // Get favorite status from context
  const isFavorite = favorites.some(fav => fav.id === hymn.id)

  // Reset edited lyrics when hymn changes
  useEffect(() => {
    setEditedLyrics(hymn.lyrics)
    setIsEditing(false)
    
    // Add to recents whenever the hymn changes
    addToRecent(hymn)
  }, [hymn, addToRecent])

  const handleToggleFavorite = () => {
    toggleFavorite(hymn)
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
          onClick={handleToggleFavorite}
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
