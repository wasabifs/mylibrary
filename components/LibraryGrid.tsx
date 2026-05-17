'use client'

import { useState, useMemo } from 'react'
import type { Book } from '@/lib/notion'

type SortKey = 'start' | 'finish' | 'no'

export default function LibraryGrid({ books, allTags }: { books: Book[]; allTags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('no')

  const filtered = useMemo(() => {
    let list = activeTag ? books.filter(b => b.tags.includes(activeTag)) : [...books]

    list.sort((a, b) => {
      if (sort === 'start') {
        if (!a.startDate && !b.startDate) return 0
        if (!a.startDate) return 1
        if (!b.startDate) return -1
        return b.startDate.localeCompare(a.startDate)
      }
      if (sort === 'finish') {
        if (!a.finishDate && !b.finishDate) return 0
        if (!a.finishDate) return 1
        if (!b.finishDate) return -1
        return b.finishDate.localeCompare(a.finishDate)
      }
      // default: no (newest first)
      const na = parseInt(a.no.replace(/\D/g, '')) || 0
      const nb = parseInt(b.no.replace(/\D/g, '')) || 0
      return nb - na
    })
    return list
  }, [books, activeTag, sort])

  return (
    <>
      {/* Filters */}
      <div style={{ borderBottom: '1px solid #2a2820' }}>
        {/* Sort row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 16px', borderBottom: '1px solid #2a2820',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          <span style={{ fontSize: 10, color: '#3e3a32', letterSpacing: '0.1em', flexShrink: 0 }}>排序</span>
          {([['no', '加入順序'], ['start', '開始日期'], ['finish', '完讀日期']] as [SortKey, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSort(key)} style={{
              flexShrink: 0,
              padding: '4px 10px', borderRadius: 3,
              border: `1px solid ${sort === key ? '#7a6340' : '#2a2820'}`,
              background: sort === key ? '#1a1915' : 'transparent',
              color: sort === key ? '#c9a96e' : '#847a68',
              fontSize: 11, cursor: 'pointer', letterSpacing: '0.05em',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Tag row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 16px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          <span style={{ fontSize: 10, color: '#3e3a32', letterSpacing: '0.1em', flexShrink: 0 }}>標籤</span>
          <button onClick={() => setActiveTag(null)} style={{
            flexShrink: 0,
            padding: '4px 10px', borderRadius: 3,
            border: `1px solid ${!activeTag ? '#7a6340' : '#2a2820'}`,
            background: !activeTag ? '#1a1915' : 'transparent',
            color: !activeTag ? '#c9a96e' : '#847a68',
            fontSize: 11, cursor: 'pointer',
          }}>
            全部
          </button>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag === activeTag ? null : tag)} style={{
              flexShrink: 0,
              padding: '4px 10px', borderRadius: 3,
              border: `1px solid ${activeTag === tag ? '#7a6340' : '#2a2820'}`,
              background: activeTag === tag ? '#1a1915' : 'transparent',
              color: activeTag === tag ? '#c9a96e' : '#847a68',
              fontSize: 11, cursor: 'pointer',
            }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        padding: '9px 20px', borderBottom: '1px solid #2a2820',
        fontSize: 11, color: '#847a68', letterSpacing: '0.1em',
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a96e' }} />
        顯示 {filtered.length} / {books.length} 本
      </div>

      {/* Grid */}
      <div style={{ padding: '16px 12px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px 8px',
        }}>
          {filtered.map(book => (
            <a key={book.pageId} href={`/library/${book.pageId}`}
              style={{ textDecoration: 'none', display: 'block' }}>
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
                {/* Reading indicator */}
                {!book.finishDate && book.startDate && (
                  <div style={{
                    position: 'absolute', top: 5, right: 5,
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#c9a96e', boxShadow: '0 0 6px #c9a96e',
                  }} />
                )}
              </div>
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
      </div>
    </>
  )
}
