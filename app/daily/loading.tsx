export default function Loading() {
  return (
    <div style={{ padding: '20px 20px 80px', maxWidth: 560, margin: '0 auto' }}>
      <div style={{ width: 160, height: 12, background: '#1a1915', borderRadius: 3, marginBottom: 24, animation: 'pulse 1.5s ease-in-out infinite' }} />
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          background: '#131210',
          border: '1px solid #2a2820',
          borderRadius: 8,
          padding: '20px 18px',
          marginBottom: 16,
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 0.1}s`,
        }}>
          <div style={{ height: 14, background: '#1a1915', borderRadius: 3, marginBottom: 8 }} />
          <div style={{ height: 14, background: '#1a1915', borderRadius: 3, marginBottom: 8, width: '80%' }} />
          <div style={{ height: 14, background: '#1a1915', borderRadius: 3, width: '60%', marginBottom: 16 }} />
          <div style={{ height: 1, background: '#2a2820', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 28, height: 40, background: '#1a1915', borderRadius: 2 }} />
            <div>
              <div style={{ width: 100, height: 12, background: '#1a1915', borderRadius: 3, marginBottom: 5 }} />
              <div style={{ width: 60, height: 10, background: '#1a1915', borderRadius: 3 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
