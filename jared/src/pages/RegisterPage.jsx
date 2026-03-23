import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthCard from '../components/AuthCard';
import { authAPI } from '../lib/api';

function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    sex: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      await Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Por favor verifica que ambas contraseñas sean iguales.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    if (formData.password.length < 8) {
      await Swal.fire({
        icon: 'error',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 8 caracteres.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await authAPI.register(registerData);
      
      onLogin('patient');
      
      await Swal.fire({
        icon: 'success',
        title: 'Cuenta creada',
        text: 'Tu registro fue exitoso.',
        confirmButtonText: 'Ir al inicio',
        confirmButtonColor: '#2563eb',
      });
      
      navigate('/');
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: error.message || 'Hubo un problema al crear tu cuenta. Intenta nuevamente.',
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 };

  return (
    <AuthCard title="Crear cuenta" subtitle="Regístrate para comenzar tu evaluación">
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Nombre completo</label>
          <input className="input" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre" required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Fecha de nacimiento</label>
            <input className="input" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" required />
          </div>
          <div>
            <label style={labelStyle}>Sexo</label>
            <select className="input" name="sex" value={formData.sex} onChange={handleChange} required>
              <option value="">Selecciona</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="otro">Otro</option>
              <option value="prefiero-no-decir">Prefiero no decirlo</option>
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Correo electrónico</label>
          <input className="input" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="correo@universidad.edu" required />
        </div>
        <div>
          <label style={labelStyle}>Contraseña</label>
          <input className="input" name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Mínimo 8 caracteres" required />
        </div>
        <div>
          <label style={labelStyle}>Confirmar contraseña</label>
          <input className="input" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="Repite tu contraseña" required />
        </div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>
          <input type="checkbox" required style={{ marginTop: 2, accentColor: 'var(--blue2)' }} />
          <span>
            Acepto los{' '}
            <Link to="/privacy" style={{ color: 'var(--blue2)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
              términos y condiciones
            </Link>{' '}y el{' '}
            <Link to="/privacy" style={{ color: 'var(--blue2)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
              aviso de privacidad
            </Link>
          </span>
        </label>
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: 4 }} disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
        <Link to="/login" style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--blue2)', textDecoration: 'none', fontWeight: 600 }}>
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </form>
    </AuthCard>
  );
}

export default RegisterPage;