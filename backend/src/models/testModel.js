
import pool from '../config/database.js';
import { encrypt, decrypt } from '../utils/crypto.js';
import {
  getAllInstruments,
  getInstrumentMeta,
  getStatusLabel,
  normalizeInstrument,
} from '../utils/instrumentCatalog.js';

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

export const testModel = {
  async getAnyInProgressSessionByPatient(patient_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM test_sessions WHERE patient_id = ? AND status = "in_progress" ORDER BY created_at DESC LIMIT 1',
      [patient_id]
    );
    return rows[0] || null;
  },

  async getInProgressSessionByPatient(patient_id, instrumentCode) {
    const instrument = normalizeInstrument(instrumentCode);
    const [rows] = await pool.execute(
      'SELECT * FROM test_sessions WHERE patient_id = ? AND instrument_code = ? AND status = "in_progress" ORDER BY created_at DESC LIMIT 1',
      [patient_id, instrument]
    );
    return rows[0] || null;
  },

  async getCompletedSessionWithoutFeedback(patient_id, instrumentCode) {
    const instrument = normalizeInstrument(instrumentCode);
    const [rows] = await pool.execute(
      `SELECT ts.*
       FROM test_sessions ts
       LEFT JOIN feedback f ON f.test_session_id = ts.id
       WHERE ts.patient_id = ? AND ts.instrument_code = ? AND ts.status = "completed"
       GROUP BY ts.id
       HAVING COUNT(f.id) = 0
       ORDER BY ts.completed_at DESC, ts.created_at DESC
       LIMIT 1`,
      [patient_id, instrument]
    );
    return rows[0] || null;
  },

  async getAnyCompletedSessionWithoutFeedback(patient_id) {
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

  async createSession(patient_id, assigned_by = null, instrumentCode) {
    const instrument = normalizeInstrument(instrumentCode);
    const [result] = await pool.execute(
      'INSERT INTO test_sessions (patient_id, assigned_by, instrument_code, status) VALUES (?, ?, ?, ?)',
      [patient_id, assigned_by, instrument, 'in_progress']
    );
    return result.insertId;
  },

  async saveResponse(test_session_id, question_id, response_value) {
    await pool.execute(
      'INSERT INTO test_responses (test_session_id, question_id, response_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE response_value = ?',
      [test_session_id, question_id, Number(response_value), Number(response_value)]
    );
  },

  async completeSession(test_session_id, total_score) {
    await pool.execute(
      'UPDATE test_sessions SET status = ?, total_score = ?, completed_at = NOW() WHERE id = ?',
      ['completed', total_score, test_session_id]
    );
  },

  async getSessionsByPatient(patient_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM test_sessions WHERE patient_id = ? ORDER BY created_at DESC',
      [patient_id]
    );

    const [feedbackRows] = await pool.execute(
      `SELECT test_session_id, COUNT(*) as feedback_count
       FROM feedback
       WHERE test_session_id IN (
         SELECT id FROM test_sessions WHERE patient_id = ?
       )
       GROUP BY test_session_id`,
      [patient_id]
    );

    const feedbackMap = new Map(feedbackRows.map((row) => [row.test_session_id, Number(row.feedback_count) > 0]));
    return rows.map((row) => this._decryptSession(row, feedbackMap.get(row.id) || false));
  },

  async getSessionById(session_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM test_sessions WHERE id = ?',
      [session_id]
    );
    if (!rows[0]) return undefined;

    const [feedbackRows] = await pool.execute(
      'SELECT COUNT(*) as feedback_count FROM feedback WHERE test_session_id = ?',
      [session_id]
    );

    return this._decryptSession(rows[0], Number(feedbackRows[0]?.feedback_count || 0) > 0);
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
    return rows.map(r => ({
      ...r,
      response_value: Number(safeDecrypt(r.response_value)),
      question_text: safeDecrypt(r.question_text)
    }));
  },

  async getAllSessionsWithPatients() {
    const [rows] = await pool.execute(
      `SELECT ts.*, u.name as patient_name, u.email as patient_email
       FROM test_sessions ts
       JOIN users u ON ts.patient_id = u.id
       ORDER BY ts.created_at DESC`
    );

    const [feedbackRows] = await pool.execute(
      'SELECT test_session_id, COUNT(*) as feedback_count FROM feedback GROUP BY test_session_id'
    );
    const feedbackMap = new Map(feedbackRows.map((row) => [row.test_session_id, Number(row.feedback_count) > 0]));

    return rows.map((row) => {
      const decrypted = this._decryptSession(row, feedbackMap.get(row.id) || false);
      return {
        ...decrypted,
        patient_name: safeDecrypt(row.patient_name),
        patient_email: safeDecrypt(row.patient_email),
      };
    });
  },

  async getPatientInstrumentStatuses(patient_id) {
    const [rows] = await pool.execute(
      `SELECT ts.id, ts.instrument_code, ts.status, ts.created_at,
              EXISTS(SELECT 1 FROM feedback f WHERE f.test_session_id = ts.id) AS has_feedback
       FROM test_sessions ts
       WHERE ts.patient_id = ?
       ORDER BY ts.created_at DESC`,
      [patient_id]
    );

    const latestByInstrument = new Map();
    for (const row of rows) {
      const key = normalizeInstrument(row.instrument_code);
      if (!latestByInstrument.has(key)) {
        latestByInstrument.set(key, row);
      }
    }

    return getAllInstruments().map((instrument) => {
      const latest = latestByInstrument.get(instrument.code);
      if (!latest) {
        return {
          instrument_code: instrument.code,
          instrument_name: instrument.name,
          state_code: 'not_started',
          state_label: 'No iniciado',
          session_id: null,
          updated_at: null,
        };
      }

      const rawStatus = safeDecrypt(latest.status);
      const hasFeedback = Boolean(latest.has_feedback);
      const stateLabel = getStatusLabel(rawStatus, hasFeedback);
      const stateCode = rawStatus === 'in_progress'
        ? 'in_progress'
        : (rawStatus === 'completed'
          ? (hasFeedback ? 'feedback_done' : 'pending_feedback')
          : 'not_started');

      return {
        instrument_code: instrument.code,
        instrument_name: instrument.name,
        state_code: stateCode,
        state_label: stateLabel,
        session_id: latest.id,
        updated_at: latest.created_at,
      };
    });
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
    return rows.map(r => ({
      ...r,
      feedback_text: safeDecrypt(r.feedback_text),
      doctor_name: safeDecrypt(r.doctor_name)
    }));
  },

  async addFeedback(test_session_id, doctor_id, feedback_text) {
    const [result] = await pool.execute(
      'INSERT INTO feedback (test_session_id, doctor_id, feedback_text) VALUES (?, ?, ?)',
      [test_session_id, doctor_id, encrypt(feedback_text)]
    );
    return result.insertId;
  },

  _decryptSession(session, hasFeedback = false) {
    const rawStatus = safeDecrypt(session.status);
    const instrumentCode = normalizeInstrument(session.instrument_code);
    const instrument = getInstrumentMeta(instrumentCode);
    const businessStatusCode = rawStatus === 'in_progress'
      ? 'in_progress'
      : (rawStatus === 'completed'
        ? (hasFeedback ? 'feedback_done' : 'pending_feedback')
        : 'not_started');

    return {
      ...session,
      status: rawStatus,
      completion_status_label: rawStatus === 'completed' ? 'Finalizado' : 'En progreso',
      instrument_code: instrument.code,
      instrument_name: instrument.name,
      business_status_code: businessStatusCode,
      business_status: getStatusLabel(rawStatus, hasFeedback),
      has_feedback: hasFeedback,
    };
  }
};
