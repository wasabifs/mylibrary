'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SyncButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const router = useRouter()

  async function handleSync() {
    if (status === 'loading') return
    setStatus('loading')
    try {
      await fetch('/api/revalidate', { method: 'POST' })
      setStatus('done')
      router.refresh()
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  const icon = status === 'loading' ? '⟳' : status === 'done' ? '✓' : status === 'error' ? '✕' : '⟳'
  const color = status === 'done' ? '#c9a96e' : status === 'error' ? '#a06060' : '#3e3a32'

  return (
    <button
      onClick={handleSync}
      title="同步 Notion 資料"
      style={{
        background: 'none',
        border: 'none',
        cursor: status === 'loading' ? 'default' : 'pointer',
        color,
        fontSize: 18,
        lineHeight: 1,
        padding: '4px 6px',
        borderRadius: 4,
        transition: 'color 0.2s',
        animation: status === 'loading' ? 'spin 0.8s linear infinite' : 'none',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {icon}
    </button>
  )
}
