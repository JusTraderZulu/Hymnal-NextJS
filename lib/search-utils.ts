import type { Hymn } from "./types"

// Remove punctuation for better search matching
export function removePunctuation(text: string): string {
  return text.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
}

// Get first line of lyrics
export function getFirstLine(lyrics: string): string {
  const lines = lyrics.split("\n")
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.match(/^[0-9]+\./)) {
      return trimmed
    }
  }
  return ""
}

// Fuzzy match function (simplified version of fuzzywuzzy)
export function fuzzyMatch(query: string, text: string, threshold = 70): boolean {
  query = query.toLowerCase()
  text = text.toLowerCase()

  // Exact match
  if (text.includes(query)) {
    return true
  }

  // Simple partial match (simplified from your fuzzywuzzy implementation)
  const words = query.split(/\s+/)
  let matchCount = 0

  for (const word of words) {
    if (text.includes(word)) {
      matchCount++
    }
  }

  const matchPercentage = (matchCount / words.length) * 100
  return matchPercentage >= threshold
}

// Filter hymns based on search criteria
export function filterHymns(
  hymns: Hymn[],
  query: string,
  options: {
    author?: string
    category?: string
    searchType?: "all" | "title" | "lyrics" | "first_line" | "number"
    fuzzyThreshold?: number
  } = {},
): Hymn[] {
  const { author, category, searchType = "all", fuzzyThreshold = 70 } = options

  if (!query && !author && !category) {
    return hymns
  }

  const queryLower = query ? removePunctuation(query.toLowerCase()) : ""

  // Check if query is a hymn number (including letter suffixes)
  let numericQuery: number | null = null
  let letterSuffix: string | null = null

  if (query) {
    const queryClean = query.trim().toLowerCase()
    const match = queryClean.match(/^(\d+)([a-z])?$/)

    if (match) {
      numericQuery = Number.parseInt(match[1], 10)
      letterSuffix = match[2] || null
    } else {
      const spaceMatch = queryClean.match(/^(\d+)\s*([a-z])$/)
      if (spaceMatch) {
        numericQuery = Number.parseInt(spaceMatch[1], 10)
        letterSuffix = spaceMatch[2]
      }
    }
  }

  return hymns.filter((hymn) => {
    // Apply author filter if specified
    if (author && !hymn.author?.name.toLowerCase().includes(author.toLowerCase())) {
      return false
    }

    // Apply category filter if specified
    if (category && !hymn.category?.toLowerCase().includes(category.toLowerCase())) {
      return false
    }

    if (!query) {
      return true // No query, but passed author/category filters
    }

    // Get searchable fields
    const title = removePunctuation(hymn.title.toLowerCase())
    const lyrics = removePunctuation(hymn.lyrics.toLowerCase())
    const firstLine = hymn.firstLine ? removePunctuation(hymn.firstLine.toLowerCase()) : ""
    const hymnNum = hymn.hymnNumber

    // Extract number and letter from hymn number
    const hymnMatch = hymnNum.match(/^(\d+)([a-z])?$/)
    const hymnNumNumeric = hymnMatch ? Number.parseInt(hymnMatch[1], 10) : null
    const hymnLetter = hymnMatch ? hymnMatch[2] || null : null

    // Apply search based on search type
    if (searchType === "number" || numericQuery !== null) {
      if (hymnNumNumeric === numericQuery) {
        // If we have a letter suffix in the query, match it exactly
        if (letterSuffix === null || hymnLetter === letterSuffix) {
          return true
        }
      }
      if (searchType === "number") return false
    }

    if (searchType === "title" && fuzzyMatch(query, title, fuzzyThreshold)) {
      return true
    }

    if (searchType === "first_line" && fuzzyMatch(query, firstLine, fuzzyThreshold)) {
      return true
    }

    if (searchType === "lyrics" && fuzzyMatch(query, lyrics, fuzzyThreshold)) {
      return true
    }

    if (searchType === "all") {
      return (
        fuzzyMatch(query, title, fuzzyThreshold) ||
        fuzzyMatch(query, lyrics, fuzzyThreshold) ||
        fuzzyMatch(query, firstLine, fuzzyThreshold) ||
        (numericQuery !== null &&
          hymnNumNumeric === numericQuery &&
          (letterSuffix === null || hymnLetter === letterSuffix))
      )
    }

    return false
  })
}
