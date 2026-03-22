import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';
import { userAPI, testAPI } from '../lib/api';

function PatientsPage({ role, onLogout }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientTests, setPatientTests] = useState([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await userAPI.getAllPatients();
      setPatients(data);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los pacientes',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPatientTests = async (patientId) => {
    try {
      const tests = await testAPI.getPatientSessions(patientId);
      setPatientTests(tests);
      setSelectedPatient(patientId);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los tests del paciente',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  return (
    <Shell role={role} onLogout={onLogout}>
      <InnerPage 
        title="Gestión de Pacientes" 
        subtitle="Lista de todos los pacientes registrados"
        icon="👥"
      >
        <div style={{ padding: '2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Cargando pacientes...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {patients.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <p style={{ color: '#666' }}>No hay pacientes registrados</p>
                </div>
              ) : (
                patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="card"
                    style={{ 
                      padding: '1.5rem',
                      cursor: 'pointer',
                      border: selectedPatient === patient.id ? '2px solid #0066cc' : '2px solid transparent'
                    }}
                    onClick={() => loadPatientTests(patient.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#001f3f' }}>
                          {patient.name}
                        </h3>
                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                          📧 {patient.email}
                        </p>
                        {patient.date_of_birth && (
                          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                            📅 {new Date(patient.date_of_birth).toLocaleDateString()}
                          </p>
                        )}
                        {patient.sex && (
                          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                            👤 {patient.sex}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Link
                          to={`/patient/${patient.id}/tests`}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#0066cc',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '0.9rem'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Ver tests →
                        </Link>
                      </div>
                    </div>

                    {selectedPatient === patient.id && patientTests.length > 0 && (
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #dee2e6' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
                          Tests completados: {patientTests.filter(t => t.status === 'completed').length}
                        </h4>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          {patientTests.slice(0, 3).map((test) => (
                            <div
                              key={test.id}
                              style={{
                                padding: '0.75rem',
                                background: '#f8f9fa',
                                borderRadius: '6px',
                                fontSize: '0.85rem'
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>
                                {new Date(test.created_at).toLocaleDateString()}
                              </span>
                              {' - '}
                              <span style={{ 
                                color: test.status === 'completed' ? '#28a745' : '#ffc107'
                              }}>
                                {test.status === 'completed' ? 'Completado' : 'En progreso'}
                              </span>
                              {test.total_score !== null && (
                                <span style={{ marginLeft: '1rem', fontWeight: 600 }}>
                                  Puntaje: {test.total_score}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </InnerPage>
    </Shell>
  );
}

export default PatientsPage;
