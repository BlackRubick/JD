const INSTRUMENTS = {
  CESD: {
    code: 'CESD',
    name: 'CES-D',
    minPosition: 1,
    maxPosition: 20,
  },
  PSS: {
    code: 'PSS',
    name: 'PSS',
    minPosition: 21,
    maxPosition: 34,
  },
  IDARE: {
    code: 'IDARE',
    name: 'IDARE',
    minPosition: 35,
    maxPosition: 74,
  },
  BSS: {
    code: 'BSS',
    name: 'BSS',
    minPosition: 75,
    maxPosition: 93,
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
