import Shell from './Shell';

function AuthCard({ children, title, subtitle }) {
  return (
    <Shell>
      <main style={{
        minHeight: 'calc(100vh - 110px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px',
        background: 'linear-gradient(160deg, var(--navy) 0%, var(--navy2) 100%)',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, var(--blue2), var(--blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(37,99,235,0.4)', fontSize: '1.5rem',
            }}>Ψ</div>
            <h2 className="serif" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#e2eaf8' }}>{title}</h2>
            {subtitle && <p style={{ color: '#7ea8d4', marginTop: 6, fontSize: '0.9rem' }}>{subtitle}</p>}
          </div>
          <div className="card" style={{ padding: '36px 32px', borderRadius: 18 }}>
            {children}
          </div>
        </div>
      </main>
    </Shell>
  );
}

export default AuthCard;