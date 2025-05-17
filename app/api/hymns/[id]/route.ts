import { NextResponse } from "next/server"
import { getHymnById } from "@/lib/hymn-loader"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const hymn = await getHymnById(params.id)

    if (!hymn) {
      return NextResponse.json({ error: "Hymn not found" }, { status: 404 })
    }

    return NextResponse.json(hymn)
  } catch (error) {
    console.error("Error loading hymn:", error)
    return NextResponse.json({ error: "Failed to load hymn" }, { status: 500 })
  }
}
