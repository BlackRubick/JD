-- Fase 2: expediente clinico NOM-024 y estatus administrativo de pacientes
-- Ejecutar una sola vez sobre la BD psybioneer.

ALTER TABLE users
  ADD COLUMN patient_status ENUM('active', 'inactive', 'discharged') NOT NULL DEFAULT 'active' AFTER sex,
  ADD COLUMN patient_status_reason TEXT NULL AFTER patient_status,
  ADD COLUMN patient_status_changed_at TIMESTAMP NULL AFTER patient_status_reason,
  ADD COLUMN patient_status_changed_by INT NULL AFTER patient_status_changed_at,
  ADD COLUMN deleted_at TIMESTAMP NULL AFTER patient_status_changed_by,
  ADD CONSTRAINT fk_users_status_changed_by FOREIGN KEY (patient_status_changed_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS patient_clinical_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  gender VARCHAR(100),
  curp VARCHAR(50),
  phone VARCHAR(50),
  birthplace VARCHAR(255),
  nationality VARCHAR(100),
  address_line VARCHAR(255),
  city VARCHAR(120),
  state VARCHAR(120),
  postal_code VARCHAR(20),
  allergies TEXT,
  chronic_conditions TEXT,
  current_medications TEXT,
  notes TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
