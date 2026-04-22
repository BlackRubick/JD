import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';
import Swal from 'sweetalert2';

function ResourcesPage({ role, onLogout }) {
  const resources = [
    { title: 'Líneas de apoyo', desc: 'Línea de la Vida 800 911 2000', icon: '📞', tag: 'Urgencias' },
  ];

  const handleRequestAppointment = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Solicitar cita',
      html:
        `<input id="swal-date" type="date" class="swal2-input" placeholder="Fecha" style="margin-bottom:8px;" />` +
        `<input id="swal-time" type="time" class="swal2-input" placeholder="Hora" />`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Solicitar',
      preConfirm: () => {
        const date = document.getElementById('swal-date').value;
        const time = document.getElementById('swal-time').value;
        if (!date || !time) {
          Swal.showValidationMessage('Debes ingresar fecha y hora');
          return false;
        }
        return { date, time };
      }
    });
    if (formValues) {
      await Swal.fire({
        icon: 'success',
        title: 'Solicitud enviada',
        text: `Tu solicitud de cita para el día ${formValues.date} a las ${formValues.time} ha sido enviada.`,
        confirmButtonColor: '#2563eb'
      });
      // Aquí podrías enviar la solicitud al backend si lo deseas
    }
  };

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
        <div style={{ marginBottom: 24 }}>
          <button className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }} onClick={handleRequestAppointment}>
            Solicitar cita
          </button>
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