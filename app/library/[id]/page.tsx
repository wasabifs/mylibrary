import { getBookDetail } from '@/lib/notion'
import { notFound } from 'next/navigation'

export const revalidate = 600

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  let book
  try {
    book = await getBookDetail(params.id)
  } catch {
    notFound()
  }

  const readingDays = book.startDate && book.finishDate
    ? Math.floor((new Date(book.finishDate).getTime() - new Date(book.startDate).getTime()) / 86400000)
    : book.startDate && !book.finishDate
    ? Math.floor((Date.now() - new Date(book.startDate).getTime()) / 86400000)
    : null

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Back + Header */}
      <div style={{
        padding: '16px 20px 0',
        position: 'sticky', top: 0,
        background: '#0f0e0c', zIndex: 10,
        borderBottom: '1px solid #2a2820',
      }}>
        <a href="/library" style={{ fontSize: 13, color: '#847a68', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
          ← 圖書館
        </a>
      </div>

      {/* Hero */}
      <div style={{
        display: 'flex', gap: 20, padding: '24px 20px 20px',
        borderBottom: '1px solid #2a2820',
      }}>
        <div style={{ flexShrink: 0 }}>
          {book.cover
            ? <img src={book.cover} alt="" style={{ width: 80, height: 116, objectFit: 'cover', borderRadius: 4 }} />
            : <div style={{ width: 80, height: 116, background: '#1a1915', border: '1px solid #2a2820', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📖</div>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {book.no && <div style={{ fontSize: 10, color: '#7a6340', letterSpacing: '0.1em', marginBottom: 4 }}>{book.no}</div>}
          <h1 style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 18, fontWeight: 400, color: '#e4dccb', lineHeight: 1.4, marginBottom: 6 }}>
            {book.title}
          </h1>
          {book.subtitle && (
            <p style={{ fontSize: 12, color: '#847a68', lineHeight: 1.5, marginBottom: 8 }}>{book.subtitle}</p>
          )}
          <div style={{ fontSize: 12, color: '#847a68' }}>
            {[book.author, book.publisher].filter(Boolean).join(' · ')}
          </div>
          {book.rating && (
            <div style={{ marginTop: 8, fontSize: 13, color: '#c9a96e' }}>{book.rating}</div>
          )}
        </div>
      </div>

      {/* Tags */}
      {book.tags.length > 0 && (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #2a2820', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {book.tags.map(t => (
            <span key={t} style={{
              fontSize: 11, color: '#847a68', border: '1px solid #2a2820',
              borderRadius: 3, padding: '2px 8px',
            }}>{t}</span>
          ))}
        </div>
      )}

      {/* Dates */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #2a2820', display: 'flex', gap: 24 }}>
        {book.startDate && (
          <div>
            <div style={{ fontSize: 10, color: '#3e3a32', letterSpacing: '0.1em', marginBottom: 2 }}>開始</div>
            <div style={{ fontSize: 13, color: '#847a68' }}>{book.startDate.replace(/-/g, '/')}</div>
          </div>
        )}
        {book.finishDate && (
          <div>
            <div style={{ fontSize: 10, color: '#3e3a32', letterSpacing: '0.1em', marginBottom: 2 }}>完成</div>
            <div style={{ fontSize: 13, color: '#847a68' }}>{book.finishDate.replace(/-/g, '/')}</div>
          </div>
        )}
        {readingDays !== null && (
          <div>
            <div style={{ fontSize: 10, color: '#3e3a32', letterSpacing: '0.1em', marginBottom: 2 }}>
              {book.finishDate ? '花費' : '已讀'}
            </div>
            <div style={{ fontSize: 13, color: '#847a68' }}>{readingDays} 天</div>
          </div>
        )}
      </div>

      {/* Info sections */}
      <div style={{ padding: '0 20px' }}>
        <Section label="閱讀動機" content={book.motivation} />
        <Section label="書籍介紹" content={book.bookInfo} />
        <Section label="讀後啟發" content={book.afterthought} />
        <Section label="後續行動" content={book.followUp} />
        <Section label="AI 摘要" content={book.aiSummary} />
      </div>

      {/* Highlights */}
      {book.highlights.length > 0 && (
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 11, color: '#3e3a32', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '20px 0 12px', borderTop: '1px solid #2a2820', marginTop: 4 }}>
            節錄重點 · {book.highlights.length} 條
          </div>
          {book.highlights.map((h, i) => (
            <div key={i} style={{
              background: '#131210',
              borderLeft: '2px solid #7a6340',
              borderRadius: '0 4px 4px 0',
              padding: '12px 14px',
              marginBottom: 8,
              fontFamily: 'Noto Serif TC, serif',
              fontSize: 13.5,
              lineHeight: 2,
              color: '#c4bcac',
              whiteSpace: 'pre-wrap',
            }}>
              {h}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Section({ label, content }: { label: string; content: string }) {
  if (!content) return null
  return (
    <div style={{ padding: '16px 0', borderTop: '1px solid #2a2820' }}>
      <div style={{ fontSize: 10, color: '#3e3a32', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 13.5, color: '#c4bcac', lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: 'Noto Serif TC, serif' }}>
        {content}
      </div>
    </div>
  )
}
