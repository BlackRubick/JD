import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TestPage from '../pages/TestPage';
import DashboardPage from '../pages/DashboardPage';
import ResourcesPage from '../pages/ResourcesPage';
import QuestionAdminPage from '../pages/QuestionAdminPage';
import PatientsPage from '../pages/PatientsPage';
import PatientTestsPage from '../pages/PatientTestsPage';
import MyTestsPage from '../pages/MyTestsPage';
import CreateDoctorPage from '../pages/CreateDoctorPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import DeleteAccountPage from '../pages/DeleteAccountPage';
import { AuthRoute, TherapistRoute, PatientRoute } from './Guards';

  // Guardar el email en localStorage al iniciar sesión (si no está)
  // Esto debe hacerse en LoginPage, pero aquí lo forzamos por si acaso
  if (window.localStorage.getItem('psybioneer-email') == null && role === 'therapist') {
    // No hay email, forzar logout
    window.localStorage.removeItem('psybioneer-token');
    window.localStorage.removeItem('psybioneer-role');
    window.location.reload();
  }
  return (
    <Routes>
      <Route path="/" element={<HomePage role={role} onLogout={onLogout} />} />
      <Route path="/login" element={<LoginPage role={role} onLogin={onLogin} />} />
      <Route path="/register" element={<RegisterPage role={role} onLogin={onLogin} />} />
      <Route path="/delete-account" element={<DeleteAccountPage />} />
      <Route
        path="/test"
        element={(
          <AuthRoute role={role}>
            <PatientRoute role={role}>
              <TestPage role={role} onLogout={onLogout} />
            </PatientRoute>
          </AuthRoute>
        )}
      />
      <Route
        path="/my-tests"
        element={(
          <AuthRoute role={role}>
            <PatientRoute role={role}>
              <MyTestsPage role={role} onLogout={onLogout} />
            </PatientRoute>
          </AuthRoute>
        )}
      />
      <Route
        path="/dashboard"
        element={(
          <TherapistRoute role={role}>
            <DashboardPage role={role} onLogout={onLogout} />
          </TherapistRoute>
        )}
      />
      <Route
        path="/patients"
        element={(
          <TherapistRoute role={role}>
            <PatientsPage role={role} onLogout={onLogout} />
          </TherapistRoute>
        )}
      />
      <Route
        path="/patient/:patientId/tests"
        element={(
          <TherapistRoute role={role}>
            <PatientTestsPage role={role} onLogout={onLogout} />
          </TherapistRoute>
        )}
      />
      <Route
        path="/admin/questions"
        element={(
          <TherapistRoute role={role}>
            <QuestionAdminPage role={role} onLogout={onLogout} />
          </TherapistRoute>
        )}
      />
      <Route
        path="/admin/create-doctor"
        element={(
          <TherapistRoute role={role}>
            <CreateDoctorPage role={role} onLogout={onLogout} />
          </TherapistRoute>
        )}
      />
      <Route path="/privacy" element={<PrivacyPolicyPage role={role} onLogout={onLogout} />} />
      <Route path="/resources" element={<ResourcesPage role={role} onLogout={onLogout} />} />
    </Routes>
  );
}

export default AppRoutes;