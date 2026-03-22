const QUESTIONS_KEY = 'psybioneer-questions';

const DEFAULT_QUESTIONS = [
  { id: 1, text: 'Me molestaron cosas que usualmente no me molestan' },
  { id: 2, text: 'No me sentí con ganas de comer; mi apetito estuvo malo' },
  { id: 3, text: 'Sentí que no podía quitarme de encima la tristeza aún con la ayuda de mi familia o amigos' },
  { id: 4, text: 'Sentí que yo era tan bueno como cualquier otra persona' },
  { id: 5, text: 'Tuve problemas para concentrarme en lo que estaba haciendo' },
  { id: 6, text: 'Me sentí deprimido' },
  { id: 7, text: 'Sentí que todo lo que hice fue con esfuerzo' },
  { id: 8, text: 'Me sentí optimista acerca del futuro' },
  { id: 9, text: 'Pensé que mi vida había sido un fracaso' },
  { id: 10, text: 'Me sentí con miedo' },
  { id: 11, text: 'Mi sueño fue inquieto' },
  { id: 12, text: 'Fui feliz' },
  { id: 13, text: 'Hablé menos de lo usual' },
  { id: 14, text: 'Me sentí solo' },
  { id: 15, text: 'La gente no fue amistosa' },
  { id: 16, text: 'Disfruté de la vida' },
  { id: 17, text: 'Pasé ratos llorando' },
  { id: 18, text: 'Me sentí triste' },
  { id: 19, text: 'Sentí que no le agradaba a la gente' },
  { id: 20, text: 'No pude seguir adelante' }
];

const RESPONSE_OPTIONS = [
  { value: 0, label: 'Raramente o nunca (menos de 1 día)' },
  { value: 1, label: 'Algunas veces o pocas veces (1-2 días)' },
  { value: 2, label: 'Ocasionalmente o moderadamente (3-4 días)' },
  { value: 3, label: 'La mayor parte del tiempo (5-7 días)' }
];

export function getStoredQuestions() {
  try {
    const stored = localStorage.getItem(QUESTIONS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_QUESTIONS;
  } catch (err) {
    console.error('Error loading questions:', err);
    return DEFAULT_QUESTIONS;
  }
}

export function saveQuestions(questions) {
  try {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    return true;
  } catch (err) {
    console.error('Error saving questions:', err);
    return false;
  }
}

export function addQuestion(text) {
  const questions = getStoredQuestions();
  const newId = Math.max(0, ...questions.map(q => q.id)) + 1;
  const newQuestion = { id: newId, text };
  const updated = [...questions, newQuestion];
  saveQuestions(updated);
  return newQuestion;
}

export function updateQuestion(id, text) {
  const questions = getStoredQuestions();
  const updated = questions.map(q => 
    q.id === id ? { ...q, text } : q
  );
  saveQuestions(updated);
  return updated.find(q => q.id === id);
}

export function deleteQuestion(id) {
  const questions = getStoredQuestions();
  const updated = questions.filter(q => q.id !== id);
  saveQuestions(updated);
  return true;
}

export function getResponseOptions() {
  return RESPONSE_OPTIONS;
}

export function ensureDefaultQuestions() {
  const stored = localStorage.getItem(QUESTIONS_KEY);
  if (!stored) {
    saveQuestions(DEFAULT_QUESTIONS);
  }
}
