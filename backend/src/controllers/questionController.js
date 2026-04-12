import { questionModel } from '../models/questionModel.js';
import { normalizeInstrument } from '../utils/instrumentCatalog.js';

const OPTION_TEMPLATES = {
  CESD: [
    { label: 'Raramente o nunca: Menos de 1 dia', value: 0, score: 0 },
    { label: 'Algo o poco: Entre 1-2 dias', value: 1, score: 1 },
    { label: 'A veces o bastante: Entre 3-4 dias', value: 2, score: 2 },
    { label: 'Mucho o siempre: Entre 5-7 dias', value: 3, score: 3 },
  ],
  PSS: [
    { label: 'Nunca', value: 0, score: 0 },
    { label: 'Casi nunca', value: 1, score: 1 },
    { label: 'De vez en cuando', value: 2, score: 2 },
    { label: 'A menudo', value: 3, score: 3 },
    { label: 'Muy a menudo', value: 4, score: 4 },
  ],
  IDARE: [
    { label: 'No en lo absoluto', value: 1, score: 1 },
    { label: 'Un poco', value: 2, score: 2 },
    { label: 'Bastante', value: 3, score: 3 },
    { label: 'Mucho', value: 4, score: 4 },
  ],
  BSS: [
    { label: 'Bajo', value: 0, score: 0 },
    { label: 'Medio', value: 1, score: 1 },
    { label: 'Alto', value: 2, score: 2 },
  ],
};

function sanitizeOptions(options, fallbackInstrument) {
  if (!Array.isArray(options) || options.length === 0) {
    return OPTION_TEMPLATES[fallbackInstrument] || OPTION_TEMPLATES.CESD;
  }

  const normalized = options
    .map((opt) => ({
      label: String(opt?.label || '').trim(),
      value: Number(opt?.value),
      score: opt?.score === undefined || opt?.score === null ? Number(opt?.value) : Number(opt?.score),
    }))
    .filter((opt) => opt.label && Number.isFinite(opt.value) && Number.isFinite(opt.score));

  if (normalized.length < 2) {
    return OPTION_TEMPLATES[fallbackInstrument] || OPTION_TEMPLATES.CESD;
  }

  return normalized;
}

export const questionController = {
  async getAll(req, res) {
    try {
         const questions = await questionModel.getAll(req.query.instrument);
         res.json(questions);
    } catch (error) {
      console.error('Error al obtener preguntas:', error);
      res.status(500).json({ error: 'Error al obtener preguntas' });
    }
  },

  async create(req, res) {
    try {
      const { text, instrument, options } = req.body;
      const normalizedInstrument = normalizeInstrument(instrument);
      const position = await questionModel.getNextPositionForInstrument(normalizedInstrument);
      const normalizedOptions = sanitizeOptions(options, normalizedInstrument);
      const questionId = await questionModel.create(text, position, req.user.id);
      await questionModel.replaceAnswerOptions(questionId, normalizedOptions);
      res.status(201).json({
        message: 'Pregunta creada exitosamente',
        question: { id: questionId, text, position, instrument: normalizedInstrument }
      });
    } catch (error) {
      console.error('Error al crear pregunta:', error);
      if (String(error?.message || '').includes('No hay espacio disponible')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al crear pregunta' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { text, position, instrument, options } = req.body;
      await questionModel.update(id, text, position);
      if (Array.isArray(options)) {
        const normalizedInstrument = normalizeInstrument(instrument);
        const normalizedOptions = sanitizeOptions(options, normalizedInstrument);
        await questionModel.replaceAnswerOptions(id, normalizedOptions);
      }
      res.json({ message: 'Pregunta actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar pregunta:', error);
      res.status(500).json({ error: 'Error al actualizar pregunta' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await questionModel.delete(id);
      res.json({ message: 'Pregunta eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar pregunta:', error);
      res.status(500).json({ error: 'Error al eliminar pregunta' });
    }
  }
};
