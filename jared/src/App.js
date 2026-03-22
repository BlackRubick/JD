import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import AppRoutes from './routes/AppRoutes';
import { injectGlobalStyles } from './styles/injectGlobalStyles';
import { authAPI } from './lib/api';

function App() {
  const [role, setRole] = useState(() => localStorage.getItem('psybioneer-role'));

  useEffect(() => {
    injectGlobalStyles();
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Cerrar sesión?',
      text: 'Tu sesión actual se cerrará.',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#2563eb',
    });

    if (!result.isConfirmed) return;

    authAPI.logout();
    setRole(null);
    
    await Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      timer: 1200,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    role ? localStorage.setItem('psybioneer-role', role) : localStorage.removeItem('psybioneer-role');
  }, [role]);

  return (
    <BrowserRouter>
      <AppRoutes role={role} onLogin={setRole} onLogout={handleLogout} />
    </BrowserRouter>
  );
}

export default App;