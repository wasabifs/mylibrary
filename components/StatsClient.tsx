'use client'

import type { ReadingStats } from '@/lib/notion'

// ─── Sub-components ────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      background: '#131210',
      border: '1px solid #2a2820',
      borderRadius: 8,
      padding: '16px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ fontSize: 10, color: '#3e3a32', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 26, color: '#c9a96e', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#847a68' }}>{sub}</div>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11,
      color: '#7a6340',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      padding: '24px 0 10px',
      borderTop: '1px solid #2a2820',
    }}>
      {children}
    </div>
  )
}

function BarRow({
  label,
  value,
  max,
  suffix = '',
}: {
  label: string
  value: number
  max: number
  suffix?: string
}) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#c4bcac' }}>{label}</span>
        <span style={{ fontSize: 12, color: '#7a6340' }}>{value}{suffix}</span>
      </div>
      <div style={{ height: 4, background: '#1a1915', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #7a6340, #c9a96e)',
          borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function StatsClient({ stats }: { stats: ReadingStats }) {
  const maxYearCount = Math.max(...stats.byYear.map(y => y.count), 1)
  const maxTagCount = Math.max(...stats.byTag.map(t => t.count), 1)

  return (
    <div style={{ padding: '20px 20px 80px', maxWidth: 560, margin: '0 auto' }}>

      {/* ── Overview cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 10,
        marginBottom: 4,
      }}>
        <StatCard label="總藏書" value={stats.totalBooks} sub="本" />
        <StatCard label="已完讀" value={stats.totalFinished} sub={`共 ${stats.totalBooks} 本`} />
        <StatCard label="閱讀中" value={stats.totalReading} sub="本進行中" />
        <StatCard label="有節錄" value={stats.totalHighlightBooks} sub="本書有重點" />
      </div>

      {/* ── Reading speed ── */}
      <SectionTitle>閱讀速度</SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 10,
        marginBottom: 4,
      }}>
        <StatCard
          label="平均完讀天數"
          value={stats.avgDaysPerBook}
          sub="天 / 本"
        />
        <StatCard
          label="最快完讀"
          value={stats.fastestBook ? stats.fastestBook.days : '-'}
          sub={stats.fastestBook ? `天・${stats.fastestBook.title.slice(0, 10)}` : ''}
        />
      </div>
      {stats.longestBook && (
        <div style={{
          background: '#131210',
          border: '1px solid #2a2820',
          borderRadius: 8,
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}>
          <div>
            <div style={{ fontSize: 10, color: '#3e3a32', letterSpacing: '0.1em', marginBottom: 3 }}>最長閱讀</div>
            <div style={{ fontSize: 13, color: '#c4bcac' }}>{stats.longestBook.title}</div>
          </div>
          <div style={{ fontSize: 22, color: '#c9a96e', fontFamily: 'Noto Serif TC, serif', flexShrink: 0 }}>
            {stats.longestBook.days} 天
          </div>
        </div>
      )}

      {/* ── By rating ── */}
      {stats.byRating.length > 0 && (
        <>
          <SectionTitle>推薦評級分佈</SectionTitle>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 4,
          }}>
            {stats.byRating.map(({ rating, count }) => (
              <div key={rating} style={{
                background: '#131210',
                border: '1px solid #2a2820',
                borderRadius: 6,
                padding: '8px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                minWidth: 64,
              }}>
                <div style={{ fontSize: 13, color: '#c9a96e' }}>{rating}</div>
                <div style={{ fontSize: 18, fontFamily: 'Noto Serif TC, serif', color: '#e4dccb' }}>{count}</div>
                <div style={{ fontSize: 10, color: '#3e3a32' }}>本</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── By year ── */}
      {stats.byYear.length > 0 && (
        <>
          <SectionTitle>每年完讀數量</SectionTitle>
          <div style={{ marginBottom: 4 }}>
            {stats.byYear.map(({ year, count }) => (
              <BarRow key={year} label={`${year} 年`} value={count} max={maxYearCount} suffix=" 本" />
            ))}
          </div>
        </>
      )}

      {/* ── By tag ── */}
      {stats.byTag.length > 0 && (
        <>
          <SectionTitle>標籤分佈（前 15）</SectionTitle>
          <div style={{ marginBottom: 4 }}>
            {stats.byTag.slice(0, 15).map(({ tag, count }) => (
              <BarRow key={tag} label={tag} value={count} max={maxTagCount} suffix=" 本" />
            ))}
          </div>
          {stats.byTag.length > 15 && (
            <div style={{ fontSize: 11, color: '#3e3a32', textAlign: 'center', paddingTop: 4 }}>
              共 {stats.byTag.length} 個標籤
            </div>
          )}
        </>
      )}

    </div>
  )
}
