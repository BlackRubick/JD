-- Hotfix: recuperar separacion por instrumento cuando todas las preguntas quedaron en CESD
-- por haber agregado instrument_code con DEFAULT antes del backfill.
-- Seguro para ejecutar en produccion: solo corrige preguntas historicas base (id <= 93).

UPDATE questions
SET instrument_code = CASE
  WHEN id BETWEEN 1 AND 20 THEN 'CESD'
  WHEN id BETWEEN 21 AND 34 THEN 'PSS'
  WHEN id BETWEEN 35 AND 74 THEN 'IDARE'
  WHEN id BETWEEN 75 AND 93 THEN 'BSS'
  ELSE instrument_code
END
WHERE id BETWEEN 1 AND 93;
