import pool from '../config/database.js';

export const questionModel = {
  async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM questions WHERE is_active = TRUE ORDER BY position, id'
    );
    return rows;
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
