-- Fase 4: habilitar crecimiento de preguntas por instrumento sin rangos fijos
-- Ejecutar una sola vez en la base de datos psybioneer.

ALTER TABLE questions
  ADD COLUMN instrument_code ENUM('CESD', 'PSS', 'IDARE', 'BSS') NOT NULL DEFAULT 'CESD' AFTER text;

-- Backfill inicial para preguntas historicas por posicion.
UPDATE questions
SET instrument_code = CASE
  WHEN position BETWEEN 1 AND 20 THEN 'CESD'
  WHEN position BETWEEN 21 AND 34 THEN 'PSS'
  WHEN position BETWEEN 35 AND 74 THEN 'IDARE'
  WHEN position BETWEEN 75 AND 93 THEN 'BSS'
  ELSE 'CESD'
END
WHERE instrument_code IS NULL OR instrument_code = '';

CREATE INDEX idx_questions_instrument_active_position
  ON questions (instrument_code, is_active, position);
