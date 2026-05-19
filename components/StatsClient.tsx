'use client'

import type { ReadingStats } from '@/lib/notion'

// ─── Constants ─────────────────────────────────────────────────────────────
const GAP = 10
const PAD = 16
const MONTH_LABELS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

// ─── Uniform stat card ──────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      background: '#131210', border: '1px solid #2a2820', borderRadius: 8,
      padding: PAD, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', gap: 4, minHeight: 90,
    }}>
      <div style={{ fontSize: 9, color: '#6b6355', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.3 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 28, color: '#c9a96e', lineHeight: 1.1, fontWeight: 400 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 10, color: '#9a9080', lineHeight: 1.3 }}>{sub}</div>}
    </div>
  )
}

// ─── Section divider ────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, color: '#7a6340', letterSpacing: '0.2em', textTransform: 'uppercase',
      paddingTop: GAP * 1.5, paddingBottom: GAP, borderTop: '1px solid #2a2820', textAlign: 'center',
    }}>
      {children}
    </div>
  )
}

// ─── Bar row ────────────────────────────────────────────────────────────────
function BarRow({ label, value, max, suffix = '' }: { label: string; value: number; max: number; suffix?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ marginBottom: GAP }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#c4bcac' }}>{label}</span>
        <span style={{ fontSize: 12, color: '#7a6340' }}>{value}{suffix}</span>
      </div>
      <div style={{ height: 4, background: '#1a1915', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #7a6340, #c9a96e)', borderRadius: 2 }} />
      </div>
    </div>
  )
}

// ─── Rating card ────────────────────────────────────────────────────────────
function RatingCard({ rating, count }: { rating: string; count: number }) {
  return (
    <div style={{
      background: '#131210', border: '1px solid #2a2820', borderRadius: 8, padding: PAD,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', gap: 4, flex: '1 1 0', minHeight: 90,
    }}>
      <div style={{ fontSize: 13, color: '#c9a96e', lineHeight: 1.3 }}>{rating}</div>
      <div style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 24, color: '#e4dccb', lineHeight: 1.1 }}>{count}</div>
      <div style={{ fontSize: 10, color: '#6b6355' }}>本</div>
    </div>
  )
}

// ─── 月份分佈長條圖（SVG） ───────────────────────────────────────────────────
function MonthBarChart({ data }: { data: { month: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  const W = 320, H = 110
  const barW = 18, gap = (W - data.length * barW) / (data.length + 1)

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
        {data.map((d, i) => {
          const barH = Math.max(2, (d.count / max) * 72)
          const x = gap + i * (barW + gap)
          const y = 80 - barH
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} fill="#c9a96e" rx={2} opacity={0.8} />
              {d.count > 0 && (
                <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize={8} fill="#9a9080">{d.count}</text>
              )}
              <text x={x + barW / 2} y={96} textAnchor="middle" fontSize={8} fill="#6b6355">
                {MONTH_LABELS[i]}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── 閱讀趨勢折線圖（SVG，時間由舊到新） ────────────────────────────────────
function TrendLineChart({ data }: { data: { year: string; count: number }[] }) {
  if (data.length < 2) return null
  // 由舊到新排序
  const sorted = [...data].sort((a, b) => a.year.localeCompare(b.year))
  const max = Math.max(...sorted.map(d => d.count), 1)
  const W = 320, H = 120
  const PL = 28, PR = 12, PT = 16, PB = 24
  const iW = W - PL - PR, iH = H - PT - PB

  const pts = sorted.map((d, i) => ({
    x: PL + (i / (sorted.length - 1)) * iW,
    y: PT + iH - (d.count / max) * iH,
    label: d.year,
    value: d.count,
  }))

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const fillD = `${pathD} L ${pts[pts.length-1].x.toFixed(1)} ${(PT+iH).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(PT+iH).toFixed(1)} Z`
  const yTicks = [0, Math.round(max / 2), max]

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
        {yTicks.map(tick => {
          const y = PT + iH - (tick / max) * iH
          return (
            <g key={tick}>
              <line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#2a2820" strokeWidth={0.5} strokeDasharray="3,3" />
              <text x={PL-4} y={y+3} textAnchor="end" fontSize={8} fill="#6b6355">{tick}</text>
            </g>
          )
        })}
        <path d={fillD} fill="#c9a96e" opacity={0.08} />
        <path d={pathD} fill="none" stroke="#c9a96e" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3} fill="#c9a96e" />
            <text x={p.x} y={PT+iH+14} textAnchor="middle" fontSize={8} fill="#6b6355">{p.label}</text>
          </g>
        ))}
      </svg>
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
          value={stats.maxHighlightBook ? stats.maxHighlightBook.count : '-'}
          sub={stats.maxHighlightBook ? stats.maxHighlightBook.title.slice(0, 8) : ''}
        />
      </div>

      {/* ── Row 3: 平均天數 / 最快完讀 / 最長閱讀 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: GAP, marginTop: GAP }}>
        <StatCard label="平均完讀" value={stats.avgDaysPerBook} sub="天 / 本" />
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
          <div style={{ display: 'flex', gap: GAP, flexWrap: 'wrap' }}>
            {stats.byRating.map(({ rating, count }) => (
              <RatingCard key={rating} rating={rating} count={count} />
            ))}
          </div>
        </>
      )}

      {/* ── 月份分佈 ── */}
      {stats.byMonth && stats.byMonth.some(m => m.count > 0) && (
        <>
          <SectionTitle>完讀月份分佈</SectionTitle>
          <MonthBarChart data={stats.byMonth} />
        </>
      )}

      {/* ── 閱讀趨勢折線圖 ── */}
      {stats.byYear.length >= 2 && (
        <>
          <SectionTitle>每年完讀趨勢</SectionTitle>
          <TrendLineChart data={stats.byYear} />
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
