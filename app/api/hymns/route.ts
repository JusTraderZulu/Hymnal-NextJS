import { NextResponse } from "next/server"
import { loadAllHymns } from "@/lib/hymn-loader"

export async function GET() {
  try {
    const hymns = await loadAllHymns()
    return NextResponse.json(hymns)
  } catch (error) {
    console.error("Error loading hymns:", error)
    return NextResponse.json({ error: "Failed to load hymns" }, { status: 500 })
  }
}
