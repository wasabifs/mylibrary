import { getAllBooksWithHighlights } from '@/lib/notion'
import LibraryClient from '@/components/LibraryClient'

export const revalidate = 600

export default async function Home() {
  let books = []
  let error = ''
  try {
    books = await getAllBooksWithHighlights()
  } catch (e: any) {
    error = e.message
  }

  return <LibraryClient books={books} error={error} />
}
