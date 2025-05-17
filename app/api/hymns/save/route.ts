import { NextResponse } from "next/server"
import { saveHymn } from "@/lib/hymn-loader"
import type { Hymn } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const hymn = (await request.json()) as Hymn

    if (!hymn || !hymn.id || !hymn.lyrics) {
      return NextResponse.json({ error: "Invalid hymn data" }, { status: 400 })
    }

    const success = await saveHymn(hymn)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to save hymn" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error saving hymn:", error)
    return NextResponse.json({ error: "Failed to save hymn" }, { status: 500 })
  }
}
