export default function Loading() {
  return (
    <div style={{ padding: '20px 20px 80px', maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 4 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            background: '#131210',
            border: '1px solid #2a2820',
            borderRadius: 8,
            padding: '16px 14px',
            height: 80,
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }} />
        ))}
      </div>
      {[100, 140, 180, 200].map((h, i) => (
        <div key={i} style={{
          height: h,
          background: '#131210',
          border: '1px solid #2a2820',
          borderRadius: 8,
          marginTop: 24,
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
    </div>
  )
}
