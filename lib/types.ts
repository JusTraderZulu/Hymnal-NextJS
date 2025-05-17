export interface Author {
  name: string
}

export interface Hymn {
  id: string
  hymnNumber: string // Changed from number to string to handle cases like "355a"
  title: string
  author?: Author
  category?: string
  lyrics: string
  firstLine?: string
  verses: string[]
  chorus?: string
  fileName?: string // For tracking the source file
}
