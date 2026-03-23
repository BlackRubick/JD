import { Link } from 'react-router-dom';

function DeleteAccountPage() {
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
      <button className="btn-primary" style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '12px 32px', fontWeight: 700, fontSize: '1rem', borderRadius: 8, cursor: 'pointer' }} disabled>
        Eliminar mi cuenta
      </button>
      <div style={{ marginTop: 24 }}>
        <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>
          Cancelar y volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default DeleteAccountPage;
