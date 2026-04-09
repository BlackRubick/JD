
import pool from '../config/database.js';
import { encrypt, decrypt } from '../utils/crypto.js';
import { getInstrumentMeta, normalizeInstrument } from '../utils/instrumentCatalog.js';

function safeDecrypt(value) {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'string') return value;
  if (!value.includes(':')) return value;

  try {
    return decrypt(value);
  } catch {
    return value;
  }
}

export const questionModel = {
  async getAll(instrumentCode) {
    const instrument = getInstrumentMeta(normalizeInstrument(instrumentCode));
    // Obtener todas las preguntas activas
    const [questions] = await pool.execute(
      'SELECT * FROM questions WHERE is_active = TRUE AND position BETWEEN ? AND ? ORDER BY position, id',
      [instrument.minPosition, instrument.maxPosition]
    );
    // Obtener todas las opciones de respuesta asociadas
    const [options] = await pool.execute(
      'SELECT * FROM answer_options ORDER BY question_id, position, id'
    );
    // Mapear opciones a cada pregunta
    const optionsByQuestion = {};
    for (const opt of options) {
      if (!optionsByQuestion[opt.question_id]) optionsByQuestion[opt.question_id] = [];
      optionsByQuestion[opt.question_id].push({
        id: opt.id,
        label: safeDecrypt(opt.label),
        value: Number(opt.value),
        score: opt.score,
        position: opt.position
      });
    }
    // Añadir las opciones a cada pregunta y excluir preguntas sin opciones para evitar tests rotos.
    return questions
      .map(q => ({
        ...q,
        text: safeDecrypt(q.text),
        instrument_code: instrument.code,
        instrument_name: instrument.name,
        options: optionsByQuestion[q.id] || []
      }))
      .filter((q) => q.options.length > 0);
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM questions WHERE id = ?',
      [id]
    );
    if (!rows[0]) return undefined;
    return {
      ...rows[0],
      text: safeDecrypt(rows[0].text)
    };
  },

  async create(text, position, created_by) {
    const [result] = await pool.execute(
      'INSERT INTO questions (text, position, created_by) VALUES (?, ?, ?)',
      [encrypt(text), position, created_by]
    );
    return result.insertId;
  },

  async addAnswerOption(question_id, label, value, score, position) {
    const [result] = await pool.execute(
      'INSERT INTO answer_options (question_id, label, value, score, position) VALUES (?, ?, ?, ?, ?)',
      [question_id, encrypt(label), Number(value), score, position]
    );
    return result.insertId;
  },

  async update(id, text, position) {
    await pool.execute(
      'UPDATE questions SET text = ?, position = ? WHERE id = ?',
      [encrypt(text), position, id]
    );
  },

  async delete(id) {
    await pool.execute(
      'UPDATE questions SET is_active = FALSE WHERE id = ?',
      [id]
    );
  }
};
