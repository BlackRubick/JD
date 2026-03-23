import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';
import InnerPage from '../components/InnerPage';
import { questionAPI, testAPI } from '../lib/api';



function TestPage({ role, onLogout }) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestionsAndStartSession();
  }, []);

  const loadQuestionsAndStartSession = async () => {
    try {
      const loadedQuestions = await questionAPI.getAll();
      setQuestions(loadedQuestions);
      
      const session = await testAPI.createSession();
      setSessionId(session.session_id);

      if (session.resumed) {
        const details = await testAPI.getSessionDetails(session.session_id);
        const mappedResponses = details.responses.reduce((acc, item) => {
          acc[item.question_id] = item.response_value;
          return acc;
        }, {});
        setResponses(mappedResponses);

        const firstUnansweredIndex = loadedQuestions.findIndex(
          (q) => mappedResponses[q.id] === undefined
        );
        setCurrentQuestion(firstUnansweredIndex === -1 ? loadedQuestions.length - 1 : firstUnansweredIndex);
      }
    } catch (error) {
      const blockedByFeedback =
        error?.message?.includes('retroalimentación') ||
        error?.message?.includes('retroalimentacion');

      if (blockedByFeedback) {
        await Swal.fire({
          title: 'No puedes iniciar otro test',
          text: 'Debes esperar la retroalimentación de tu último test para continuar.',
          icon: 'info',
          confirmButtonColor: '#0066cc',
          confirmButtonText: 'Ver mis tests'
        });
        navigate('/my-tests');
        return;
      }

      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las preguntas. Verifica tu conexión.',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = async (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    if (sessionId) {
      try {
        await testAPI.saveResponse(sessionId, questionId, value);
      } catch (error) {
        console.error('Error saving response:', error);
      }
    }
  };

  const handleNext = () => {
    if (responses[questions[currentQuestion].id] === undefined) {
      Swal.fire({
        title: 'Respuesta requerida',
        text: 'Por favor selecciona una respuesta antes de continuar',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#0066cc'
      });
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);
      
      await testAPI.completeSession(sessionId, totalScore);
      
      Swal.fire({
        title: 'Test finalizado',
        html: `
          <p>Tu evaluación fue finalizada correctamente.</p>
          <p style="color: #666; margin-top: 1rem;">Ahora debes esperar la retroalimentación de tu terapeuta para poder realizar otro test.</p>
        `,
        icon: 'success',
        confirmButtonText: 'Ir a mis tests',
        confirmButtonColor: '#0066cc'
      }).then(() => {
        navigate('/my-tests');
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo completar el test. Intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#0066cc'
      });
    }
  };

  if (loading || questions.length === 0) {
    return (
      <Shell role={role} onLogout={onLogout}>
        <InnerPage title="Cargando..." subtitle="" icon="⏳">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Cargando preguntas...
          </div>
        </InnerPage>
      </Shell>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <Shell role={role} onLogout={onLogout}>
      <InnerPage 
        title="Evaluación de bienestar" 
        subtitle={`Pregunta ${currentQuestion + 1} de ${questions.length}`}
        icon="📋"
      >
        <div style={{ padding: '2rem' }}>
          <div style={{ 
            marginTop: 24, 
            padding: '16px 20px',
            background: '#eff6ff', 
            borderRadius: 10, 
            border: '1px solid #bfdbfe',
            fontSize: '0.85rem', 
            color: 'var(--blue)', 
            lineHeight: 1.65,
            marginBottom: '2rem'
          }}>
            💡 Tus respuestas son confidenciales y no serán compartidas sin tu consentimiento.
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              height: '8px',
              background: '#e9ecef',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0066cc, #00bfff)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ 
              textAlign: 'right', 
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              {Math.round(progress)}% completado
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '2rem',
              color: '#001f3f',
              lineHeight: '1.6'
            }}>
              {question.text}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(question.options || []).map(option => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    border: `2px solid ${
                      responses[question.id] === option.value ? '#0066cc' : '#dee2e6'
                    }`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: responses[question.id] === option.value ? '#e6f2ff' : 'white',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.value}
                    checked={responses[question.id] === option.value}
                    onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
                    style={{ marginRight: '1rem', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1rem', color: '#333' }}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="btn-secondary"
              style={{
                padding: '0.8rem 2rem',
                opacity: currentQuestion === 0 ? 0.5 : 1,
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Anterior
            </button>
            <button
              onClick={handleNext}
              className="btn-primary"
              style={{ padding: '0.8rem 2rem' }}
            >
              {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </InnerPage>
    </Shell>
  );
}

export default TestPage;