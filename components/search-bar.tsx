"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface SearchBarProps {
  onSearch: (query: string, options: any) => void
  onClear: () => void
}

export function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("")
  const [searchType, setSearchType] = useState<string>("all")
  const [fuzzyThreshold, setFuzzyThreshold] = useState(70)

  const handleSearch = () => {
    onSearch(query, {
      author,
      category,
      searchType,
      fuzzyThreshold,
    })
  }

  const handleClear = () => {
    setQuery("")
    setAuthor("")
    setCategory("")
    setSearchType("all")
    setFuzzyThreshold(70)
    onClear()
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="search"
          placeholder="Search hymns by number, title, or lyrics..."
          className="pl-10 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1">
          Search
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex justify-between p-2 h-auto">
            <span>Advanced Search Options</span>
            <span>{showAdvanced ? "▲" : "▼"}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Filter by Author</Label>
              <Input id="author" placeholder="Author name" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Filter by Category</Label>
              <Input
                id="category"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-type">Search Type</Label>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger id="search-type">
                <SelectValue placeholder="Search Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="title">Title Only</SelectItem>
                <SelectItem value="lyrics">Lyrics Only</SelectItem>
                <SelectItem value="first_line">First Line Only</SelectItem>
                <SelectItem value="number">Hymn Number Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="fuzzy-threshold">Search Sensitivity</Label>
              <span className="text-sm text-gray-500">{fuzzyThreshold}%</span>
            </div>
            <Slider
              id="fuzzy-threshold"
              min={0}
              max={100}
              step={5}
              value={[fuzzyThreshold]}
              onValueChange={(value) => setFuzzyThreshold(value[0])}
            />
            <p className="text-xs text-gray-500">Higher values require more exact matches</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
