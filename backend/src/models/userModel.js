import pool from '../config/database.js';
import { encrypt, decrypt } from '../utils/crypto.js';

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

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeDoctorCode(code) {
  return String(code || '').trim().toUpperCase();
}

export const userModel = {

  async findByEmail(email) {
    const target = normalizeEmail(email);

    // Camino principal: emails guardados en texto plano (esquema actual).
    const [plainRows] = await pool.execute(
      'SELECT * FROM users WHERE LOWER(TRIM(email)) = ? LIMIT 1',
      [target]
    );
    if (plainRows[0]) return this._decryptUser(plainRows[0]);

    // Compatibilidad: filas antiguas con email cifrado no deterministico.
    const [rows] = await pool.execute('SELECT * FROM users');
    const matched = rows.find((row) => normalizeEmail(safeDecrypt(row.email)) === target);
    if (!matched) return undefined;
    return this._decryptUser(matched);
  },


  async findById(id) {
    let rows;
    try {
      [rows] = await pool.execute(
        'SELECT id, name, email, role, date_of_birth, sex, doctor_code, linked_doctor_id, created_at FROM users WHERE id = ?',
        [id]
      );
    } catch {
      [rows] = await pool.execute(
        'SELECT id, name, email, role, date_of_birth, sex, created_at FROM users WHERE id = ?',
        [id]
      );
    }
    if (!rows[0]) return undefined;
    return this._decryptUser(rows[0]);
  },


  async create(userData) {
    const { name, email, password, role, date_of_birth, sex, created_by, doctor_code, linked_doctor_id } = userData;
    const normalizedDob = date_of_birth ? String(date_of_birth).slice(0, 10) : null;

    try {
      const [result] = await pool.execute(
        `INSERT INTO users
          (name, email, password, role, date_of_birth, sex, created_by, doctor_code, linked_doctor_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          encrypt(name),
          normalizeEmail(email),
          password,
          role ?? 'patient',
          normalizedDob,
          sex ? encrypt(sex) : null,
          created_by ?? null,
          doctor_code ? normalizeDoctorCode(doctor_code) : null,
          linked_doctor_id ?? null,
        ]
      );
      return result.insertId;
    } catch {
      // Compatibilidad con esquemas sin columnas doctor_code / linked_doctor_id.
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, role, date_of_birth, sex, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          encrypt(name),
          normalizeEmail(email),
          password,
          role ?? 'patient',
          normalizedDob,
          sex ? encrypt(sex) : null,
          created_by ?? null,
        ]
      );
      return result.insertId;
    }
  },

  async generateUniqueDoctorCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    for (let attempt = 0; attempt < 20; attempt += 1) {
      let generated = 'DOC-';
      for (let i = 0; i < 6; i += 1) {
        generated += alphabet[Math.floor(Math.random() * alphabet.length)];
      }

      const existing = await this.findDoctorByCode(generated);
      if (!existing) return generated;
    }

    throw new Error('No se pudo generar codigo unico de doctor');
  },

  async findDoctorByCode(doctorCode) {
    const normalized = normalizeDoctorCode(doctorCode);
    if (!normalized) return undefined;

    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE role = ? AND doctor_code = ? LIMIT 1',
        ['doctor', normalized]
      );
      if (!rows[0]) return undefined;
      return this._decryptUser(rows[0]);
    } catch {
      return undefined;
    }
  },

  async isPatientLinkedToDoctor(patientId, doctorId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM users WHERE id = ? AND role = ? AND linked_doctor_id = ? LIMIT 1',
        [patientId, 'patient', doctorId]
      );
      return Boolean(rows[0]);
    } catch {
      // En esquema viejo no existe relacion; mantener compatibilidad.
      return true;
    }
  },


  async getAllPatients(doctorId = null) {
    try {
      const [rows] = doctorId
        ? await pool.execute(
          'SELECT id, name, email, date_of_birth, sex, created_at, patient_status, patient_status_reason, deleted_at, linked_doctor_id FROM users WHERE role = ? AND linked_doctor_id = ?',
          ['patient', doctorId]
        )
        : await pool.execute(
          'SELECT id, name, email, date_of_birth, sex, created_at, patient_status, patient_status_reason, deleted_at, linked_doctor_id FROM users WHERE role = ?',
          ['patient']
        );
      return rows.map(this._decryptUser);
    } catch {
      // Compatibilidad con esquemas anteriores donde aun no existen columnas de fase 2.
      const [rows] = await pool.execute(
        'SELECT id, name, email, date_of_birth, sex, created_at FROM users WHERE role = ?',
        ['patient']
      );

      return rows.map((row) => ({
        ...this._decryptUser(row),
        patient_status: 'active',
        patient_status_reason: null,
        deleted_at: null,
      }));
    }
  },


  async getAllDoctors() {
    let rows;
    try {
      [rows] = await pool.execute(
        'SELECT id, name, email, doctor_code, created_at FROM users WHERE role = ?',
        ['doctor']
      );
    } catch {
      [rows] = await pool.execute(
        'SELECT id, name, email, created_at FROM users WHERE role = ?',
        ['doctor']
      );
    }
    return rows.map(this._decryptUser);
  },

  // Soft delete: marca la cuenta como eliminada y guarda fecha de eliminación
  async softDelete(id) {
    try {
      await pool.execute(
        'UPDATE users SET deleted_at = NOW() WHERE id = ?',
        [id]
      );
    } catch {
      // Compatibilidad con esquemas antiguos sin deleted_at.
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    }
  },

  async getPatientProfile(patientId) {
    let users;
    try {
      [users] = await pool.execute(
        `SELECT id, name, email, date_of_birth, sex, patient_status, patient_status_reason,
                patient_status_changed_at, deleted_at, created_at
         FROM users
         WHERE id = ?`,
        [patientId]
      );
    } catch {
      // Compatibilidad con esquemas antiguos sin columnas de estatus administrativo.
      [users] = await pool.execute(
        `SELECT id, name, email, date_of_birth, sex, created_at
         FROM users
         WHERE id = ?`,
        [patientId]
      );
    }

    if (!users[0]) return undefined;

    let records = [];
    try {
      [records] = await pool.execute(
        `SELECT user_id, gender, curp, phone, birthplace, nationality,
                address_line, city, state, postal_code,
                allergies, chronic_conditions, current_medications, notes,
                updated_at
         FROM patient_clinical_records
         WHERE user_id = ?`,
        [patientId]
      );
    } catch {
      // Compatibilidad: tabla de expediente clinico aun no creada.
      records = [];
    }

    const user = this._decryptUser({
      patient_status: 'active',
      patient_status_reason: null,
      patient_status_changed_at: null,
      deleted_at: null,
      ...users[0],
    });
    const clinical = records[0]
      ? this._decryptClinicalRecord(records[0])
      : {
          user_id: patientId,
          gender: '',
          curp: '',
          phone: '',
          birthplace: '',
          nationality: '',
          address_line: '',
          city: '',
          state: '',
          postal_code: '',
          allergies: '',
          chronic_conditions: '',
          current_medications: '',
          notes: '',
          updated_at: null,
        };

    return {
      ...user,
      clinical_record: clinical,
    };
  },

  async upsertClinicalRecord(patientId, payload) {
    const fields = {
      gender: payload.gender ?? '',
      curp: payload.curp ?? '',
      phone: payload.phone ?? '',
      birthplace: payload.birthplace ?? '',
      nationality: payload.nationality ?? '',
      address_line: payload.address_line ?? '',
      city: payload.city ?? '',
      state: payload.state ?? '',
      postal_code: payload.postal_code ?? '',
      allergies: payload.allergies ?? '',
      chronic_conditions: payload.chronic_conditions ?? '',
      current_medications: payload.current_medications ?? '',
      notes: payload.notes ?? '',
    };

    try {
      await pool.execute(
        `INSERT INTO patient_clinical_records
          (user_id, gender, curp, phone, birthplace, nationality, address_line, city, state, postal_code,
           allergies, chronic_conditions, current_medications, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           gender = VALUES(gender),
           curp = VALUES(curp),
           phone = VALUES(phone),
           birthplace = VALUES(birthplace),
           nationality = VALUES(nationality),
           address_line = VALUES(address_line),
           city = VALUES(city),
           state = VALUES(state),
           postal_code = VALUES(postal_code),
           allergies = VALUES(allergies),
           chronic_conditions = VALUES(chronic_conditions),
           current_medications = VALUES(current_medications),
           notes = VALUES(notes),
           updated_at = NOW()`,
        [
          patientId,
          encrypt(fields.gender),
          encrypt(fields.curp),
          encrypt(fields.phone),
          encrypt(fields.birthplace),
          encrypt(fields.nationality),
          encrypt(fields.address_line),
          encrypt(fields.city),
          encrypt(fields.state),
          encrypt(fields.postal_code),
          encrypt(fields.allergies),
          encrypt(fields.chronic_conditions),
          encrypt(fields.current_medications),
          encrypt(fields.notes),
        ]
      );
    } catch {
      // Compatibilidad: si falta tabla de expediente, no romper flujo base.
      return;
    }
  },

  async updatePatientStatus(patientId, status, reason, doctorId) {
    try {
      await pool.execute(
        `UPDATE users
         SET patient_status = ?,
             patient_status_reason = ?,
             patient_status_changed_at = NOW(),
             patient_status_changed_by = ?,
             deleted_at = CASE WHEN ? = 'discharged' THEN NOW() ELSE NULL END
         WHERE id = ?`,
        [status, reason ?? null, doctorId, status, patientId]
      );
    } catch {
      // Compatibilidad: en esquemas antiguos solo permitir baja efectiva.
      if (status === 'discharged') {
        await this.softDelete(patientId);
      }
    }
  },

  async hardDeletePatient(patientId) {
    await pool.execute(
      'DELETE FROM users WHERE id = ? AND role = ?',
      [patientId, 'patient']
    );
  },

  async existsPatientById(patientId) {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE id = ? AND role = ? LIMIT 1',
      [patientId, 'patient']
    );
    return Boolean(rows[0]);
  },

  async existsPatientLinkedToDoctor(patientId, doctorId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM users WHERE id = ? AND role = ? AND linked_doctor_id = ? LIMIT 1',
        [patientId, 'patient', doctorId]
      );
      return Boolean(rows[0]);
    } catch {
      return this.existsPatientById(patientId);
    }
  },

  // Utilidad para desencriptar los campos de usuario
  _decryptUser(user) {
    return {
      ...user,
      name: safeDecrypt(user.name),
      email: safeDecrypt(user.email),
      role: safeDecrypt(user.role),
      date_of_birth: safeDecrypt(user.date_of_birth),
      sex: safeDecrypt(user.sex),
      doctor_code: user.doctor_code || null,
      linked_doctor_id: user.linked_doctor_id || null,
    };
  },

  _decryptClinicalRecord(record) {
    return {
      ...record,
      gender: safeDecrypt(record.gender),
      curp: safeDecrypt(record.curp),
      phone: safeDecrypt(record.phone),
      birthplace: safeDecrypt(record.birthplace),
      nationality: safeDecrypt(record.nationality),
      address_line: safeDecrypt(record.address_line),
      city: safeDecrypt(record.city),
      state: safeDecrypt(record.state),
      postal_code: safeDecrypt(record.postal_code),
      allergies: safeDecrypt(record.allergies),
      chronic_conditions: safeDecrypt(record.chronic_conditions),
      current_medications: safeDecrypt(record.current_medications),
      notes: safeDecrypt(record.notes),
    };
  }
};
