export default function Loading() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header skeleton */}
      <div style={{
        padding: '36px 20px 20px',
        borderBottom: '1px solid #2a2820',
      }}>
        <div style={{ width: 80, height: 22, background: '#1a1915', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      {/* Filter skeleton */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #2a2820', display: 'flex', gap: 6 }}>
        {[60, 80, 70, 80].map((w, i) => (
          <div key={i} style={{ width: w, height: 26, background: '#1a1915', borderRadius: 3, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #2a2820', display: 'flex', gap: 6 }}>
        {[40, 60, 50, 70, 55, 65].map((w, i) => (
          <div key={i} style={{ width: w, height: 26, background: '#1a1915', borderRadius: 3, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
      {/* Grid skeleton */}
      <div style={{ padding: '16px 12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 8px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <div style={{
                aspectRatio: '2/3',
                background: '#1a1915',
                borderRadius: 4,
                marginBottom: 6,
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.05}s`,
              }} />
              <div style={{ height: 12, background: '#1a1915', borderRadius: 3, marginBottom: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ height: 10, background: '#1a1915', borderRadius: 3, width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
