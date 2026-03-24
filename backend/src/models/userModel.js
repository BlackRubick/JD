import pool from '../config/database.js';
import { encrypt, decrypt } from '../utils/crypto.js';

export const userModel = {

  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [encrypt(email)]
    );
    if (!rows[0]) return undefined;
    return this._decryptUser(rows[0]);
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
        encrypt(email),
        password, // la contraseña ya viene hasheada
        encrypt(role ?? 'patient'),
        date_of_birth ? encrypt(date_of_birth) : null,
        sex ? encrypt(sex) : null,
        created_by ?? null
      ]
    );
    return result.insertId;
  },


  async getAllPatients() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, date_of_birth, sex, created_at FROM users WHERE role = ?',
      [encrypt('patient')]
    );
    return rows.map(this._decryptUser);
  },


  async getAllDoctors() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE role = ?',
      [encrypt('doctor')]
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

  // Utilidad para desencriptar los campos de usuario
  _decryptUser(user) {
    return {
      ...user,
      name: user.name ? decrypt(user.name) : user.name,
      email: user.email ? decrypt(user.email) : user.email,
      role: user.role ? decrypt(user.role) : user.role,
      date_of_birth: user.date_of_birth ? decrypt(user.date_of_birth) : user.date_of_birth,
      sex: user.sex ? decrypt(user.sex) : user.sex
    };
  }
};
