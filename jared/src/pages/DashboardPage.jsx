import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';
import { authAPI, testAPI, userAPI } from '../lib/api';

function DashboardPage({ role, onLogout }) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    weekTests: 0,
    followupCases: 0,
    avgScore: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [doctorCode, setDoctorCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCopyFallback, setShowCopyFallback] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [patients, tests, profile] = await Promise.all([
        userAPI.getAllPatients(),
        testAPI.getAllSessions(),
        authAPI.getProfile(),
      ]);

      const completedTests = tests.filter(t => t.status === 'completed');
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekTests = completedTests.filter(t => new Date(t.completed_at) >= oneWeekAgo);
      
      const scoresWithValues = completedTests.filter(t => t.total_score !== null);
      const avgScore = scoresWithValues.length > 0
        ? (scoresWithValues.reduce((sum, t) => sum + t.total_score, 0) / scoresWithValues.length).toFixed(1)
        : 0;
      const activePatients = patients.filter((p) => (p.patient_status || 'active') === 'active');

      setStats({
        totalPatients: activePatients.length,
        weekTests: weekTests.length,
        followupCases: completedTests.filter(t => t.total_score >= 16).length,
        avgScore
      });

      setRecentTests(tests.slice(0, 5));
      setDoctorCode(profile?.doctor_code || '');
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyDoctorCode = async () => {
    if (!doctorCode) return;

    try {
      await navigator.clipboard.writeText(doctorCode);
      await Swal.fire({
        icon: 'success',
        title: 'Codigo copiado',
        text: 'Comparte este codigo con tus pacientes para que se registren contigo.',
        timer: 1700,
        showConfirmButton: false,
      });
    } catch {
      // Fallback: seleccionar el texto automáticamente
      const el = document.getElementById('doctor-code-text');
      if (el) {
        // Crear un rango y seleccionar el texto
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo copiar',
        text: 'Selecciona y copia manualmente el codigo mostrado.',
      });
    }
  };

  const metrics = [
    { label: 'Pacientes activos', value: stats.totalPatients, icon: '👥' },
    { label: 'Evaluaciones esta semana', value: stats.weekTests, icon: '📊' },
    { label: 'Casos de seguimiento', value: stats.followupCases, icon: '🔔' },
    { label: 'Promedio CES-D', value: stats.avgScore, icon: '📈' },
  ];

  return (
    <Shell role={role} onLogout={onLogout}>
      <main style={{ padding: '48px 24px', minHeight: 'calc(100vh - 110px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h2 className="serif" style={{ fontSize: '2rem', fontWeight: 700, color: '#e2eaf8' }}>Dashboard</h2>
            <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg, var(--gold), var(--accent))', borderRadius: 2, marginTop: 8 }} />
          </div>
          {(role === 'therapist' || role === 'doctor') && doctorCode && (
            <div className="card" style={{ padding: '18px 20px', marginBottom: 16, border: '1px solid #bfdbfe', background: 'linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#1e3a8a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Codigo de comunidad del doctor
                  </div>
                  <div id="doctor-code-text" style={{ marginTop: 4, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', fontFamily: 'Georgia, "Times New Roman", Times, serif', userSelect: 'all', cursor: 'pointer' }}>
                    {doctorCode}
                  </div>
                  <div style={{ marginTop: 4, fontSize: '0.8rem', color: '#475569' }}>
                    Tus pacientes usan este codigo al registrarse para unirse contigo.
                  <div>
                    <div id="doctor-code-text" style={{ marginTop: 4, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', fontFamily: 'Georgia, "Times New Roman", Times, serif', userSelect: 'all', cursor: 'pointer', display: 'inline-block' }}>
                </div>
                <button className="btn-secondary" onClick={copyDoctorCode} style={{ padding: '0.55rem 0.9rem', fontSize: '0.82rem' }}>
                    {showCopyFallback && (
                      <div style={{ marginTop: 6, color: '#2563eb', background: '#e0e7ff', borderRadius: 4, padding: '4px 10px', fontSize: '0.92rem', fontWeight: 500, display: 'inline-block' }}>
                        Selecciona y copia el código manualmente (Ctrl+C)
                      </div>
                    )}
                  Copiar codigo
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            {metrics.map((m) => (
              <div key={m.label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: '1.8rem' }}>{m.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: 700,
                      color: 'var(--gold)',
                      fontFamily: 'Georgia, "Times New Roman", Times, serif',
                      fontVariantNumeric: 'lining-nums tabular-nums',
                      letterSpacing: '0.01em'
                    }}
                  >
                    {m.value}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#93c5fd' }}>{m.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '36px' }}>
            <h3 className="serif" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
              Tests recientes
            </h3>
            {loading ? (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Cargando...</p>
            ) : recentTests.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No hay tests registrados aún</p>
            ) : (
              <div style={{ marginTop: '1.5rem' }}>
                {recentTests.map((test) => (
                  <div key={test.id} style={{ 
                    padding: '1rem',
                    marginBottom: '1rem',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#001f3f' }}>
                        {test.patient_name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {test.patient_email}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.25rem' }}>
                        {new Date(test.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: test.status === 'completed' ? '#d4edda' : '#fff3cd',
                        color: test.status === 'completed' ? '#155724' : '#856404',
                        marginBottom: '0.5rem'
                      }}>
                        {test.status === 'completed' ? 'Completado' : 'En progreso'}
                      </div>
                      {test.total_score !== null && (
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0066cc' }}>
                          {test.total_score} pts
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link 
              to="/patients" 
              style={{ 
                display: 'inline-block',
                marginTop: '1rem',
                color: '#0066cc',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Ver todos los pacientes →
            </Link>
          </div>
        </div>
      </div> {/* Cierre del div principal */}
    </main>
  </Shell>
  );
}

export default DashboardPage;