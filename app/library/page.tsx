import { getAllBooks } from '@/lib/notion'
import LibraryGrid from '@/components/LibraryGrid'
import SyncButton from '@/components/SyncButton'

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  const books = await getAllBooks()

  const tagCount: Record<string, number> = {}
  books.forEach(b => b.tags.forEach(t => {
    tagCount[t] = (tagCount[t] || 0) + 1
  }))
  const allTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{
        padding: '36px 20px 20px',
        borderBottom: '1px solid #2a2820',
        position: 'sticky',
        top: 0,
        background: '#0f0e0c',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 20, color: '#c9a96e' }}>圖書館</span>
            <span style={{ fontSize: 10, color: '#9a9080', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Library</span>
          </div>
          <SyncButton />
        </div>
      </div>
      <LibraryGrid books={books} allTags={allTags} />
    </div>
  )
}
