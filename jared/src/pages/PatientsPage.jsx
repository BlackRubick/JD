

import { useState, useEffect } from 'react';
import { exportPatientPDF } from '../utils/exportPatientPDF';
import { getAppointmentRequests, updateAppointmentRequest, addAppointmentRequest } from '../lib/appointments';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';
import { userAPI, testAPI } from '../lib/api';

function PatientsPage({ role, onLogout }) {
  // Simulación: obtener letra del psicólogo por su email (en real, sería por id)
  // Ejemplo: primer psicólogo 'A', segundo 'B', etc.
  // Aquí usamos el primer caracter del correo si existe, si no, 'A'
  const getPsychologistLetter = () => {
    // En real, obtén el índice del psicólogo en la lista de doctores
    const email = localStorage.getItem('psybioneer-email') || '';
    // Simulación: hash simple
    const code = email ? email.charCodeAt(0) - 97 : 0;
    const letter = String.fromCharCode(65 + ((code >= 0 && code < 26) ? code : 0));
    return letter;
  };
  const psychologistLetter = getPsychologistLetter();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 920);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientTests, setPatientTests] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [savingRecord, setSavingRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({
    gender: '',
    curp: '',
    phone: '',
    birthplace: '',
    nationality: '',
    residence_inegi: '',
    first_name: '',
    last_name: '',
    second_last_name: '',
    address_line: '',
    city: '',
    state: '',
    postal_code: '',
    allergies: '',
    chronic_conditions: '',
    current_medications: '',
    notes: '',
  });

  // --- Folio para paciente seleccionado (igual que en la lista) ---
  const getSelectedPatientFolio = () => {
    if (!selectedProfile) return '';
    const idx = patients.findIndex(p => p.id === selectedProfile.id);
    if (idx === -1) return '';
    return `${psychologistLetter}${String(idx + 1).padStart(4, '0')}`;
  };

  // --- Datos para exportar a PDF ---
  const getPatientExportData = () => {
    if (!selectedProfile) return null;
    const folio = getSelectedPatientFolio();
    const age = selectedProfile.date_of_birth ? Math.floor((new Date() - new Date(selectedProfile.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)) : '';
    const sex = selectedProfile.sex || '';
    const tests = patientTests.map(t => ({
      name: t.test_name || t.name,
      date: t.created_at,
      score: t.total_score,
      interpretation: t.interpretation || ''
    }));
    return {
      folio,
      age,
      sex,
      tests,
      profile: selectedProfile,
      record: recordForm
    };
  };

function PatientsPage({ role, onLogout }) {
  // Simulación: obtener letra del psicólogo por su email (en real, sería por id)
  // Ejemplo: primer psicólogo 'A', segundo 'B', etc.
  // Aquí usamos el primer caracter del correo si existe, si no, 'A'
  const getPsychologistLetter = () => {
    // En real, obtén el índice del psicólogo en la lista de doctores
    const email = localStorage.getItem('psybioneer-email') || '';
    // Simulación: hash simple
    const code = email ? email.charCodeAt(0) - 97 : 0;
    const letter = String.fromCharCode(65 + ((code >= 0 && code < 26) ? code : 0));
    return letter;
  };
  const psychologistLetter = getPsychologistLetter();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 920);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientTests, setPatientTests] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [savingRecord, setSavingRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({
    gender: '',
    curp: '',
    phone: '',
    birthplace: '',
    nationality: '',
    residence_inegi: '',
    first_name: '',
    last_name: '',
    second_last_name: '',
    address_line: '',
    city: '',
    state: '',
    postal_code: '',
    allergies: '',
    chronic_conditions: '',
    current_medications: '',
    notes: '',
  });

  useEffect(() => {
    console.log('[PatientsPage] Montando componente...');
    loadPatients();
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 920);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const loadPatients = async () => {
    try {
      console.log('[PatientsPage] Llamando a userAPI.getAllPatients...');
      const data = await userAPI.getAllPatients();
      console.log('[PatientsPage] Pacientes recibidos:', data);
      setPatients(data);
    } catch (error) {
      console.error('[PatientsPage] Error al cargar pacientes:', error);
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
      const [tests, profileData] = await Promise.all([
        testAPI.getPatientSessions(patientId),
        userAPI.getPatientProfile(patientId),
      ]);
      setPatientTests(tests);
      setSelectedPatient(patientId);

      const patient = profileData.patient;
      setSelectedProfile(patient);
      setRecordForm({
        gender: patient.clinical_record?.gender || '',
        curp: patient.clinical_record?.curp || '',
        phone: patient.clinical_record?.phone || '',
        birthplace: patient.clinical_record?.birthplace || '',
        nationality: patient.clinical_record?.nationality || '',
        residence_inegi: patient.clinical_record?.residence_inegi || '',
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        second_last_name: patient.second_last_name || '',
        address_line: patient.clinical_record?.address_line || '',
        city: patient.clinical_record?.city || '',
        state: patient.clinical_record?.state || '',
        postal_code: patient.clinical_record?.postal_code || '',
        allergies: patient.clinical_record?.allergies || '',
        chronic_conditions: patient.clinical_record?.chronic_conditions || '',
        current_medications: patient.clinical_record?.current_medications || '',
        notes: patient.clinical_record?.notes || '',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los tests del paciente',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  const handleRecordChange = (key, value) => {
    setRecordForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveClinicalRecord = async () => {
    if (!selectedPatient) return;

    try {
      setSavingRecord(true);
      const data = await userAPI.updatePatientClinicalRecord(selectedPatient, recordForm);
      setSelectedProfile(data.patient);
      await Swal.fire({
        icon: 'success',
        title: 'Expediente actualizado',
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo actualizar el expediente clinico',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    } finally {
      setSavingRecord(false);
    }
  };

  const updateStatus = async (status) => {
    if (!selectedPatient) return;

    const { value: reason } = await Swal.fire({
      title: status === 'inactive' ? 'Inhabilitar paciente' : (status === 'discharged' ? 'Dar de baja paciente' : 'Reactivar paciente'),
      input: 'text',
      inputLabel: 'Motivo administrativo',
      inputPlaceholder: 'Ej. tratamiento concluido',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0066cc',
    });

    if (reason === undefined) return;

    try {
      const data = await userAPI.updatePatientStatus(selectedPatient, status, reason || '');
      setSelectedProfile(data.patient);
      await loadPatients();
      Swal.fire({
        icon: 'success',
        title: 'Estatus actualizado',
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo actualizar el estatus',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  const handleDeletePatient = async (patientId, patientName) => {
    if (!patientId || !patientName) return;

    const confirmationText = `ELIMINAR ${patientName}`;
    const { value } = await Swal.fire({
      icon: 'warning',
      title: 'Eliminar paciente permanentemente',
      html: `Esta accion eliminara al paciente y su informacion asociada.<br/><strong>Escribe:</strong> ${confirmationText}`,
      input: 'text',
      inputPlaceholder: confirmationText,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    });

    if (value === undefined) return;

    if (String(value || '').trim() !== confirmationText) {
      await Swal.fire({
        icon: 'error',
        title: 'Confirmacion invalida',
        text: 'No se elimino el paciente porque el texto no coincide.',
        confirmButtonColor: '#0066cc',
      });
      return;
    }

    try {
      await userAPI.deletePatient(patientId);
      await loadPatients();

      if (selectedPatient === patientId) {
        setSelectedPatient(null);
        setSelectedProfile(null);
        setPatientTests([]);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Paciente eliminado',
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar',
        text: error.message || 'Error al eliminar paciente',
        confirmButtonColor: '#0066cc',
      });
    }
  };

  // --- Citas solicitadas (solo para psicólogo) ---
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    if (role === 'therapist' || role === 'doctor') {
      setAppointments(getAppointmentRequests());
    }
  }, [role]);

  const handleAcceptAppointment = (idx, keepDate) => {
    let newDate = '';
    let newTime = '';
    if (!keepDate) {
      Swal.fire({
        title: 'Reagendar cita',
        html:
          `<input id="swal-date" type="date" class="swal2-input" placeholder="Fecha" style="margin-bottom:8px;" />` +
          `<input id="swal-time" type="time" class="swal2-input" placeholder="Hora" />`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Agendar',
        preConfirm: () => {
          const date = document.getElementById('swal-date').value;
          const time = document.getElementById('swal-time').value;
          if (!date || !time) {
            Swal.showValidationMessage('Debes ingresar fecha y hora');
            return false;
          }
          return { date, time };
        }
      }).then(({ value }) => {
        if (value) {
          updateAppointmentRequest(idx, { status: 'agendada', date: value.date, time: value.time });
          setAppointments(getAppointmentRequests());
          Swal.fire({ icon: 'success', title: 'Cita agendada', timer: 1200, showConfirmButton: false });
        }
      });
      return;
    }
    updateAppointmentRequest(idx, { status: 'agendada' });
    setAppointments(getAppointmentRequests());
    Swal.fire({ icon: 'success', title: 'Cita agendada', timer: 1200, showConfirmButton: false });
  };

  return (
    <Shell role={role} onLogout={onLogout}>
      {(role === 'therapist' || role === 'doctor') && appointments.length > 0 && (
        <>
          {/* Solicitudes pendientes */}
          <div className="card" style={{ margin: '1rem 0', padding: '1.5rem', background: '#f8fafc' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>Solicitudes de cita</h3>
            <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
              {appointments.filter(a => a.status !== 'agendada').length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.97rem' }}>No hay solicitudes pendientes.</div>
              ) : appointments.map((a, idx) => a.status !== 'agendada' && (
                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, background: '#fff' }}>
                  <div style={{ fontSize: '0.97rem', color: '#334155' }}>
                    <b>Paciente:</b> {a.patientName || 'Paciente'}<br/>
                    <b>Fecha propuesta:</b> {a.date} <b>Hora:</b> {a.time}<br/>
                    <b>Estatus:</b> Pendiente
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button className="btn-primary" style={{ fontSize: '0.9rem' }} onClick={() => handleAcceptAppointment(idx, true)}>
                      Aceptar fecha propuesta
                    </button>
                    <button className="btn-ghost" style={{ fontSize: '0.9rem' }} onClick={() => handleAcceptAppointment(idx, false)}>
                      Reagendar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citas agendadas */}
          <div className="card" style={{ margin: '1rem 0', padding: '1.5rem', background: '#f0fdf4' }}>
            <h3 style={{ margin: 0, color: '#166534', fontSize: '1.1rem' }}>Citas agendadas</h3>
            <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
              {appointments.filter(a => a.status === 'agendada').length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.97rem' }}>No hay citas agendadas.</div>
              ) : appointments.map((a, idx) => a.status === 'agendada' && (
                <div key={idx} style={{ border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, background: '#fff' }}>
                  <div style={{ fontSize: '0.97rem', color: '#166534' }}>
                    <b>Paciente:</b> {a.patientName || 'Paciente'}<br/>
                    <b>Fecha:</b> {a.date} <b>Hora:</b> {a.time}<br/>
                    <b>Estatus:</b> Agendada
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <InnerPage 
        title="Gestión de Pacientes" 
        subtitle="Lista de todos los pacientes registrados"
        icon="👥"
      >
        <div style={{ padding: '2rem' }}>
          {console.log('[PatientsPage] Render pacientes:', patients)}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Cargando pacientes...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.15fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
              {patients.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <p style={{ color: '#666' }}>No hay pacientes registrados</p>
                </div>
              ) : (
                patients.map((patient, idx) => {
                  // Folio: Letra del psicólogo + número incremental (relleno 4 dígitos)
                  const folio = `${psychologistLetter}${String(idx + 1).padStart(4, '0')}`;
                  return (
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
                          <h3 style={{ margin: '0 0 0.5rem 0', color: '#001f3f', letterSpacing: '0.04em' }}>
                            Folio: {folio}
                          </h3>
                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                          📧 {patient.email}
                        </p>
                        <p style={{ margin: '0.25rem 0', fontSize: '0.82rem', color: '#475569' }}>
                          Estatus: {patient.patient_status === 'inactive' ? 'Inhabilitado' : (patient.patient_status === 'discharged' ? 'De baja' : 'Activo')}
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
                        <button
                          className="btn-ghost"
                          style={{ marginTop: 8, borderColor: '#2563eb', color: '#2563eb', width: '100%' }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            const { value: formValues } = await Swal.fire({
                              title: 'Agendar cita',
                              html:
                                `<input id="swal-date" type="date" class="swal2-input" placeholder="Fecha" style="margin-bottom:8px;" />` +
                                `<input id="swal-time" type="time" class="swal2-input" placeholder="Hora" />`,
                              focusConfirm: false,
                              showCancelButton: true,
                              confirmButtonText: 'Solicitar',
                              preConfirm: () => {
                                const date = document.getElementById('swal-date').value;
                                const time = document.getElementById('swal-time').value;
                                if (!date || !time) {
                                  Swal.showValidationMessage('Debes ingresar fecha y hora');
                                  return false;
                                }
                                return { date, time };
                              }
                            });
                            if (formValues) {
                              addAppointmentRequest({
                                patientName: patient.name,
                                patientId: patient.id,
                                date: formValues.date,
                                time: formValues.time,
                                status: 'pendiente'
                              });
                              Swal.fire({
                                icon: 'success',
                                title: 'Solicitud enviada',
                                text: `Tu solicitud de cita para el día ${formValues.date} a las ${formValues.time} ha sido enviada.`,
                                confirmButtonColor: '#2563eb'
                              });
                            }
                          }}
                        >
                          Agendar cita
                        </button>
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
                    );
                })
              )}
            </div>

              <div className="card" style={{ padding: '1rem' }}>
                {!selectedProfile ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>
                    Selecciona un paciente para ver su perfil detallado
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '0.9rem' }}>
                    {/* Botón para exportar PDF (solo preparación, sin lógica aún) */}
                    <button
                      className="btn-primary"
                      style={{ marginBottom: 10, maxWidth: 220 }}
                      onClick={() => {
                        const data = getPatientExportData();
                        if (!data) return;
                        exportPatientPDF(data);
                      }}
                    >
                      Exportar PDF
                    </button>
                    <h3 style={{ color: '#001f3f', margin: 0 }}>Perfil detallado del paciente</h3>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                      <strong>Nombre:</strong> {selectedProfile.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                      <strong>Correo:</strong> {selectedProfile.email}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                      <strong>Fecha de nacimiento:</strong> {selectedProfile.date_of_birth ? new Date(selectedProfile.date_of_birth).toLocaleDateString() : 'No registrada'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                      <strong>Sexo:</strong> {selectedProfile.sex || 'No registrado'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                      <strong>Estatus administrativo:</strong> {selectedProfile.patient_status === 'inactive' ? 'Inhabilitado' : (selectedProfile.patient_status === 'discharged' ? 'De baja' : 'Activo')}
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 6, paddingTop: 10 }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>Expediente clinico (NOM-024)</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <input className="input" placeholder="Nombre(s)" value={recordForm.first_name} onChange={(e) => handleRecordChange('first_name', e.target.value)} />
                        <input className="input" placeholder="Primer apellido" value={recordForm.last_name} onChange={(e) => handleRecordChange('last_name', e.target.value)} />
                        <input className="input" placeholder="Segundo apellido" value={recordForm.second_last_name} onChange={(e) => handleRecordChange('second_last_name', e.target.value)} />
                        <input className="input" placeholder="Genero" value={recordForm.gender} onChange={(e) => handleRecordChange('gender', e.target.value)} />
                        <input className="input" placeholder="CURP" value={recordForm.curp} onChange={(e) => handleRecordChange('curp', e.target.value)} />
                        <input className="input" placeholder="Telefono" value={recordForm.phone} onChange={(e) => handleRecordChange('phone', e.target.value)} />
                        <input className="input" placeholder="Nacionalidad" value={recordForm.nationality} onChange={(e) => handleRecordChange('nationality', e.target.value)} />
                        <input className="input" placeholder="Lugar de nacimiento" value={recordForm.birthplace} onChange={(e) => handleRecordChange('birthplace', e.target.value)} />
                        <input className="input" placeholder="Lugar de residencia (INEGI)" value={recordForm.residence_inegi} onChange={(e) => handleRecordChange('residence_inegi', e.target.value)} />
                        <input className="input" placeholder="Codigo postal" value={recordForm.postal_code} onChange={(e) => handleRecordChange('postal_code', e.target.value)} />
                        <input className="input" placeholder="Municipio de residencia" value={recordForm.state} onChange={(e) => handleRecordChange('state', e.target.value)} />
                        <input className="input" placeholder="Localidad/barrio de residencia" value={recordForm.city} onChange={(e) => handleRecordChange('city', e.target.value)} />
                      </div>
                      <input className="input" style={{ marginTop: 8 }} placeholder="Domicilio" value={recordForm.address_line} onChange={(e) => handleRecordChange('address_line', e.target.value)} />
                      <textarea className="input" style={{ marginTop: 8, minHeight: 70 }} placeholder="Alergias" value={recordForm.allergies} onChange={(e) => handleRecordChange('allergies', e.target.value)} />
                      <textarea className="input" style={{ marginTop: 8, minHeight: 70 }} placeholder="Padecimientos cronicos" value={recordForm.chronic_conditions} onChange={(e) => handleRecordChange('chronic_conditions', e.target.value)} />
                      <textarea className="input" style={{ marginTop: 8, minHeight: 70 }} placeholder="Medicacion actual" value={recordForm.current_medications} onChange={(e) => handleRecordChange('current_medications', e.target.value)} />
                      <textarea className="input" style={{ marginTop: 8, minHeight: 70 }} placeholder="Notas clinicas" value={recordForm.notes} onChange={(e) => handleRecordChange('notes', e.target.value)} />
                      <button className="btn-primary" style={{ marginTop: 8 }} onClick={saveClinicalRecord} disabled={savingRecord}>
                        {savingRecord ? 'Guardando...' : 'Guardar expediente'}
                      </button>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 6, paddingTop: 10 }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>Administración del paciente</h4>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button className="btn-ghost" onClick={() => handleDeletePatient(selectedPatient, selectedProfile?.name)} style={{ borderColor: '#ef4444', color: '#b91c1c' }}>
                          Eliminar paciente
                        </button>
                      </div>
                    </div>
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
}
export default PatientsPage;
