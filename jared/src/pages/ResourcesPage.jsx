import { useState, useEffect } from 'react';
import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';
import Swal from 'sweetalert2';
import { getAppointmentRequests, updateAppointmentRequest, addAppointmentRequest } from '../lib/appointments';

function ResourcesPage({ role, onLogout }) {
  const resources = [
    { title: 'Líneas de apoyo', desc: 'Línea de la Vida 800 911 2000', icon: '📞', tag: 'Urgencias' },
  ];

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setAppointments(getAppointmentRequests());
  }, []);

  const isTherapist = role === 'therapist' || role === 'doctor';
  const patientEmail = localStorage.getItem('BioPsyTech-email') || '';

  const confirmedForPatient = !isTherapist
    ? [...appointments]
        .filter(a => a.status === 'agendada' && a.patientEmail === patientEmail)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null
    : null;

  const hasAnyAppointments = isTherapist && appointments.length > 0;

  const handlePatientRequestAppointment = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Agendar cita',
      html:
        `<input id="swal-date" type="date" class="swal2-input" style="margin-bottom:8px;" />` +
        `<input id="swal-time" type="time" class="swal2-input" />`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Agendar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
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
      addAppointmentRequest({
        patientEmail,
        patientName: patientEmail,
        date: formValues.date,
        time: formValues.time,
        status: 'pendiente'
      });
      setAppointments(getAppointmentRequests());
      await Swal.fire({
        icon: 'success',
        title: 'Solicitud enviada',
        text: `Tu solicitud de cita para el ${formValues.date} a las ${formValues.time} ha sido enviada.`,
        confirmButtonColor: '#2563eb'
      });
    }
  };

  const handleTherapistBannerClick = async () => {
    if (!hasAnyAppointments) return;

    const pending = appointments.filter(a => a.status !== 'agendada');
    const confirmed = appointments.filter(a => a.status === 'agendada');

    if (pending.length > 0) {
      for (let idx = 0; idx < appointments.length; idx++) {
        const a = appointments[idx];
        if (a.status === 'agendada') continue;

        const result = await Swal.fire({
          title: 'Solicitud de cita',
          html: `
            <div style="text-align:center;padding:8px 0;">
              <p style="font-size:1.05rem;margin-bottom:18px;">
                El paciente <b>${a.patientName || a.patientEmail || 'Paciente'}</b> desea agendar una cita psicológica
              </p>
              <div style="display:flex;justify-content:center;gap:12px;">
                <div style="border:1px solid #cbd5e1;border-radius:8px;padding:10px 20px;font-size:1rem;">
                  📅 ${a.date}
                </div>
                <div style="border:1px solid #cbd5e1;border-radius:8px;padding:10px 20px;font-size:1rem;">
                  🕐 ${a.time}
                </div>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Aceptar cita',
          cancelButtonText: 'Reprogramar',
          confirmButtonColor: '#2563eb',
          cancelButtonColor: '#64748b',
          reverseButtons: false,
        });

        if (result.isConfirmed) {
          updateAppointmentRequest(idx, { status: 'agendada' });
          const updated = getAppointmentRequests();
          setAppointments(updated);
          await Swal.fire({ icon: 'success', title: 'Cita aceptada', timer: 1200, showConfirmButton: false });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          const { value: newSlot } = await Swal.fire({
            title: 'Reprogramar cita',
            html:
              `<input id="swal-date" type="date" class="swal2-input" style="margin-bottom:8px;" />` +
              `<input id="swal-time" type="time" class="swal2-input" />`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2563eb',
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
          if (newSlot) {
            updateAppointmentRequest(idx, { status: 'agendada', date: newSlot.date, time: newSlot.time });
            const updated = getAppointmentRequests();
            setAppointments(updated);
            await Swal.fire({ icon: 'success', title: 'Cita reprogramada', timer: 1200, showConfirmButton: false });
          }
        }
      }
    } else {
      const listHtml = confirmed.map(a => `
        <div style="border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;margin-bottom:8px;text-align:left;">
          <b>Paciente:</b> ${a.patientName || a.patientEmail || 'Paciente'}<br/>
          <b>Fecha:</b> ${a.date} &nbsp;&nbsp; <b>Hora:</b> ${a.time}
        </div>
      `).join('');
      await Swal.fire({
        title: 'Citas agendadas',
        html: `<div style="max-height:320px;overflow-y:auto;">${listHtml}</div>`,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  return (
    <Shell role={role} onLogout={onLogout}>
      <InnerPage title="Recursos de apoyo" subtitle="Contenido psicoeducativo y rutas de ayuda" icon="">

        {/* Banner de estado de citas */}
        {isTherapist ? (
          <div
            onClick={handleTherapistBannerClick}
            style={{
              marginBottom: 20,
              padding: '14px 20px',
              borderRadius: 10,
              background: hasAnyAppointments ? '#dbeafe' : '#f1f5f9',
              border: `1px solid ${hasAnyAppointments ? '#93c5fd' : '#e2e8f0'}`,
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '1.05rem',
              color: hasAnyAppointments ? '#1d4ed8' : '#64748b',
              cursor: hasAnyAppointments ? 'pointer' : 'default',
              transition: 'box-shadow 0.15s',
              ...(hasAnyAppointments ? { boxShadow: '0 1px 4px rgba(37,99,235,0.12)' } : {}),
            }}
          >
            {hasAnyAppointments ? '¡Tienes citas agendadas!' : 'Aun no tienes citas agendadas'}
          </div>
        ) : confirmedForPatient ? (
          <div style={{
            marginBottom: 20,
            padding: '18px 24px',
            borderRadius: 10,
            background: '#dbeafe',
            border: '1px solid #93c5fd',
            textAlign: 'center',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1d4ed8', marginBottom: 10 }}>
              ¡Tienes una cita agendada!
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{
                background: '#fff', border: '1px solid #bfdbfe', borderRadius: 8,
                padding: '8px 20px', fontSize: '0.98rem', color: '#1e40af', fontWeight: 600
              }}>
                📅 {confirmedForPatient.date}
              </div>
              <div style={{
                background: '#fff', border: '1px solid #bfdbfe', borderRadius: 8,
                padding: '8px 20px', fontSize: '0.98rem', color: '#1e40af', fontWeight: 600
              }}>
                🕐 {confirmedForPatient.time}
              </div>
            </div>
          </div>
        ) : null}

        <div style={{ marginBottom: 24, background: '#f1f5f9', borderRadius: 10, padding: 16, border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--navy)' }}>Tipos de test aplicados</h3>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: 'var(--muted)', fontSize: '0.98rem' }}>
            <li><b>CES-D</b> (Depresión)</li>
            <li><b>PSS</b> (Estrés Percibido)</li>
            <li><b>IDARE</b> (Ansiedad Estado-Rasgo)</li>
            <li><b>BSS</b> (Ideación Suicida)</li>
          </ul>
        </div>

        {/* Botón Agendar cita: solo para pacientes */}
        {!isTherapist && (
          <div style={{ marginBottom: 24 }}>
            <button
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '1rem' }}
              onClick={handlePatientRequestAppointment}
            >
              Agendar cita
            </button>
          </div>
        )}

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
