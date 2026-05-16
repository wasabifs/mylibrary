'use client'

import { useState, useMemo } from 'react'
import type { Book } from '@/lib/notion'
import styles from './LibraryClient.module.css'

function highlightText(text: string, query: string) {
  if (!query) return <>{text}</>
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className={styles.mark}>{p}</mark>
          : p
      )}
    </>
  )
}

export default function LibraryClient({ books, error }: { books: Book[]; error: string }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return books
    const q = query.trim().toLowerCase()
    return books
      .map(book => ({
        ...book,
        highlights: book.highlights.filter(h => h.toLowerCase().includes(q)),
      }))
      .filter(book =>
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.highlights.length > 0
      )
  }, [books, query])

  const totalHighlights = useMemo(
    () => filtered.reduce((s, b) => s + b.highlights.length, 0),
    [filtered]
  )

  if (error) {
    return (
      <div className={styles.stateMsg}>
        <div className={styles.stateIcon}>⚠️</div>
        <p>載入失敗</p>
        <p className={styles.stateSmall}>{error}</p>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.logo}>MyLibrary</span>
          <span className={styles.logoSub}>節錄重點</span>
        </div>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            className={styles.searchInput}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜尋關鍵字、書名、作者…"
            autoComplete="off"
            autoCorrect="off"
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
          )}
        </div>
      </header>

      {/* Stats */}
      <div className={styles.stats}>
        <span className={styles.statsDot} />
        {filtered.length} 本書 · {totalHighlights} 條節錄
        {query && <span className={styles.statsQuery}> · 關鍵字「{query}」</span>}
      </div>

      {/* Book list */}
      <main className={styles.main}>
        {filtered.length === 0 ? (
          <div className={styles.stateMsg}>
            <div className={styles.stateIcon}>📭</div>
            <p>{query ? `找不到「${query}」的相關節錄` : '暫無資料'}</p>
          </div>
        ) : (
          filtered.map(book => {
            const hls = query
              ? book.highlights.filter(h => h.toLowerCase().includes(query.trim().toLowerCase()))
              : book.highlights
            if (hls.length === 0) return null

            return (
              <div key={book.pageId} className={styles.bookGroup}>
                {/* Book header */}
                <div className={styles.bookHeader}>
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt=""
                      className={styles.bookCover}
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <div className={styles.bookCoverPlaceholder}>📖</div>
                  )}
                  <div className={styles.bookInfo}>
                    <div className={styles.bookTitle}>
                      {highlightText(book.title, query.trim())}
                    </div>
                    <div className={styles.bookMeta}>
                      {book.author && <span>{book.author}</span>}
                      {book.rating && <span>{book.rating}</span>}
                      {book.finishDate && (
                        <span>{book.finishDate.replace(/-/g, '/')}</span>
                      )}
                    </div>
                    {book.tags.length > 0 && (
                      <div className={styles.tags}>
                        {book.tags.map(t => (
                          <span key={t} className={styles.tag}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.bookCount}>{hls.length} 條</div>
                </div>

                {/* Highlights */}
                <div className={styles.highlights}>
                  {hls.map((h, i) => (
                    <div key={i} className={styles.card}>
                      {highlightText(h, query.trim())}
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </main>
    </div>
  )
}
