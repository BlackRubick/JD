import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';

function ResourcesPage({ role, onLogout }) {
  const resources = [
    { title: 'Manejo de ansiedad', desc: 'Técnicas de respiración y mindfulness para reducir el estrés.', icon: '🌿', tag: 'Bienestar' },
    { title: 'Hábitos de sueño', desc: 'Guía para mejorar la calidad del sueño durante épocas de exámenes.', icon: '🌙', tag: 'Autocuidado' },
    { title: 'Líneas de apoyo', desc: 'Directorio de servicios de salud mental disponibles en tu institución.', icon: '📞', tag: 'Urgencias' },
  ];

  return (
    <Shell role={role} onLogout={onLogout}>
      <InnerPage title="Recursos de apoyo" subtitle="Contenido psicoeducativo y rutas de ayuda" icon="">
        <div style={{ marginBottom: 24, background: '#f1f5f9', borderRadius: 10, padding: 16, border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--navy)' }}>Tipos de test aplicados</h3>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: 'var(--muted)', fontSize: '0.98rem' }}>
            <li><b>CES-D</b> (Depresión)</li>
            <li><b>PSS</b> (Estrés Percibido)</li>
            <li><b>IDARE</b> (Ansiedad Estado-Rasgo)</li>
            <li><b>BSS</b> (Ideación Suicida)</li>
          </ul>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {resources.map((r) => (
            <div key={r.title} style={{
              padding: '20px', borderRadius: 12,
              background: 'var(--surface)', border: '1px solid #e8f0fe',
              transition: 'box-shadow 0.2s',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{r.icon}</div>
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--blue2)',
                background: '#dbeafe', borderRadius: 999, padding: '2px 8px',
              }}>{r.tag}</span>
              <h4 style={{ fontWeight: 700, color: 'var(--navy)', margin: '10px 0 6px', fontSize: '1rem' }}>{r.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </InnerPage>
    </Shell>
  );
}

export default ResourcesPage;