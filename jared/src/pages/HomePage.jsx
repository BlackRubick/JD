import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';

function HomePage({ role, onLogout }) {
  const navigate = useNavigate();

  const handleStartEvaluation = async (instrumentCode = 'CESD') => {
    await Swal.fire({
      icon: 'info',
      title: 'Comenzando evaluación',
      text: 'Serás redirigido al test seleccionado.',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#2563eb',
    });
    navigate(`/test?instrument=${instrumentCode}`);
  };

  const features = [
    { icon: '🧠', label: 'Intervención temprana sobre depresión' },
    { icon: '📋', label: 'Tests estandarizados' },
    { icon: '📊', label: 'Estadísticas de investigación' },
    { icon: '💬', label: 'Chat de orientación' },
  ];

  const stats = [
    { value: '20–30%', desc: 'Universitarios con síntomas depresivos' },
    { value: '4 tests', desc: 'Instrumentos validados clínicamente' },
    { value: '100%', desc: 'Confidencial y anónimo' },
    { value: '∞', desc: 'Acceso libre y gratuito' },
  ];

  return (
    <Shell role={role} onLogout={onLogout}>
      <section className="hero-bg" style={{ padding: '72px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p className="fade-up" style={{
            fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--blue2)',
            background: '#dbeafe', borderRadius: 999, padding: '5px 16px',
            display: 'inline-block', marginBottom: 20,
          }}>
            Salud mental
          </p>
          <h1 className="serif fade-up fade-up-1" style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 900,
            color: 'var(--navy)', lineHeight: 1.12, marginBottom: 20,
          }}>
            Tu bienestar emocional<br />
            <span style={{ color: 'var(--blue2)' }}>importa</span>
          </h1>
          <p className="fade-up fade-up-2" style={{
            fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 36,
          }}>
            Psybioneer es una herramienta de tamizaje temprano diseñada para identificar posibles
            indicadores de malestar emocional en estudiantes universitarios.
          </p>
          <div className="fade-up fade-up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={handleStartEvaluation} style={{ padding: '13px 30px', fontSize: '0.95rem' }}>
              Comenzar evaluación →
            </button>
            <Link to="/resources" className="btn-ghost" style={{ padding: '13px 28px', fontSize: '0.95rem' }}>
              Ver recursos
            </Link>
          </div>
        </div>
      </section>

      <section style={{
        background: 'var(--navy2)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 24px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12,
        }}>
          {features.map((f) => (
            <div key={f.label} className="badge-pill" style={{ borderRadius: 12, padding: '12px 16px' }}>
              <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
              <span style={{ fontSize: '0.82rem' }}>{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--navy)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-divider" />
            <h2 className="serif" style={{ fontSize: '1.9rem', color: '#e2eaf8', fontWeight: 700 }}>
              Antes de comenzar
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <div className="card">
              <div style={{ padding: '6px 0', background: 'linear-gradient(90deg, var(--blue2), var(--sky))', height: 4 }} />
              <div style={{ padding: '28px 28px 32px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                }}>⚠️</div>
                <h3 className="serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>
                  Información importante
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.75 }}>
                  Psybioneer es una herramienta digital de tamizaje diseñada para identificar de manera temprana
                  posibles indicadores de malestar emocional en población universitaria.
                </p>
                <ul style={{ marginTop: 14, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['No sustituye un diagnóstico clínico.', 'No sustituye una consulta profesional.', 'No determina la presencia de un trastorno mental.'].map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: '#475569' }}>
                      <span style={{ color: 'var(--blue2)', marginTop: 1, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card">
              <div style={{ padding: '6px 0', background: 'linear-gradient(90deg, var(--gold), var(--accent))', height: 4 }} />
              <div style={{ padding: '28px 28px 32px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                }}>🎯 </div>
                <h3 className="serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>
                  Objetivo
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.75 }}>
                  Ofrecer una orientación preventiva basada en criterios psicológicos estandarizados para
                  apoyar el bienestar emocional de los estudiantes.
                </p>
                <p style={{ marginTop: 14, fontSize: '0.85rem', color: '#475569', lineHeight: 1.75 }}>
                  Los resultados tienen carácter orientativo, no diagnóstico. No existen respuestas
                  correctas o incorrectas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--navy2)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-divider" />
            <h2 className="serif" style={{ fontSize: '1.9rem', color: '#e2eaf8', fontWeight: 700 }}>
              Estadísticas
            </h2>
            <p style={{ color: '#7ea8d4', marginTop: 8, fontSize: '0.9rem' }}>
              Datos basados en investigaciones en población universitaria
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {stats.map((s) => (
              <div key={s.value} className="stat-card" style={{ textAlign: 'center' }}>
                <div className="serif" style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--gold)', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ marginTop: 10, fontSize: '0.82rem', color: '#93c5fd', lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--navy)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-divider" />
            <h2 className="serif" style={{ fontSize: '1.9rem', color: '#e2eaf8', fontWeight: 700 }}>
              Evaluaciones disponibles
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
            {[
              { code: 'CESD', name: 'CES-D', desc: 'Escala de depresión del Centro de Estudios Epidemiológicos', icon: '🧩', color: '#2563eb' },
              { code: 'PSS', name: 'PSS', desc: 'Escala de estrés percibido', icon: '⚡', color: '#0891b2' },
              { code: 'IDARE', name: 'IDARE', desc: 'Inventario de Ansiedad Estado-Rasgo', icon: '📝', color: '#f59e42' },
              { code: 'BSS', name: 'BSS', desc: 'Escala de desesperanza de Beck', icon: '🕊️', color: '#10b981' },
            ].map((t) => (
              <div key={t.name} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: `${t.color}18`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0,
                  }}>{t.icon}</div>
                  <span className="serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>{t.name}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.65 }}>{t.desc}</p>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: t.color, fontWeight: 600 }}>
                  <span>Orientativo, no diagnóstico</span>
                </div>
                    <button
                      className="btn-primary"
                      style={{ marginTop: 14, width: '100%', padding: '10px 14px' }}
                      onClick={() => handleStartEvaluation(t.code)}
                    >
                      Realizar {t.name}
                    </button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn-primary" onClick={handleStartEvaluation} style={{ padding: '14px 36px', fontSize: '1rem' }}>
                  Iniciar CES-D →
            </button>
          </div>
        </div>
      </section>

      <footer style={{
        background: '#080f1e',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 24px',
        textAlign: 'center',
      }}>
        <p className="serif" style={{ fontSize: '1.1rem', color: '#93c5fd', fontWeight: 700, marginBottom: 6 }}>PSYBIONEER</p>
        <p style={{ fontSize: '0.75rem', color: '#475569' }}>
          © 2025 · Herramienta de tamizaje en salud mental · Todos los derechos reservados
        </p>
      </footer>
    </Shell>
  );
}

export default HomePage;