import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';
import { testAPI, userAPI } from '../lib/api';

function getStatusColors(code) {
  if (code === 'feedback_done') return { bg: '#dcfce7', fg: '#166534' };
  if (code === 'pending_feedback') return { bg: '#fef3c7', fg: '#854d0e' };
  if (code === 'in_progress') return { bg: '#dbeafe', fg: '#1e3a8a' };
  return { bg: '#e2e8f0', fg: '#334155' };
}

function PatientTestsPage({ role, onLogout }) {
  const { patientId } = useParams();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 920);
  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]);
  const [instrumentStatuses, setInstrumentStatuses] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testDetails, setTestDetails] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [patientId]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 920);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const loadData = async () => {
    try {
      const [patientsData, testsData, statusesData] = await Promise.all([
        userAPI.getAllPatients(),
        testAPI.getPatientSessions(patientId),
        testAPI.getPatientStatuses(patientId),
      ]);
      
      const foundPatient = patientsData.find(p => p.id === parseInt(patientId));
      setPatient(foundPatient);
      setTests(testsData);
      setInstrumentStatuses(statusesData);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTestDetails = async (testId) => {
    try {
      const details = await testAPI.getSessionDetails(testId);
      setTestDetails(details);
      setSelectedTest(testId);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los detalles del test',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      Swal.fire({
        title: 'Campo vacío',
        text: 'Por favor escribe una retroalimentación',
        icon: 'warning',
        confirmButtonColor: '#0066cc'
      });
      return;
    }

    try {
      await testAPI.addFeedback(selectedTest, feedbackText.trim());
      setFeedbackText('');
      await loadTestDetails(selectedTest);
      
      Swal.fire({
        title: 'Retroalimentación enviada',
        icon: 'success',
        confirmButtonColor: '#0066cc',
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo enviar la retroalimentación',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  if (loading) {
    return (
      <Shell role={role} onLogout={onLogout}>
        <InnerPage title="Cargando..." subtitle="" icon="⏳">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Cargando datos...
          </div>
        </InnerPage>
      </Shell>
    );
  }

  return (
    <Shell role={role} onLogout={onLogout}>
      <InnerPage 
        title={`Tests de ${patient?.name || 'Paciente'}`} 
        subtitle={patient?.email || ''}
        icon="📊"
      >
        <div style={{ padding: '2rem' }}>
          <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#001f3f', fontSize: '1rem' }}>Estatus de evaluaciones</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
              {instrumentStatuses.map((item) => (
                <div key={item.instrument_code} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{item.instrument_name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#334155' }}>{item.state_label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Historial de Tests</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className="card"
                    style={{ 
                      padding: '1rem',
                      cursor: 'pointer',
                      border: selectedTest === test.id ? '2px solid #0066cc' : '2px solid transparent'
                    }}
                    onClick={() => loadTestDetails(test.id)}
                  >
                    <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#666' }}>
                      {new Date(test.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.4rem', color: '#334155', fontWeight: 600 }}>
                      Instrumento: {test.instrument_name || test.instrument_code || 'CES-D'}
                    </div>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: getStatusColors(test.business_status_code).bg,
                      color: getStatusColors(test.business_status_code).fg
                    }}>
                      {test.business_status || (test.status === 'completed' ? 'Finalizado' : 'En progreso')}
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: '#64748b' }}>
                      Estado de captura: {test.completion_status_label || (test.status === 'completed' ? 'Finalizado' : 'En progreso')}
                    </div>
                    {test.total_score !== null && (
                      <div style={{ marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', color: '#001f3f' }}>
                        Puntaje: {test.total_score}
                      </div>
                    )}
                  </div>
                ))}
                {tests.length === 0 && (
                  <p style={{ color: '#666', textAlign: 'center', padding: '2rem 0' }}>
                    No hay tests registrados
                  </p>
                )}
              </div>
            </div>

            <div>
              {testDetails ? (
                <>
                  <h3 style={{ marginBottom: '1rem' }}>Respuestas del Test</h3>
                  <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {testDetails.responses.map((response, index) => (
                        <div key={response.id} style={{ 
                          padding: '1rem',
                          background: '#f8f9fa',
                          borderRadius: '8px'
                        }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#001f3f' }}>
                            {index + 1}. {response.question_text}
                          </div>
                          <div style={{ 
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            background: '#0066cc',
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '0.9rem'
                          }}>
                            Respuesta: {response.response_value} puntos
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '1rem' }}>Retroalimentación</h3>
                  {testDetails.feedback && testDetails.feedback.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      {testDetails.feedback.map((fb) => (
                        <div key={fb.id} className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                            {fb.doctor_name} - {new Date(fb.created_at).toLocaleString()}
                          </div>
                          <div>{fb.feedback_text}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Agregar retroalimentación</h4>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Escribe tu retroalimentación para el paciente..."
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '1rem',
                        border: '2px solid #dee2e6',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    />
                    <button
                      onClick={handleSubmitFeedback}
                      className="btn-primary"
                      style={{ marginTop: '1rem', padding: '0.75rem 2rem' }}
                    >
                      Enviar retroalimentación
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                  Selecciona un test para ver los detalles
                </div>
              )}
            </div>
          </div>
        </div>
      </InnerPage>
    </Shell>
  );
}

export default PatientTestsPage;
