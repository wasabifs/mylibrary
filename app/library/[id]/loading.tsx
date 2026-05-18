export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Back bar */}
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #2a2820' }}>
        <div style={{ width: 60, height: 14, background: '#1a1915', borderRadius: 3, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      {/* Hero */}
      <div style={{ display: 'flex', gap: 20, padding: '24px 20px 20px', borderBottom: '1px solid #2a2820' }}>
        <div style={{ width: 80, height: 116, background: '#1a1915', borderRadius: 4, flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, background: '#1a1915', borderRadius: 3, marginBottom: 8, width: '40%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: 20, background: '#1a1915', borderRadius: 3, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: 20, background: '#1a1915', borderRadius: 3, marginBottom: 8, width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: 14, background: '#1a1915', borderRadius: 3, width: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </div>
      </div>
      {/* Tags */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #2a2820', display: 'flex', gap: 6 }}>
        {[50, 70, 55].map((w, i) => (
          <div key={i} style={{ width: w, height: 24, background: '#1a1915', borderRadius: 3, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      {/* Content sections */}
      <div style={{ padding: '0 20px' }}>
        {[120, 180, 160, 140, 200].map((h, i) => (
          <div key={i} style={{ padding: '16px 0', borderTop: '1px solid #2a2820' }}>
            <div style={{ width: 60, height: 10, background: '#1a1915', borderRadius: 3, marginBottom: 10, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: h, background: '#1a1915', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          </div>
        ))}
      </div>
    </div>
  )
}
