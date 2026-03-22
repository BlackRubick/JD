import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const doctorHash = await bcrypt.hash('doctor123', 10);
const pacienteHash = await bcrypt.hash('prueba123', 10);

await connection.execute('DELETE FROM users WHERE email IN (?, ?)', [
  'doctor@psybioneer.com',
  'prueba@hotmail.com',
]);

await connection.execute(
  'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
  ['Doctor Admin', 'doctor@psybioneer.com', doctorHash, 'doctor']
);

await connection.execute(
  'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
  ['Paciente Prueba', 'prueba@hotmail.com', pacienteHash, 'patient']
);

console.log('✅ Usuarios creados correctamente:');
console.log('   Doctor  → doctor@psybioneer.com  / doctor123');
console.log('   Paciente→ prueba@hotmail.com     / prueba123');

await connection.end();
