import pool from '../config/database.js';

export const userModel = {
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, date_of_birth, sex, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async create(userData) {
    const { name, email, password, role, date_of_birth, sex, created_by } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, date_of_birth, sex, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, role ?? 'patient', date_of_birth ?? null, sex ?? null, created_by ?? null]
    );
    return result.insertId;
  },

  async getAllPatients() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, date_of_birth, sex, created_at FROM users WHERE role = "patient" ORDER BY created_at DESC'
    );
    return rows;
  },

  async getAllDoctors() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE role = "doctor" ORDER BY created_at DESC'
    );
    return rows;
  },

  // Soft delete: marca la cuenta como eliminada y guarda fecha de eliminación
  async softDelete(id) {
    await pool.execute(
      'UPDATE users SET deleted_at = NOW() WHERE id = ?',
      [id]
    );
  }
};
