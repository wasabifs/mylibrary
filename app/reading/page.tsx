import { getReadingBooks } from '@/lib/notion'
import SyncButton from '@/components/SyncButton'

export const revalidate = 3600

export default async function ReadingPage() {
  const books = await getReadingBooks()

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{
        padding: '36px 20px 20px', borderBottom: '1px solid #2a2820',
        position: 'sticky', top: 0, background: '#0f0e0c', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 20, color: '#c9a96e' }}>閱讀中</span>
            <span style={{ fontSize: 10, color: '#847a68', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Reading</span>
          </div>
          <SyncButton />
        </div>
      </div>

      <div style={{
        padding: '10px 20px', borderBottom: '1px solid #2a2820',
        fontSize: 11, color: '#847a68', letterSpacing: '0.1em',
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a96e', boxShadow: '0 0 6px #c9a96e' }} />
        目前 {books.length} 本進行中
      </div>

      <div style={{ padding: '4px 16px 80px' }}>
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
                style={{ display: 'flex', gap: 16, padding: '18px 8px', borderBottom: '1px solid #2a2820', textDecoration: 'none' }}>
                <div style={{ flexShrink: 0 }}>
                  {book.cover
                    ? <img src={book.cover} alt="" style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 3 }} />
                    : <div style={{ width: 56, height: 80, background: '#1a1915', border: '1px solid #2a2820', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📖</div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5 }}>
                  <div style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 16, color: '#e4dccb', lineHeight: 1.4 }}>
                    {book.title}
                  </div>
                  {book.subtitle && (
                    <div style={{ fontSize: 12, color: '#847a68', lineHeight: 1.4 }}>{book.subtitle}</div>
                  )}
                  <div style={{ fontSize: 12, color: '#847a68' }}>
                    {[book.author, book.publisher].filter(Boolean).join(' · ')}
                  </div>
                  {book.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {book.tags.map(t => (
                        <span key={t} style={{
                          fontSize: 10, color: '#3e3a32', border: '1px solid #2a2820',
                          borderRadius: 2, padding: '1px 5px',
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                    {book.startDate && (
                      <span style={{ fontSize: 11, color: '#3e3a32' }}>
                        {book.startDate.replace(/-/g, '/')} 開始
                      </span>
                    )}
                    {days !== null && (
                      <span style={{
                        fontSize: 11, color: '#7a6340',
                        background: '#1a1915', border: '1px solid #2a2820',
                        borderRadius: 3, padding: '2px 7px',
                      }}>
                        第 {days} 天
                      </span>
                    )}
                  </div>
                </div>
              </a>
            )
          })
        )}
      </div>
    </div>
  )
}
