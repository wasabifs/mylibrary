'use client'

import { useState, useMemo } from 'react'
import type { Book } from '@/lib/notion'

type SortKey = 'start' | 'finish' | 'no'
type SortDir = 'asc' | 'desc'

export default function LibraryGrid({ books, allTags }: { books: Book[]; allTags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('no')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    let list = books.filter(b => {
      // tag filter
      if (activeTag && !b.tags.includes(activeTag)) return false
      // search filter
      if (q) {
        return (
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q)
        )
      }
      return true
    })

    list = [...list].sort((a, b) => {
      let result = 0
      if (sort === 'start') {
        if (!a.startDate && !b.startDate) result = 0
        else if (!a.startDate) result = 1
        else if (!b.startDate) result = -1
        else result = a.startDate.localeCompare(b.startDate)
      } else if (sort === 'finish') {
        if (!a.finishDate && !b.finishDate) result = 0
        else if (!a.finishDate) result = 1
        else if (!b.finishDate) result = -1
        else result = a.finishDate.localeCompare(b.finishDate)
      } else {
        // no
        const na = parseInt(a.no.replace(/\D/g, '')) || 0
        const nb = parseInt(b.no.replace(/\D/g, '')) || 0
        result = na - nb
      }
      return sortDir === 'desc' ? -result : result
    })

    return list
  }, [books, activeTag, sort, sortDir, search])

  const btnStyle = (active: boolean) => ({
    flexShrink: 0 as const,
    padding: '4px 10px',
    borderRadius: 3,
    border: `1px solid ${active ? '#7a6340' : '#2a2820'}`,
    background: active ? '#1a1915' : 'transparent',
    color: active ? '#c9a96e' : '#847a68',
    fontSize: 11,
    cursor: 'pointer' as const,
    letterSpacing: '0.05em',
  })

  return (
    <>
      {/* Filters */}
      <div style={{ borderBottom: '1px solid #2a2820' }}>

        {/* Search row */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #2a2820' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#1a1915',
            border: '1px solid #2a2820',
            borderRadius: 6,
            padding: '6px 12px',
          }}>
            <span style={{ color: '#3e3a32', fontSize: 14 }}>⌕</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜尋書名、作者…"
              autoComplete="off"
              autoCorrect="off"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e4dccb',
                fontSize: 14,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', color: '#3e3a32', cursor: 'pointer', fontSize: 12, padding: 0 }}
              >✕</button>
            )}
          </div>
        </div>

        {/* Sort row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          borderBottom: '1px solid #2a2820',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          <span style={{ fontSize: 10, color: '#3e3a32', letterSpacing: '0.1em', flexShrink: 0 }}>排序</span>
          {([
            ['no', '加入順序'],
            ['start', '開始日期'],
            ['finish', '完讀日期'],
          ] as [SortKey, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSort(key)} style={btnStyle(sort === key)}>
              {label}
            </button>
          ))}
          {/* Direction toggle */}
          <button
            onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
            title={sortDir === 'desc' ? '目前：降序' : '目前：升序'}
            style={{
              ...btnStyle(false),
              marginLeft: 4,
              padding: '4px 8px',
              fontSize: 13,
              color: '#c9a96e',
              border: '1px solid #7a6340',
            }}
          >
            {sortDir === 'desc' ? '↓' : '↑'}
          </button>
        </div>

        {/* Tag row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          <span style={{ fontSize: 10, color: '#3e3a32', letterSpacing: '0.1em', flexShrink: 0 }}>標籤</span>
          <button onClick={() => setActiveTag(null)} style={btnStyle(!activeTag)}>
            全部
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              style={btnStyle(activeTag === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        padding: '9px 20px',
        borderBottom: '1px solid #2a2820',
        fontSize: 11,
        color: '#847a68',
        letterSpacing: '0.1em',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a96e' }} />
        顯示 {filtered.length} / {books.length} 本
        {search && <span style={{ color: '#7a6340' }}>· 搜尋「{search}」</span>}
      </div>

      {/* Grid */}
      <div style={{ padding: '16px 12px 80px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#847a68', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
            找不到相關書籍
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px 8px',
          }}>
            {filtered.map(book => (
              <a
                key={book.pageId}
                href={`/library/${book.pageId}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
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
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#c9a96e',
                      boxShadow: '0 0 6px #c9a96e',
                    }} />
                  )}
                </div>
                <div style={{
                  fontSize: 11,
                  color: '#c4bcac',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {book.title}
                </div>
                {book.author && (
                  <div style={{ fontSize: 10, color: '#3e3a32', marginTop: 2 }}>{book.author}</div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
