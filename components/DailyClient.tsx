'use client'

import { useMemo } from 'react'
import type { ExcerptFlat } from '@/lib/notion'

// ─── Seeded random (Linear Congruential Generator) ─────────────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = Math.imul(1664525, s) + 1013904223
    return (s >>> 0) / 0xffffffff
  }
}

function getTodaySeed() {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

function pickN<T>(arr: T[], n: number, seed: number): T[] {
  if (arr.length === 0) return []
  const rand = seededRandom(seed)
  const shuffled = [...arr].sort(() => rand() - 0.5)
  return shuffled.slice(0, n)
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function DailyClient({ excerpts }: { excerpts: ExcerptFlat[] }) {
  const today = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const picks = useMemo(() => pickN(excerpts, 3, getTodaySeed()), [excerpts])

  return (
    <div style={{ padding: '20px 20px 80px', maxWidth: 560, margin: '0 auto' }}>
      {/* Date */}
      <div style={{
        fontSize: 11,
        color: '#3e3a32',
        letterSpacing: '0.15em',
        marginBottom: 24,
        paddingTop: 4,
      }}>
        {today}
      </div>

      {picks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#847a68', fontSize: 13 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          尚無節錄資料
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {picks.map((item, i) => (
            <div
              key={i}
              style={{
                background: '#131210',
                border: '1px solid #2a2820',
                borderLeft: '3px solid #7a6340',
                borderRadius: '0 8px 8px 0',
                padding: '20px 18px',
                animation: 'fadeUp 0.3s ease both',
                animationDelay: `${i * 0.08}s`,
              }}
            >
              {/* Excerpt text */}
              <p style={{
                fontFamily: 'Noto Serif TC, serif',
                fontSize: 14.5,
                lineHeight: 1.9,
                color: '#c4bcac',
                margin: 0,
                marginBottom: 16,
                whiteSpace: 'pre-wrap',
              }}>
                {item.text}
              </p>

              {/* Book info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                paddingTop: 12,
                borderTop: '1px solid #2a2820',
              }}>
                {item.bookCover && (
                  <img
                    src={item.bookCover}
                    alt=""
                    style={{ width: 28, height: 40, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#847a68',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.bookTitle}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 2, alignItems: 'center' }}>
                    {item.author && (
                      <span style={{ fontSize: 11, color: '#3e3a32' }}>{item.author}</span>
                    )}
                    {item.rating && (
                      <span style={{ fontSize: 11, color: '#7a6340' }}>{item.rating}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer note */}
      {picks.length > 0 && (
        <p style={{
          textAlign: 'center',
          fontSize: 11,
          color: '#3e3a32',
          marginTop: 32,
          letterSpacing: '0.1em',
        }}>
          每日自動更新 · 共 {excerpts.length} 條節錄
        </p>
      )}
    </div>
  )
}
