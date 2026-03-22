import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';
import { testAPI } from '../lib/api';

function MyTestsPage({ role, onLogout }) {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyTests();
  }, []);

  const loadMyTests = async () => {
    try {
      const data = await testAPI.getMySessions();
      setTests(data);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar tus tests',
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
        text: 'No se pudieron cargar los detalles',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  return (
    <Shell role={role} onLogout={onLogout}>
      <InnerPage 
        title="Mis Evaluaciones" 
        subtitle="Historial y retroalimentación de tus tests"
        icon="📋"
      >
        <div style={{ padding: '2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Cargando...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', color: '#001f3f' }}>Mis Tests</h3>
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
                      <div style={{ 
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: test.status === 'completed' ? '#d4edda' : '#fff3cd',
                        color: test.status === 'completed' ? '#155724' : '#856404'
                      }}>
                        {test.status === 'completed' ? 'Completado' : 'En progreso'}
                      </div>
                    </div>
                  ))}
                  {tests.length === 0 && (
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem 0' }}>
                      No has realizado ningún test aún
                    </p>
                  )}
                </div>
              </div>

              <div>
                {testDetails ? (
                  <>
                    <h3 style={{ marginBottom: '1rem', color: '#001f3f' }}>
                      Retroalimentación del terapeuta
                    </h3>
                    
                    {testDetails.feedback && testDetails.feedback.length > 0 ? (
                      <div style={{ marginBottom: '2rem' }}>
                        {testDetails.feedback.map((fb) => (
                          <div key={fb.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginBottom: '1rem',
                              paddingBottom: '0.75rem',
                              borderBottom: '1px solid #dee2e6'
                            }}>
                              <span style={{ fontSize: '1.5rem' }}>👨‍⚕️</span>
                              <div>
                                <div style={{ fontWeight: 600, color: '#001f3f' }}>
                                  {fb.doctor_name}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                  {new Date(fb.created_at).toLocaleString('es-ES')}
                                </div>
                              </div>
                            </div>
                            <div style={{ 
                              fontSize: '1rem',
                              lineHeight: '1.6',
                              color: '#333',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {fb.feedback_text}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="card" style={{ 
                        padding: '2rem',
                        textAlign: 'center',
                        background: '#f8f9fa',
                        marginBottom: '2rem'
                      }}>
                        <p style={{ color: '#666' }}>
                          Aún no hay retroalimentación para este test. Tu terapeuta la enviará pronto.
                        </p>
                      </div>
                    )}

                    <div className="card" style={{ padding: '1.5rem', background: '#eff6ff' }}>
                      <h4 style={{ marginBottom: '0.5rem', color: '#001f3f' }}>
                        💡 Información importante
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6', margin: 0 }}>
                        La retroalimentación es confidencial y está diseñada para ayudarte en tu proceso. 
                        Si tienes dudas o necesitas hablar con tu terapeuta, no dudes en contactarlo.
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    Selecciona un test para ver la retroalimentación
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </InnerPage>
    </Shell>
  );
}

export default MyTestsPage;
