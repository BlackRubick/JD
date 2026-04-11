import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Shell({ children, role, onLogout }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 920);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 920);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
      <div className="privacy-banner">
        🔒 Tu información será tratada con confidencialidad conforme al Aviso de Privacidad
      </div>

      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e8f0fe',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 1px 0 #e2e8f0, 0 4px 16px rgba(15,31,61,0.06)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: isMobile ? '12px 14px' : '0 24px', minHeight: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: isMobile ? 10 : 0,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--blue2), var(--blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
              flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>Ψ</span>
            </div>
            <span className="serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.01em' }}>
              PSYBIONEER
            </span>
          </Link>

          <nav style={{
            display: 'flex',
            gap: isMobile ? 14 : 28,
            alignItems: 'center',
            width: isMobile ? '100%' : 'auto',
            order: isMobile ? 3 : 0,
            overflowX: isMobile ? 'auto' : 'visible',
            paddingBottom: isMobile ? 4 : 0,
          }}>
            <Link to="/" className="nav-link">Inicio</Link>
            {role !== 'therapist' && (
              <Link to="/test" className="nav-link">Evaluación</Link>
            )}
            {role === 'patient' && (
              <Link to="/my-tests" className="nav-link">Mis Tests</Link>
            )}
            <Link to="/resources" className="nav-link">Recursos</Link>
            {role === 'therapist' && (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/patients" className="nav-link">Pacientes</Link>
                <Link to="/admin/questions" className="nav-link">⚙️ Preguntas</Link>
                <Link to="/admin/create-doctor" className="nav-link">👨‍⚕️ Crear Doctor</Link>
              </>
            )}
          </nav>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginLeft: isMobile ? 'auto' : 0,
          }}>
            {role ? (
              <>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--blue2)',
                  background: '#eff6ff', border: '1px solid #bfdbfe',
                  borderRadius: 999, padding: '4px 12px',
                }}>
                  {role === 'therapist' ? '🩺 Terapeuta' : '👤 Paciente'}
                </span>
                <button className="btn-ghost" onClick={onLogout} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                  Salir
                </button>
                {role === 'patient' && (
                  <Link
                    to="/delete-account"
                    style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.8rem', marginLeft: 8, textDecoration: 'underline', cursor: 'pointer' }}
                    title="Eliminar cuenta"
                  >
                    Eliminar cuenta
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.85rem' }}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      <div style={{ flex: 1 }}>
        {children}
      </div>

      <footer style={{
        background: '#0b2347',
        borderTop: '1px solid rgba(191,219,254,0.2)',
        color: '#dbeafe',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '26px 24px' }}>
          <h4 className="serif" style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>Psybioneer</h4>
          <p style={{ margin: '6px 0 14px 0', fontSize: '0.9rem', color: '#bfdbfe' }}>
            Plataforma digital de evaluación preliminar de bienestar psicológico
          </p>

          <div style={{ display: 'grid', gap: 6, fontSize: '0.88rem', lineHeight: 1.6 }}>
            <div><strong>Servicio tecnico:</strong> 233127@ib.upchiapas.edu.mx · 233049@ib.upchiapas.edu.mx</div>
            <div>Ubicación: Chiapas, México</div>
            <div>Horario de atención: Lunes a viernes, 8:00 – 16:00</div>
          </div>

          <div style={{
            marginTop: 14,
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 10,
            fontSize: '0.85rem'
          }}>
            <strong>Aviso importante:</strong> Esta plataforma no sustituye atención psicológica profesional.
          </div>

          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#93c5fd' }}>Enlaces:</span>
            <Link to="/privacy" style={{ color: '#fef3c7', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              Aviso de Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Shell;