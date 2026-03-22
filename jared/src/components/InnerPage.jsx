function InnerPage({ title, subtitle, icon, children }) {
  return (
    <main style={{ padding: '48px 24px', minHeight: 'calc(100vh - 110px)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <span style={{ fontSize: '2rem' }}>{icon}</span>
            <h2 className="serif" style={{ fontSize: '2rem', fontWeight: 700, color: '#e2eaf8' }}>{title}</h2>
          </div>
          <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg, var(--gold), var(--accent))', borderRadius: 2, marginBottom: 10 }} />
          <p style={{ color: '#7ea8d4', fontSize: '0.95rem' }}>{subtitle}</p>
        </div>
        <div className="card" style={{ padding: '36px' }}>
          {children}
        </div>
      </div>
    </main>
  );
}

export default InnerPage;