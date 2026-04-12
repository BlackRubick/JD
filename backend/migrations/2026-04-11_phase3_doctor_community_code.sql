-- Fase 3: Comunidad por codigo de doctor (tipo classroom)
-- Ejecutar una sola vez sobre la BD psybioneer.

ALTER TABLE users
  ADD COLUMN doctor_code VARCHAR(32) UNIQUE NULL AFTER role,
  ADD COLUMN linked_doctor_id INT NULL AFTER doctor_code,
  ADD CONSTRAINT fk_users_linked_doctor FOREIGN KEY (linked_doctor_id) REFERENCES users(id) ON DELETE SET NULL;

-- Crear codigo para doctores ya existentes si no tienen.
UPDATE users
SET doctor_code = CONCAT('DOC-', UPPER(SUBSTRING(MD5(CONCAT(id, email, NOW())), 1, 6)))
WHERE role = 'doctor' AND (doctor_code IS NULL OR doctor_code = '');
