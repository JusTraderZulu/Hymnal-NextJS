"use client"

import { useState, useEffect } from "react"
import Fuse from "fuse.js/dist/fuse.esm.js"
// Note: Fuse's namespace types are available globally; explicit import not needed
import { SearchBar } from "@/components/search-bar"
import { RecentFavorites } from "@/components/recent-favorites"
import { HymnCard } from "@/components/hymn-card"
import { HymnDetail } from "@/components/hymn-detail"
import { filterHymns } from "@/lib/search-utils"
import type { Hymn } from "@/lib/types"

export default function Home() {
  const [hymns, setHymns] = useState<Hymn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Hymn[]>([])
  const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null)
  const [searchOptions, setSearchOptions] = useState({})
  const [searchQuery, setSearchQuery] = useState("")

  // Load hymns from API
  useEffect(() => {
    async function loadHymns() {
      try {
        setLoading(true)
        const response = await fetch("/api/hymns")

        if (!response.ok) {
          throw new Error(`Failed to load hymns: ${response.status}`)
        }

        const data = await response.json()
        setHymns(data)
        setError(null)
      } catch (err) {
        console.error("Error loading hymns:", err)
        setError("Failed to load hymns. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadHymns()
  }, [])

  // Handle search using Fuse.js for better fuzzy matching
  const handleSearch = (query: string, options: any) => {
    setSearchQuery(query)
    setSearchOptions(options)

    // If it looks like the user is searching for a hymn number (e.g. "355" or "355a"),
    // or they explicitly selected the "number" search type, fall back to the existing
    // numeric matcher so we keep its exact-number behaviour.
    const numericPattern = /^(\d+)\s*([a-z])?$/i
    if (options.searchType === "number" || numericPattern.test(query.trim())) {
      const numericResults = filterHymns(hymns, query, options)
      setSearchResults(numericResults)
      return
    }

    // Decide which hymn fields Fuse should search based on the selected search type
    let keys: (string | any)[] = []
    switch (options.searchType) {
      case "title":
        keys = ["title"]
        break
      case "first_line":
        keys = ["firstLine"]
        break
      case "lyrics":
        keys = ["lyrics"]
        break
      // "all" or anything else → search across the most relevant fields with weights
      default:
        keys = [
          { name: "title", weight: 0.9 },
          { name: "firstLine", weight: 0.8 },
          { name: "lyrics", weight: 0.4 },
          { name: "hymnNumber", weight: 0.6 },
        ]
    }

    // Map the 0-100 slider (higher = stricter) to Fuse's 0-1 threshold (lower = stricter)
    const sliderValue = options.fuzzyThreshold ?? 70
    const fuseThreshold = 1 - sliderValue / 100

    const fuse = new Fuse(hymns, {
      keys,
      includeScore: false,
      threshold: fuseThreshold,
      ignoreLocation: true,
    })

    let results = query ? fuse.search(query).map((r: any) => r.item) : hymns

    // Apply author & category filters client-side if provided
    if (options.author) {
      const authorLower = options.author.toLowerCase()
      results = results.filter((h: Hymn) => h.author?.name.toLowerCase().includes(authorLower))
    }

    if (options.category) {
      const categoryLower = options.category.toLowerCase()
      results = results.filter((h: Hymn) => h.category?.toLowerCase().includes(categoryLower))
    }

    setSearchResults(results)
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchOptions({})
    setSearchResults([])
    setSelectedHymn(null)
  }

  // Select hymn
  const handleSelectHymn = (hymn: Hymn) => {
    setSelectedHymn(hymn)
  }

  // Navigate to previous/next hymn
  const handlePreviousHymn = () => {
    if (!selectedHymn) return

    const currentIndex = hymns.findIndex((h) => h.id === selectedHymn.id)
    if (currentIndex > 0) {
      setSelectedHymn(hymns[currentIndex - 1])
    }
  }

  const handleNextHymn = () => {
    if (!selectedHymn) return

    const currentIndex = hymns.findIndex((h) => h.id === selectedHymn.id)
    if (currentIndex < hymns.length - 1) {
      setSelectedHymn(hymns[currentIndex + 1])
    }
  }

  // Save edited hymn
  const handleSaveHymn = async (hymn: Hymn): Promise<boolean> => {
    try {
      const response = await fetch("/api/hymns/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hymn),
      })

      if (!response.ok) {
        throw new Error(`Failed to save hymn: ${response.status}`)
      }

      // Update the hymn in our local state
      setHymns((prevHymns) => prevHymns.map((h) => (h.id === hymn.id ? hymn : h)))

      if (selectedHymn && selectedHymn.id === hymn.id) {
        setSelectedHymn(hymn)
      }

      return true
    } catch (err) {
      console.error("Error saving hymn:", err)
      return false
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Spiritual Baptist Hymnal</h1>
        <p>Loading hymns...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Spiritual Baptist Hymnal</h1>
        <p className="text-red-500">{error}</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Spiritual Baptist Hymnal</h1>
        <p className="text-center text-gray-600 mb-4">By Justin Borneo</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar - Search and filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Search Hymns</h2>
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <RecentFavorites onSelectHymn={handleSelectHymn} />
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          {selectedHymn ? (
            <HymnDetail
              hymn={selectedHymn}
              onPrevious={handlePreviousHymn}
              onNext={handleNextHymn}
              hasPrevious={hymns.findIndex((h) => h.id === selectedHymn.id) > 0}
              hasNext={hymns.findIndex((h) => h.id === selectedHymn.id) < hymns.length - 1}
              onSave={handleSaveHymn}
            />
          ) : searchResults.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Search Results {searchQuery ? `for "${searchQuery}"` : ""}({searchResults.length}{" "}
                {searchResults.length === 1 ? "hymn" : "hymns"})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((hymn) => (
                  <HymnCard key={hymn.id} hymn={hymn} onClick={() => handleSelectHymn(hymn)} />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Featured Hymns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hymns.slice(0, 6).map((hymn) => (
                  <HymnCard key={hymn.id} hymn={hymn} onClick={() => handleSelectHymn(hymn)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
