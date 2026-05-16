import { getReadingBooks } from '@/lib/notion'

export const revalidate = 600

export default async function ReadingPage() {
  const books = await getReadingBooks()

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '36px 20px 20px',
        borderBottom: '1px solid #2a2820',
        position: 'sticky', top: 0,
        background: '#0f0e0c', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 20, color: '#c9a96e' }}>閱讀中</span>
          <span style={{ fontSize: 10, color: '#847a68', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Reading</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        padding: '10px 20px', borderBottom: '1px solid #2a2820',
        fontSize: 11, color: '#847a68', letterSpacing: '0.1em',
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a96e' }} />
        目前 {books.length} 本進行中
      </div>

      {/* List */}
      <div style={{ padding: '8px 16px 80px' }}>
        {books.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#847a68', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📖</div>
            目前沒有進行中的書籍
          </div>
        ) : (
          books.map(book => {
            const days = book.startDate
              ? Math.floor((Date.now() - new Date(book.startDate).getTime()) / 86400000)
              : null

            return (
              <a key={book.pageId} href={`/library/${book.pageId}`}
                style={{ display: 'flex', gap: 16, padding: '16px 8px', borderBottom: '1px solid #2a2820', textDecoration: 'none' }}>
                {/* Cover */}
                <div style={{ flexShrink: 0 }}>
                  {book.cover
                    ? <img src={book.cover} alt="" style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 3 }} />
                    : <div style={{ width: 56, height: 80, background: '#1a1915', border: '1px solid #2a2820', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📖</div>
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 16, color: '#e4dccb', lineHeight: 1.4, marginBottom: 4 }}>
                    {book.title}
                  </div>
                  {book.subtitle && (
                    <div style={{ fontSize: 12, color: '#847a68', marginBottom: 6, lineHeight: 1.5 }}>{book.subtitle}</div>
                  )}
                  <div style={{ fontSize: 12, color: '#847a68', marginBottom: 10 }}>
                    {book.author}{book.author && book.publisher ? ' · ' : ''}{book.publisher}
                  </div>

                  {/* Tags */}
                  {book.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                      {book.tags.map(t => (
                        <span key={t} style={{
                          fontSize: 10, color: '#3e3a32', border: '1px solid #2a2820',
                          borderRadius: 2, padding: '1px 5px', letterSpacing: '0.05em',
                        }}>{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Progress bar placeholder + days */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 2, background: '#2a2820', borderRadius: 1 }}>
                      <div style={{ width: '40%', height: '100%', background: '#7a6340', borderRadius: 1 }} />
                    </div>
                    {days !== null && (
                      <span style={{ fontSize: 11, color: '#7a6340', flexShrink: 0 }}>第 {days} 天</span>
                    )}
                  </div>

                  {book.startDate && (
                    <div style={{ fontSize: 10, color: '#3e3a32', marginTop: 4 }}>
                      開始於 {book.startDate.replace(/-/g, '/')}
                    </div>
                  )}
                </div>
              </a>
            )
          })
        )}
      </div>
    </div>
  )
}
