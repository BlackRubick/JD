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
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, date_of_birth, sex, created_at FROM users WHERE id = ?',
      [id]
    );
    if (!rows[0]) return undefined;
    return this._decryptUser(rows[0]);
  },


  async create(userData) {
    const { name, email, password, role, date_of_birth, sex, created_by } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, date_of_birth, sex, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        encrypt(name),
        normalizeEmail(email),
        password, // la contraseña ya viene hasheada
        role ?? 'patient',
        date_of_birth ? encrypt(date_of_birth) : null,
        sex ? encrypt(sex) : null,
        created_by ?? null
      ]
    );
    return result.insertId;
  },


  async getAllPatients() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, date_of_birth, sex, created_at, patient_status, patient_status_reason, deleted_at FROM users WHERE role = ?',
      ['patient']
    );
    return rows.map(this._decryptUser);
  },


  async getAllDoctors() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE role = ?',
      ['doctor']
    );
    return rows.map(this._decryptUser);
  },

  // Soft delete: marca la cuenta como eliminada y guarda fecha de eliminación
  async softDelete(id) {
    await pool.execute(
      'UPDATE users SET deleted_at = NOW() WHERE id = ?',
      [id]
    );
  },

  async getPatientProfile(patientId) {
    const [users] = await pool.execute(
      `SELECT id, name, email, date_of_birth, sex, patient_status, patient_status_reason,
              patient_status_changed_at, deleted_at, created_at
       FROM users
       WHERE id = ?`,
      [patientId]
    );

    if (!users[0]) return undefined;

    const [records] = await pool.execute(
      `SELECT user_id, gender, curp, phone, birthplace, nationality,
              address_line, city, state, postal_code,
              allergies, chronic_conditions, current_medications, notes,
              updated_at
       FROM patient_clinical_records
       WHERE user_id = ?`,
      [patientId]
    );

    const user = this._decryptUser(users[0]);
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
  },

  async updatePatientStatus(patientId, status, reason, doctorId) {
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
  },

  // Utilidad para desencriptar los campos de usuario
  _decryptUser(user) {
    return {
      ...user,
      name: safeDecrypt(user.name),
      email: safeDecrypt(user.email),
      role: safeDecrypt(user.role),
      date_of_birth: safeDecrypt(user.date_of_birth),
      sex: safeDecrypt(user.sex)
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
