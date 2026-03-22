import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthCard from '../components/AuthCard';
import { authAPI } from '../lib/api';

function LoginPage({ role, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authAPI.login({ email, password });
      
      const selectedRole = data.user.role === 'doctor' ? 'therapist' : 'patient';
      onLogin(selectedRole);
      
      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: selectedRole === 'therapist' ? 'Ingresaste como terapeuta.' : 'Ingresaste como paciente.',
        timer: 1400,
        showConfirmButton: false,
      });
      
      navigate(selectedRole === 'therapist' ? '/dashboard' : '/');
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Credenciales inválidas',
        text: error.message || 'Verifica tu correo y contraseña.',
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setLoading(false);
    }
  };

  if (role === 'therapist') return <Navigate to="/dashboard" replace />;

  return (
    <AuthCard title="Iniciar sesión" subtitle="Accede con tus credenciales institucionales">
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
            Correo institucional
          </label>
          <input
            className="input"
            type="email"
            placeholder="nombre@universidad.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
            Contraseña
          </label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 4, padding: '14px' }} disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
        <div style={{ textAlign: 'center', margin: '4px 0', fontSize: '0.8rem', color: '#94a3b8' }}>— o —</div>
        <Link to="/register" className="btn-ghost" style={{ width: '100%', textAlign: 'center', padding: '12px' }}>
          Crear cuenta nueva
        </Link>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', marginTop: 8 }}>
          ¿Olvidaste tu contraseña?{' '}
          <span style={{ color: 'var(--blue2)', cursor: 'pointer', fontWeight: 600 }}>Recupérala</span>
        </p>
      </form>
    </AuthCard>
  );
}

export default LoginPage;