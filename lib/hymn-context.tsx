"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from "react"
import type { Hymn } from "@/lib/types"

// Define the context shape
interface HymnContextType {
  recentHymns: Hymn[]
  favorites: Hymn[]
  addToRecent: (hymn: Hymn) => void
  toggleFavorite: (hymn: Hymn) => boolean
  clearRecent: () => void
}

// Create the context with default values
const HymnContext = createContext<HymnContextType>({
  recentHymns: [],
  favorites: [],
  addToRecent: () => {},
  toggleFavorite: () => false,
  clearRecent: () => {},
})

// Provider component that wraps app or part of app that needs this context
export function HymnProvider({ children }: { children: ReactNode }) {
  const [recentHymns, setRecentHymns] = useState<Hymn[]>([])
  const [favorites, setFavorites] = useState<Hymn[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const storedRecent = localStorage.getItem("recentHymns")
        if (storedRecent) {
          setRecentHymns(JSON.parse(storedRecent))
        }
        
        const storedFavorites = localStorage.getItem("favorites")
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites))
        }
      } catch (e) {
        console.error("Error loading from localStorage:", e)
      }
    }
    
    loadFromStorage()
    window.addEventListener("storage", loadFromStorage)
    
    return () => {
      window.removeEventListener("storage", loadFromStorage)
    }
  }, [])

  // Add a hymn to recent list
  const addToRecent = (hymn: Hymn) => {
    setRecentHymns(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.id !== hymn.id)
      // Add to beginning and limit to 5
      const updated = [hymn, ...filtered].slice(0, 5)
      
      // Save to localStorage
      localStorage.setItem("recentHymns", JSON.stringify(updated))
      return updated
    })
  }

  // Toggle favorite status
  const toggleFavorite = (hymn: Hymn): boolean => {
    let isFavorite = favorites.some(fav => fav.id === hymn.id)
    
    setFavorites(prev => {
      let updated
      if (isFavorite) {
        // Remove from favorites
        updated = prev.filter(fav => fav.id !== hymn.id)
      } else {
        // Add to favorites
        updated = [...prev, hymn]
      }
      
      // Save to localStorage
      localStorage.setItem("favorites", JSON.stringify(updated))
      return updated
    })
    
    return !isFavorite // Return new status
  }

  // Clear recent hymns
  const clearRecent = () => {
    setRecentHymns([])
    localStorage.removeItem("recentHymns")
  }

  return (
    <HymnContext.Provider value={{ recentHymns, favorites, addToRecent, toggleFavorite, clearRecent }}>
      {children}
    </HymnContext.Provider>
  )
}

// Custom hook to use the context
export function useHymnContext() {
  return useContext(HymnContext)
} 