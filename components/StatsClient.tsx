'use client'

import type { ReadingStats } from '@/lib/notion'

// ─── Constants ─────────────────────────────────────────────────────────────
const GAP = 10       // gap between all cards and section dividers
const PAD = 16       // padding inside each card

// ─── Uniform stat card ──────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div style={{
      background: '#131210',
      border: '1px solid #2a2820',
      borderRadius: 8,
      padding: PAD,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 4,
      minHeight: 90,
    }}>
      <div style={{
        fontSize: 9,
        color: '#6b6355',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        lineHeight: 1.3,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Noto Serif TC, serif',
        fontSize: 28,
        color: '#c9a96e',
        lineHeight: 1.1,
        fontWeight: 400,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: '#9a9080', lineHeight: 1.3 }}>{sub}</div>
      )}
    </div>
  )
}

// ─── Section divider ────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10,
      color: '#7a6340',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      paddingTop: GAP * 1.5,
      paddingBottom: GAP,
      borderTop: '1px solid #2a2820',
      textAlign: 'center',
    }}>
      {children}
    </div>
  )
}

// ─── Bar row ────────────────────────────────────────────────────────────────
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
    <div style={{ marginBottom: GAP }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#c4bcac' }}>{label}</span>
        <span style={{ fontSize: 12, color: '#7a6340' }}>{value}{suffix}</span>
      </div>
      <div style={{ height: 4, background: '#1a1915', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #7a6340, #c9a96e)',
          borderRadius: 2,
        }} />
      </div>
    </div>
  )
}

// ─── Rating card (uniform width) ────────────────────────────────────────────
function RatingCard({ rating, count }: { rating: string; count: number }) {
  return (
    <div style={{
      background: '#131210',
      border: '1px solid #2a2820',
      borderRadius: 8,
      padding: PAD,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 4,
      flex: '1 1 0',   // equal width flex items
      minHeight: 90,
    }}>
      <div style={{ fontSize: 13, color: '#c9a96e', lineHeight: 1.3 }}>{rating}</div>
      <div style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 24, color: '#e4dccb', lineHeight: 1.1 }}>
        {count}
      </div>
      <div style={{ fontSize: 10, color: '#6b6355' }}>本</div>
    </div>
  )
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function StatsClient({ stats }: { stats: ReadingStats }) {
  const maxYearCount = Math.max(...stats.byYear.map(y => y.count), 1)
  const maxTagCount = Math.max(...stats.byTag.map(t => t.count), 1)

  return (
    <div style={{ padding: `${GAP * 2}px ${GAP * 2}px 80px`, maxWidth: 560, margin: '0 auto' }}>

      {/* ── Row 1: 總藏書 / 已完讀 / 閱讀中 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: GAP }}>
        <StatCard label="總藏書" value={stats.totalBooks} sub="本" />
        <StatCard label="已完讀" value={stats.totalFinished} sub="本" />
        <StatCard label="閱讀中" value={stats.totalReading} sub="本" />
      </div>

      {/* ── Row 2: 待閱讀 / 有節錄 / 最多節錄 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: GAP, marginTop: GAP }}>
        <StatCard label="待閱讀" value={stats.totalUnread} sub="本" />
        <StatCard label="有節錄" value={stats.totalHighlightBooks} sub="本" />
        <StatCard
          label="最多節錄"
          value={stats.mostTagged ? stats.mostTagged.tag : '-'}
          sub={stats.mostTagged ? `${stats.mostTagged.count} 本` : ''}
        />
      </div>

      {/* ── Row 3: 平均天數 / 最快完讀 / 最長閱讀 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: GAP, marginTop: GAP }}>
        <StatCard
          label="平均完讀"
          value={stats.avgDaysPerBook}
          sub="天 / 本"
        />
        <StatCard
          label="最快完讀"
          value={stats.fastestBook ? `${stats.fastestBook.days}天` : '-'}
          sub={stats.fastestBook ? stats.fastestBook.title.slice(0, 8) : ''}
        />
        <StatCard
          label="最長閱讀"
          value={stats.longestBook ? `${stats.longestBook.days}天` : '-'}
          sub={stats.longestBook ? stats.longestBook.title.slice(0, 8) : ''}
        />
      </div>

      {/* ── Rating ── */}
      {stats.byRating.length > 0 && (
        <>
          <SectionTitle>推薦評級統計</SectionTitle>
          {/* Two rows of equal-width flex cards */}
          <div style={{ display: 'flex', gap: GAP, flexWrap: 'wrap' }}>
            {stats.byRating.map(({ rating, count }) => (
              <RatingCard key={rating} rating={rating} count={count} />
            ))}
          </div>
        </>
      )}

      {/* ── By year ── */}
      {stats.byYear.length > 0 && (
        <>
          <SectionTitle>每年完讀數量</SectionTitle>
          <div>
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
          <div>
            {stats.byTag.slice(0, 15).map(({ tag, count }) => (
              <BarRow key={tag} label={tag} value={count} max={maxTagCount} suffix=" 本" />
            ))}
            {stats.byTag.length > 15 && (
              <div style={{ fontSize: 11, color: '#6b6355', textAlign: 'center', paddingTop: 4 }}>
                共 {stats.byTag.length} 個標籤
              </div>
            )}
          </div>
        </>
      )}

    </div>
  )
}
