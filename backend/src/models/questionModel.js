import pool from '../config/database.js';

export const questionModel = {
  async getAll() {
    // Obtener todas las preguntas activas
    const [questions] = await pool.execute(
      'SELECT * FROM questions WHERE is_active = TRUE ORDER BY position, id'
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
        label: opt.label,
        value: opt.value,
        score: opt.score,
        position: opt.position
      });
    }
    // Añadir las opciones a cada pregunta
    return questions.map(q => ({
      ...q,
      options: optionsByQuestion[q.id] || []
    }));
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM questions WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async create(text, position, created_by) {
    const [result] = await pool.execute(
      'INSERT INTO questions (text, position, created_by) VALUES (?, ?, ?)',
      [text, position, created_by]
    );
    return result.insertId;
  },

  async update(id, text, position) {
    await pool.execute(
      'UPDATE questions SET text = ?, position = ? WHERE id = ?',
      [text, position, id]
    );
  },

  async delete(id) {
    await pool.execute(
      'UPDATE questions SET is_active = FALSE WHERE id = ?',
      [id]
    );
  }
};
