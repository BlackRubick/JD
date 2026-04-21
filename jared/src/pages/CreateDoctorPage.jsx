import { useState } from 'react';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';
import { userAPI } from '../lib/api';

function CreateDoctorPage({ role, onLogout }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Solo permitir acceso si es la cuenta principal
  if (window.localStorage.getItem('psybioneer-email') !== 'doctor@psybioneer.com') {
    return (
      <Shell role={role} onLogout={onLogout}>
        <InnerPage title="Acceso restringido" subtitle="Solo el psicólogo principal puede crear psicólogos." icon="🔒">
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>
            No tienes permiso para acceder a esta sección.
          </div>
        </InnerPage>
      </Shell>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Contraseñas no coinciden',
        text: 'Por favor verifica que ambas contraseñas sean iguales.',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
      return;
    }

    if (formData.password.length < 8) {
      Swal.fire({
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 8 caracteres.',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...doctorData } = formData;
      const response = await userAPI.createDoctor(doctorData);

      await Swal.fire({
        title: 'Doctor creado',
        html: `
          <p>El nuevo doctor ha sido registrado exitosamente.</p>
          <p style="margin-top:8px;"><strong>Codigo de comunidad:</strong> ${response?.doctor?.doctor_code || 'No disponible'}</p>
          <p style="font-size:0.85rem;color:#64748b;">Comparte este codigo con los pacientes para vincularlos a este especialista.</p>
        `,
        icon: 'success',
        confirmButtonColor: '#0066cc'
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo crear el doctor. Intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { 
    fontSize: '0.9rem', 
    fontWeight: 600, 
    color: '#475569', 
    display: 'block', 
    marginBottom: '0.5rem' 
  };

  return (
    <Shell role={role} onLogout={onLogout}>
      <InnerPage 
        title="Crear Nuevo Psicólogo" 
        subtitle="Agrega un nuevo psicólogo al sistema"
        icon="🧑‍⚕️"
      >
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Nombre completo</label>
                <input
                  className="input"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre del psicólogo"
                  required
                  style={{
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    width: '100%'
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>Correo electrónico</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="psicologo@psybioneer.com"
                  required
                  style={{
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    width: '100%'
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>Contraseña</label>
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  required
                  style={{
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    width: '100%'
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>Confirmar contraseña</label>
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                  required
                  style={{
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    width: '100%'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  marginTop: '1rem',
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Creando psicólogo...' : 'Crear psicólogo'}
              </button>
            </form>
          </div>

          <div className="card" style={{ 
            padding: '1.5rem', 
            marginTop: '1.5rem',
            background: '#fff3cd',
            border: '1px solid #ffc107'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>Importante</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404', lineHeight: '1.6' }}>
                  El nuevo psicólogo tendrá acceso a su propia comunidad de pacientes. Comparte de forma segura
                  el código de comunidad generado para que los pacientes se vinculen solo con su especialista.
                </p>
              </div>
            </div>
          </div>
        </div>
      </InnerPage>
    </Shell>
  );
}

export default CreateDoctorPage;
