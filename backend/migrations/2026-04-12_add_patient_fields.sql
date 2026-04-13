-- Agrega los campos de apellidos y residencia INEGI si no existen en users y patient_clinical_records

ALTER TABLE users
  ADD COLUMN first_name VARCHAR(120) NULL AFTER name,
  ADD COLUMN last_name VARCHAR(120) NULL AFTER first_name,
  ADD COLUMN second_last_name VARCHAR(120) NULL AFTER last_name;

ALTER TABLE patient_clinical_records
  ADD COLUMN residence_inegi VARCHAR(32) NULL AFTER nationality;