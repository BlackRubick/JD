const INSTRUMENTS = {
  CESD: {
    code: 'CESD',
    name: 'CES-D',
    minId: 1,
    maxId: 20,
    minPosition: 1,
    maxPosition: 20,
    expectedQuestions: 20,
  },
  PSS: {
    code: 'PSS',
    name: 'PSS',
    minId: 21,
    maxId: 34,
    minPosition: 21,
    maxPosition: 34,
    expectedQuestions: 14,
  },
  IDARE: {
    code: 'IDARE',
    name: 'IDARE',
    minId: 35,
    maxId: 74,
    minPosition: 35,
    maxPosition: 74,
    expectedQuestions: 40,
  },
  BSS: {
    code: 'BSS',
    name: 'BSS',
    minId: 75,
    maxId: 93,
    minPosition: 75,
    maxPosition: 93,
    expectedQuestions: 19,
  },
};

const DEFAULT_INSTRUMENT = INSTRUMENTS.CESD.code;

export function getAllInstruments() {
  return Object.values(INSTRUMENTS);
}

export function isValidInstrument(code) {
  return Boolean(INSTRUMENTS[String(code || '').toUpperCase()]);
}

export function normalizeInstrument(code) {
  const normalized = String(code || '').toUpperCase();
  return isValidInstrument(normalized) ? normalized : DEFAULT_INSTRUMENT;
}

export function getInstrumentMeta(code) {
  return INSTRUMENTS[normalizeInstrument(code)];
}

export function getStatusLabel(status, hasFeedback) {
  if (status === 'in_progress') return 'En progreso';
  if (status === 'completed' && hasFeedback) return 'Retroalimentación hecha';
  if (status === 'completed' && !hasFeedback) return 'Falta retroalimentación';
  return 'No iniciado';
}

export { DEFAULT_INSTRUMENT };
