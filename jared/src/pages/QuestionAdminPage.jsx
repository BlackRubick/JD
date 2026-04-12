import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';
import { questionAPI } from '../lib/api';

function QuestionAdminPage({ role, onLogout }) {
  const INSTRUMENTS = [
    { code: 'CESD', name: 'CES-D' },
    { code: 'PSS', name: 'PSS' },
    { code: 'IDARE', name: 'IDARE' },
    { code: 'BSS', name: 'BSS' },
  ];

  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('CESD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
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
      await questionAPI.create(newQuestionText.trim(), selectedInstrument);
      setNewQuestionText('');
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
        text: 'No se pudo agregar la pregunta',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  const handleEdit = (question) => {
    setEditingId(question.id);
    setEditText(question.text);
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
      const questionToEdit = questions.find(q => q.id === id);
      await questionAPI.update(id, editText.trim(), questionToEdit.position);
      setEditingId(null);
      setEditText('');
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
        text: 'No se pudo actualizar la pregunta',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
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
