import pool from '../config/database.js';

export const testModel = {
  async getInProgressSessionByPatient(patient_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM test_sessions WHERE patient_id = ? AND status = "in_progress" ORDER BY created_at DESC LIMIT 1',
      [patient_id]
    );
    return rows[0] || null;
  },

  async getCompletedSessionWithoutFeedback(patient_id) {
    const [rows] = await pool.execute(
      `SELECT ts.*
       FROM test_sessions ts
       LEFT JOIN feedback f ON f.test_session_id = ts.id
       WHERE ts.patient_id = ? AND ts.status = "completed"
       GROUP BY ts.id
       HAVING COUNT(f.id) = 0
       ORDER BY ts.completed_at DESC, ts.created_at DESC
       LIMIT 1`,
      [patient_id]
    );
    return rows[0] || null;
  },

  async createSession(patient_id, assigned_by = null) {
    const [result] = await pool.execute(
      'INSERT INTO test_sessions (patient_id, assigned_by, status) VALUES (?, ?, "in_progress")',
      [patient_id, assigned_by]
    );
    return result.insertId;
  },

  async saveResponse(test_session_id, question_id, response_value) {
    await pool.execute(
      'INSERT INTO test_responses (test_session_id, question_id, response_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE response_value = ?',
      [test_session_id, question_id, response_value, response_value]
    );
  },

  async completeSession(test_session_id, total_score) {
    await pool.execute(
      'UPDATE test_sessions SET status = "completed", total_score = ?, completed_at = NOW() WHERE id = ?',
      [total_score, test_session_id]
    );
  },

  async getSessionsByPatient(patient_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM test_sessions WHERE patient_id = ? ORDER BY created_at DESC',
      [patient_id]
    );
    return rows;
  },

  async getSessionById(session_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM test_sessions WHERE id = ?',
      [session_id]
    );
    return rows[0];
  },

  async getSessionResponses(session_id) {
    const [rows] = await pool.execute(
      `SELECT tr.*, q.text as question_text 
       FROM test_responses tr 
       JOIN questions q ON tr.question_id = q.id 
       WHERE tr.test_session_id = ? 
       ORDER BY q.position, q.id`,
      [session_id]
    );
    return rows;
  },

  async getAllSessionsWithPatients() {
    const [rows] = await pool.execute(
      `SELECT ts.*, u.name as patient_name, u.email as patient_email
       FROM test_sessions ts
       JOIN users u ON ts.patient_id = u.id
       ORDER BY ts.created_at DESC`
    );
    return rows;
  },

  async getFeedback(session_id) {
    const [rows] = await pool.execute(
      `SELECT f.*, u.name as doctor_name 
       FROM feedback f 
       JOIN users u ON f.doctor_id = u.id 
       WHERE f.test_session_id = ?
       ORDER BY f.created_at DESC`,
      [session_id]
    );
    return rows;
  },

  async addFeedback(test_session_id, doctor_id, feedback_text) {
    const [result] = await pool.execute(
      'INSERT INTO feedback (test_session_id, doctor_id, feedback_text) VALUES (?, ?, ?)',
      [test_session_id, doctor_id, feedback_text]
    );
    return result.insertId;
  }
};
