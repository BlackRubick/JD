-- Fase 1: sesiones por instrumento y estados operativos
-- Ejecutar una sola vez en la base de datos psybioneer.

ALTER TABLE test_sessions
  ADD COLUMN instrument_code ENUM('CESD', 'PSS', 'IDARE', 'BSS') NOT NULL DEFAULT 'CESD' AFTER assigned_by;

-- Mapear sesiones historicas al primer instrumento para mantener compatibilidad.
UPDATE test_sessions
SET instrument_code = 'CESD'
WHERE instrument_code IS NULL OR instrument_code = '';

CREATE INDEX idx_test_sessions_patient_instrument
  ON test_sessions (patient_id, instrument_code, created_at);
