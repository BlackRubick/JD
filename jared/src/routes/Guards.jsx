import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export function TherapistRoute({ role, children }) {
  return role === 'therapist' ? children : <Navigate to="/" replace />;
}

export function AuthRoute({ role, children }) {
  useEffect(() => {
    if (!role) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Necesitas iniciar sesión para ver la evaluación de bienestar.',
        confirmButtonText: 'Ir a iniciar sesión',
        confirmButtonColor: '#2563eb',
      });
    }
  }, [role]);

  return role ? children : <Navigate to="/login" replace />;
}