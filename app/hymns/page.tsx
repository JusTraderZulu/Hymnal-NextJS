import { Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HymnList } from "@/components/hymn-list"
import { hymns } from "@/lib/hymns"

export default function HymnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">All Hymns</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input type="search" placeholder="Search hymns..." className="pl-10 w-full" />
        </div>
      </div>

      <Button asChild variant="outline" className="mb-6">
        <Link href="/">Back to Home</Link>
      </Button>

      <HymnList hymns={hymns} />
    </div>
  )
}
