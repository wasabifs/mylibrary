import { getAllBooks } from '@/lib/notion'

export const revalidate = 600

export default async function LibraryPage() {
  const books = await getAllBooks()
  const finished = books.filter(b => b.finishDate)
  const unfinished = books.filter(b => !b.finishDate && b.startDate)
  const unread = books.filter(b => !b.startDate)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '36px 20px 20px', borderBottom: '1px solid #2a2820',
        position: 'sticky', top: 0, background: '#0f0e0c', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 20, color: '#c9a96e' }}>圖書館</span>
          <span style={{ fontSize: 10, color: '#847a68', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Library</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        padding: '10px 20px', borderBottom: '1px solid #2a2820',
        fontSize: 11, color: '#847a68', letterSpacing: '0.1em',
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a96e' }} />
        共 {books.length} 本 · 已讀 {finished.length} · 閱讀中 {unfinished.length} · 未讀 {unread.length}
      </div>

      {/* Grid */}
      <div style={{ padding: '16px 12px 80px' }}>
        <BookGrid books={books} />
      </div>
    </div>
  )
}

function BookGrid({ books }: { books: any[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px 8px',
    }}>
      {books.map(book => (
        <a key={book.pageId} href={`/library/${book.pageId}`}
          style={{ textDecoration: 'none', display: 'block' }}>
          {/* Cover */}
          <div style={{
            aspectRatio: '2/3',
            background: '#1a1915',
            border: '1px solid #2a2820',
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: 6,
            position: 'relative',
          }}>
            {book.cover
              ? <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📖</div>
            }
            {/* Status dot */}
            {!book.finishDate && book.startDate && (
              <div style={{
                position: 'absolute', top: 5, right: 5,
                width: 7, height: 7, borderRadius: '50%',
                background: '#c9a96e', boxShadow: '0 0 6px #c9a96e',
              }} />
            )}
          </div>
          {/* Title */}
          <div style={{
            fontSize: 11, color: '#c4bcac', lineHeight: 1.4,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {book.title}
          </div>
          {book.author && (
            <div style={{ fontSize: 10, color: '#3e3a32', marginTop: 2 }}>{book.author}</div>
          )}
        </a>
      ))}
    </div>
  )
}
