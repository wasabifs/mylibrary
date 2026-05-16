import { NextResponse } from 'next/server'
import { getAllBooksWithHighlights } from '@/lib/notion'

// Cache for 10 minutes (revalidate on demand)
export const revalidate = 600

export async function GET() {
  try {
    const books = await getAllBooksWithHighlights()
    return NextResponse.json({ books })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
