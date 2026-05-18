import { getReadingStats } from '@/lib/notion'
import StatsClient from '@/components/StatsClient'
import SyncButton from '@/components/SyncButton'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const stats = await getReadingStats()

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
