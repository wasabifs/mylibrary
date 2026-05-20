import { getReadingStats, type ReadingStats } from '@/lib/notion'
import StatsClient from '@/components/StatsClient'
import SyncButton from '@/components/SyncButton'

export const revalidate = false  // 只靠手動 ⟳ 更新（stats 計算量大）

const emptyStats: ReadingStats = {
  totalBooks: 0, totalFinished: 0, totalReading: 0,
  totalUnread: 0, totalHighlightBooks: 0, maxHighlightBook: null,
  byYear: [], byMonth: [], byTag: [], byRating: [],
  avgDaysPerBook: 0, longestBook: null, fastestBook: null, mostTagged: null,
}

export default async function StatsPage() {
  let stats: ReadingStats = emptyStats
  try {
    stats = await getReadingStats()
  } catch (e) {
    // silently fail — show empty state
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{
        padding: '36px 20px 20px',
        borderBottom: '1px solid #2a2820',
        position: 'sticky',
        top: 0,
        background: '#0f0e0c',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 20, color: '#c9a96e' }}>統計</span>
            <span style={{ fontSize: 10, color: '#9a9080', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Stats</span>
          </div>
          <SyncButton />
        </div>
      </div>
      <StatsClient stats={stats} />
    </div>
  )
}
