import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userAPI, authAPI } from '../lib/api';

function DeleteAccountPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await userAPI.deleteMe();
      authAPI.logout();
      setSuccess(true);
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setError(err.message || 'Error al eliminar cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 32, textAlign: 'center' }}>
      <h2 className="serif" style={{ color: '#ef4444', fontWeight: 800, fontSize: '2rem', marginBottom: 18 }}>
        Eliminar cuenta
      </h2>
      <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: 18 }}>
        Si eliminas tu cuenta, tu información será desactivada y tendrás <b>60 días</b> para recuperarla iniciando sesión nuevamente. Después de ese periodo, los datos serán eliminados permanentemente.
      </p>
      <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 24 }}>
        Esta acción es reversible solo durante los primeros 60 días.
      </p>
      {error && <div style={{ color: '#ef4444', marginBottom: 16 }}>{error}</div>}
      {success ? (
        <div style={{ color: '#10b981', fontWeight: 700, marginBottom: 16 }}>
          Cuenta marcada para eliminación. Serás redirigido al inicio.
        </div>
      ) : (
        <button
          className="btn-primary"
          style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '12px 32px', fontWeight: 700, fontSize: '1rem', borderRadius: 8, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Eliminar mi cuenta'}
        </button>
      )}
      <div style={{ marginTop: 24 }}>
        <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>
          Cancelar y volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default DeleteAccountPage;
