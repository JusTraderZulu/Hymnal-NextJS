import fs from "fs"
import path from "path"
import type { Hymn } from "./types"

// Function to extract the first line from lyrics
function getFirstLine(lyrics: string): string {
  const lines = lyrics.split("\n")
  for (const line of lines) {
    const trimmed = line.trim()
    // Skip verse numbers like "1." at the beginning of lines
    if (trimmed && !trimmed.match(/^[0-9]+\./)) {
      return trimmed
    }
  }
  return ""
}

// Function to parse lyrics into verses and chorus
function parseLyrics(lyrics: string): { verses: string[]; chorus?: string } {
  const lines = lyrics.split("\n")
  const verses: string[] = []
  let chorus: string | undefined = undefined
  let currentVerse = ""
  let inChorus = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Check if this is a verse marker (e.g., "1.")
    if (line.match(/^[0-9]+\./)) {
      // If we were building a verse, save it
      if (currentVerse) {
        verses.push(currentVerse.trim())
        currentVerse = ""
      }

      // Start a new verse, including the verse number
      currentVerse = line
      inChorus = false
    }
    // Check if this is a chorus marker
    else if (line.toUpperCase().includes("CHORUS:")) {
      // If we were building a verse, save it
      if (currentVerse) {
        verses.push(currentVerse.trim())
        currentVerse = ""
      }

      // Start the chorus
      inChorus = true
      chorus = ""
    }
    // Add line to current verse or chorus
    else {
      if (inChorus) {
        chorus += (chorus ? "\n" : "") + line
      } else {
        currentVerse += (currentVerse ? "\n" : "") + line
      }
    }
  }

  // Add the last verse if there is one
  if (currentVerse) {
    verses.push(currentVerse.trim())
  }

  return { verses, chorus }
}

// Function to load all hymns from the hymns directory
export async function loadAllHymns(): Promise<Hymn[]> {
  const hymnsDirectory = path.join(process.cwd(), "hymns")

  // Check if directory exists
  if (!fs.existsSync(hymnsDirectory)) {
    console.warn(`Hymns directory not found at ${hymnsDirectory}. Using sample data.`)
    return []
  }

  try {
    const filenames = fs.readdirSync(hymnsDirectory)
    const hymnFiles = filenames.filter((filename) => filename.endsWith(".json"))

    const hymns: Hymn[] = []

    for (const filename of hymnFiles) {
      const filePath = path.join(hymnsDirectory, filename)
      const fileContent = fs.readFileSync(filePath, "utf8")

      try {
        const hymnData = JSON.parse(fileContent)

        // Extract hymn number from filename if not in the data
        let hymnNumber = hymnData.hymnNumber?.toString() || ""
        if (!hymnNumber) {
          // Try to extract from filename (e.g., "hymn_355a.json" -> "355a")
          const match = filename.match(/hymn_(\d+[a-z]?)\.json/)
          if (match) {
            hymnNumber = match[1]
          }
        }

        // Parse lyrics to extract verses and chorus
        const { verses, chorus } = parseLyrics(hymnData.lyrics || "")

        // Create a unique ID from the hymn number or title
        const id =
          hymnData.id ||
          `hymn-${hymnNumber}` ||
          hymnData.title?.toLowerCase().replace(/\s+/g, "-") ||
          `hymn-${hymns.length + 1}`

        // Get the first line for search
        const firstLine = getFirstLine(hymnData.lyrics || "")

        const hymn: Hymn = {
          id,
          hymnNumber: hymnNumber.toString(),
          title: hymnData.title || "",
          author: hymnData.author || { name: "Unknown" },
          category: hymnData.category || "",
          lyrics: hymnData.lyrics || "",
          firstLine,
          verses,
          chorus,
          fileName: filename,
        }

        hymns.push(hymn)
      } catch (error) {
        console.error(`Error parsing hymn file ${filename}:`, error)
      }
    }

    // Sort hymns by number
    return hymns.sort((a, b) => {
      // Extract numeric part for sorting
      const aNum = Number.parseInt(a.hymnNumber.replace(/[^0-9]/g, "") || "0")
      const bNum = Number.parseInt(b.hymnNumber.replace(/[^0-9]/g, "") || "0")
      return aNum - bNum
    })
  } catch (error) {
    console.error("Error loading hymns:", error)
    return []
  }
}

// Function to get a single hymn by ID
export async function getHymnById(id: string): Promise<Hymn | null> {
  const hymns = await loadAllHymns()
  return hymns.find((hymn) => hymn.id === id) || null
}

// Function to save a hymn (for editing)
export async function saveHymn(hymn: Hymn): Promise<boolean> {
  const hymnsDirectory = path.join(process.cwd(), "hymns")

  if (!fs.existsSync(hymnsDirectory)) {
    console.error(`Hymns directory not found at ${hymnsDirectory}`)
    return false
  }

  try {
    // Determine which file to write to
    let filename = hymn.fileName
    if (!filename) {
      filename = `hymn_${hymn.hymnNumber}.json`
    }

    const filePath = path.join(hymnsDirectory, filename)

    // Read the existing file to preserve structure
    let existingData = {}
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8")
      existingData = JSON.parse(fileContent)
    }

    // Update only the lyrics field
    const updatedData = {
      ...existingData,
      lyrics: hymn.lyrics,
    }

    // Write back to the file
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf8")

    return true
  } catch (error) {
    console.error("Error saving hymn:", error)
    return false
  }
}
