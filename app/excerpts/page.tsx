import { getAllBooksWithHighlights, type Book } from '@/lib/notion'
import LibraryClient from '@/components/LibraryClient'

export const dynamic = 'force-dynamic'

export default async function ExcerptsPage() {
  let books: Book[] = []
  let error = ''
  try {
    books = await getAllBooksWithHighlights()
  } catch (e: any) {
    error = e.message
  }
  return <LibraryClient books={books} error={error} />
}
