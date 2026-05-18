import { getAllExcerptsFlat } from '@/lib/notion'
import DailyClient from '@/components/DailyClient'
import SyncButton from '@/components/SyncButton'

export const revalidate = 3600

export default async function DailyPage() {
  const excerpts = await getAllExcerptsFlat()

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
            <span style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 20, color: '#c9a96e' }}>每日精選</span>
            <span style={{ fontSize: 10, color: '#847a68', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Daily</span>
          </div>
          <SyncButton />
        </div>
      </div>
      <DailyClient excerpts={excerpts} />
    </div>
  )
}
