import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';
import { questionAPI } from '../lib/api';

const INSTRUMENTS = [
  { code: 'CESD', name: 'CES-D' },
  { code: 'PSS', name: 'PSS' },
  { code: 'IDARE', name: 'IDARE' },
  { code: 'BSS', name: 'BSS' },
];

const TEMPLATE_OPTIONS = {
  CESD_4: [
    { label: 'Raramente o nunca: Menos de 1 dia', value: 0, score: 0 },
    { label: 'Algo o poco: Entre 1-2 dias', value: 1, score: 1 },
    { label: 'A veces o bastante: Entre 3-4 dias', value: 2, score: 2 },
    { label: 'Mucho o siempre: Entre 5-7 dias', value: 3, score: 3 },
  ],
  PSS_5: [
    { label: 'Nunca', value: 0, score: 0 },
    { label: 'Casi nunca', value: 1, score: 1 },
    { label: 'De vez en cuando', value: 2, score: 2 },
    { label: 'A menudo', value: 3, score: 3 },
    { label: 'Muy a menudo', value: 4, score: 4 },
  ],
  IDARE_4: [
    { label: 'No en lo absoluto', value: 1, score: 1 },
    { label: 'Un poco', value: 2, score: 2 },
    { label: 'Bastante', value: 3, score: 3 },
    { label: 'Mucho', value: 4, score: 4 },
  ],
  BSS_3: [
    { label: 'Bajo', value: 0, score: 0 },
    { label: 'Medio', value: 1, score: 1 },
    { label: 'Alto', value: 2, score: 2 },
  ],
};

const DEFAULT_TEMPLATE_BY_INSTRUMENT = {
  CESD: 'CESD_4',
  PSS: 'PSS_5',
  IDARE: 'IDARE_4',
  BSS: 'BSS_3',
};

function cloneTemplate(templateKey) {
  return (TEMPLATE_OPTIONS[templateKey] || TEMPLATE_OPTIONS.CESD_4).map((opt) => ({ ...opt }));
}

function sanitizeOptionsForSave(options) {
  return (options || [])
    .map((opt) => ({
      label: String(opt.label || '').trim(),
      value: Number(opt.value),
      score: Number(opt.score),
    }))
    .filter((opt) => opt.label && Number.isFinite(opt.value) && Number.isFinite(opt.score));
}

function QuestionAdminPage({ role, onLogout }) {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editTemplate, setEditTemplate] = useState('CUSTOM');
  const [editOptions, setEditOptions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('CESD');
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE_BY_INSTRUMENT.CESD);
  const [newOptions, setNewOptions] = useState(cloneTemplate(DEFAULT_TEMPLATE_BY_INSTRUMENT.CESD));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [selectedInstrument]);

  useEffect(() => {
    const templateKey = DEFAULT_TEMPLATE_BY_INSTRUMENT[selectedInstrument] || 'CESD_4';
    setSelectedTemplate(templateKey);
    setNewOptions(cloneTemplate(templateKey));
  }, [selectedInstrument]);

  const loadQuestions = async () => {
    try {
      const loaded = await questionAPI.getAll(selectedInstrument);
      setQuestions(loaded);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las preguntas',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newQuestionText.trim()) {
      Swal.fire({
        title: 'Campo vacío',
        text: 'Por favor escribe una pregunta',
        icon: 'warning',
        confirmButtonColor: '#0066cc'
      });
      return;
    }

    try {
      const normalizedOptions = sanitizeOptionsForSave(newOptions);
      if (normalizedOptions.length < 2) {
        await Swal.fire({
          title: 'Opciones incompletas',
          text: 'Debes capturar al menos 2 opciones validas para el tipo de respuesta',
          icon: 'warning',
          confirmButtonColor: '#0066cc'
        });
        return;
      }

      await questionAPI.create(newQuestionText.trim(), selectedInstrument, normalizedOptions);
      setNewQuestionText('');
      setSelectedTemplate(DEFAULT_TEMPLATE_BY_INSTRUMENT[selectedInstrument] || 'CESD_4');
      setNewOptions(cloneTemplate(DEFAULT_TEMPLATE_BY_INSTRUMENT[selectedInstrument] || 'CESD_4'));
      await loadQuestions();
      
      Swal.fire({
        title: 'Pregunta agregada',
        text: 'La nueva pregunta ha sido añadida exitosamente',
        icon: 'success',
        confirmButtonColor: '#0066cc',
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo agregar la pregunta',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  const handleEdit = (question) => {
    setEditingId(question.id);
    setEditText(question.text);
    setEditTemplate('CUSTOM');
    setEditOptions((question.options || []).map((opt) => ({
      label: opt.label,
      value: Number(opt.value),
      score: Number(opt.score ?? opt.value),
    })));
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) {
      Swal.fire({
        title: 'Campo vacío',
        text: 'La pregunta no puede estar vacía',
        icon: 'warning',
        confirmButtonColor: '#0066cc'
      });
      return;
    }

    try {
      const normalizedOptions = sanitizeOptionsForSave(editOptions);
      if (normalizedOptions.length < 2) {
        await Swal.fire({
          title: 'Opciones incompletas',
          text: 'Debes capturar al menos 2 opciones validas para guardar',
          icon: 'warning',
          confirmButtonColor: '#0066cc'
        });
        return;
      }

      const questionToEdit = questions.find(q => q.id === id);
      await questionAPI.update(id, editText.trim(), questionToEdit.position, normalizedOptions, selectedInstrument);
      setEditingId(null);
      setEditText('');
      setEditTemplate('CUSTOM');
      setEditOptions([]);
      await loadQuestions();
      
      Swal.fire({
        title: 'Pregunta actualizada',
        icon: 'success',
        confirmButtonColor: '#0066cc',
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo actualizar la pregunta',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditTemplate('CUSTOM');
    setEditOptions([]);
  };

  const handleApplyNewTemplate = (templateKey) => {
    setSelectedTemplate(templateKey);
    setNewOptions(cloneTemplate(templateKey));
  };

  const handleApplyEditTemplate = (templateKey) => {
    setEditTemplate(templateKey);
    setEditOptions(cloneTemplate(templateKey));
  };

  const handleNewOptionChange = (index, field, value) => {
    setNewOptions((prev) => prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt)));
  };

  const handleEditOptionChange = (index, field, value) => {
    setEditOptions((prev) => prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt)));
  };

  const addNewOptionRow = () => {
    setNewOptions((prev) => ([...prev, { label: '', value: prev.length, score: prev.length }]));
  };

  const addEditOptionRow = () => {
    setEditOptions((prev) => ([...prev, { label: '', value: prev.length, score: prev.length }]));
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar pregunta?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await questionAPI.delete(id);
        await loadQuestions();
        
        Swal.fire({
          title: 'Pregunta eliminada',
          icon: 'success',
          confirmButtonColor: '#0066cc',
          timer: 2000
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la pregunta',
          icon: 'error',
          confirmButtonColor: '#0066cc'
        });
      }
    }
  };

  return (
    <Shell role={role} onLogout={onLogout}>
      <InnerPage 
        title="Administrar Preguntas" 
        subtitle="Edita, agrega o elimina preguntas del cuestionario"
        icon="⚙️"
      >
        <div style={{ padding: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#001f3f', fontWeight: 700 }}>Test:</span>
              {INSTRUMENTS.map((instrument) => (
                <button
                  key={instrument.code}
                  onClick={() => setSelectedInstrument(instrument.code)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '999px',
                    border: selectedInstrument === instrument.code ? '2px solid #0057b8' : '1px solid #cbd5e1',
                    background: selectedInstrument === instrument.code ? '#eff6ff' : '#fff',
                    color: selectedInstrument === instrument.code ? '#0057b8' : '#334155',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {instrument.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#001f3f' }}>
              Agregar nueva pregunta ({selectedInstrument})
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                Tipo de respuesta
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleApplyNewTemplate(e.target.value)}
                style={{ padding: '0.55rem 0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="CESD_4">Escala CES-D (4 opciones: 0-3)</option>
                <option value="PSS_5">Escala PSS (5 opciones: 0-4)</option>
                <option value="IDARE_4">Escala IDARE (4 opciones: 1-4)</option>
                <option value="BSS_3">Escala BSS (3 opciones: 0-2)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Escribe la nueva pregunta aquí..."
                style={{
                  flex: 1,
                  padding: '0.8rem',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
              <button
                onClick={handleAdd}
                className="btn-primary"
                style={{ padding: '0.8rem 2rem', whiteSpace: 'nowrap' }}
              >
                ➕ Agregar
              </button>
            </div>
            <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ color: '#334155' }}>Opciones de respuesta</strong>
                <button onClick={addNewOptionRow} className="btn-secondary" style={{ padding: '0.4rem 0.7rem' }}>+ Opcion</button>
              </div>
              {newOptions.map((opt, idx) => (
                <div key={`new-opt-${idx}`} style={{ display: 'grid', gridTemplateColumns: '1fr 95px 95px', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    value={opt.label}
                    onChange={(e) => handleNewOptionChange(idx, 'label', e.target.value)}
                    placeholder={`Etiqueta opcion ${idx + 1}`}
                    style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <input
                    type="number"
                    value={opt.value}
                    onChange={(e) => handleNewOptionChange(idx, 'value', e.target.value)}
                    placeholder="Valor"
                    style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <input
                    type="number"
                    value={opt.score}
                    onChange={(e) => handleNewOptionChange(idx, 'score', e.target.value)}
                    placeholder="Puntaje"
                    style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#001f3f' }}>
              Preguntas actuales de {selectedInstrument} ({questions.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    padding: '1.5rem',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    background: editingId === question.id ? '#fff9e6' : 'white'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}>
                    <div style={{
                      minWidth: '40px',
                      height: '40px',
                      background: '#0066cc',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {index + 1}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      {editingId === question.id ? (
                        <>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.8rem',
                              border: '2px solid #0066cc',
                              borderRadius: '8px',
                              fontSize: '1rem',
                              minHeight: '80px',
                              resize: 'vertical'
                            }}
                          />
                          <div style={{ marginTop: '0.9rem' }}>
                            <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                              Tipo de respuesta
                            </label>
                            <select
                              value={editTemplate}
                              onChange={(e) => handleApplyEditTemplate(e.target.value)}
                              style={{ padding: '0.55rem 0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '0.8rem' }}
                            >
                              <option value="CUSTOM">Personalizado (actual)</option>
                              <option value="CESD_4">Escala CES-D (4 opciones: 0-3)</option>
                              <option value="PSS_5">Escala PSS (5 opciones: 0-4)</option>
                              <option value="IDARE_4">Escala IDARE (4 opciones: 1-4)</option>
                              <option value="BSS_3">Escala BSS (3 opciones: 0-2)</option>
                            </select>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
                              <strong style={{ color: '#334155', fontSize: '0.92rem' }}>Opciones de respuesta</strong>
                              <button onClick={addEditOptionRow} className="btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>+ Opcion</button>
                            </div>
                            {editOptions.map((opt, idx) => (
                              <div key={`edit-opt-${question.id}-${idx}`} style={{ display: 'grid', gridTemplateColumns: '1fr 85px 85px', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <input
                                  value={opt.label}
                                  onChange={(e) => handleEditOptionChange(idx, 'label', e.target.value)}
                                  style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                                <input
                                  type="number"
                                  value={opt.value}
                                  onChange={(e) => handleEditOptionChange(idx, 'value', e.target.value)}
                                  style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                                <input
                                  type="number"
                                  value={opt.score}
                                  onChange={(e) => handleEditOptionChange(idx, 'score', e.target.value)}
                                  style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p style={{ 
                          fontSize: '1rem', 
                          lineHeight: '1.6',
                          margin: '0.5rem 0'
                        }}>
                          {question.text}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      {editingId === question.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(question.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            ✓ Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            ✕ Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(question)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#ffc107',
                              color: '#000',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(question.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </InnerPage>
    </Shell>
  );
}

export default QuestionAdminPage;
