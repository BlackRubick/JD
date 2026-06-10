-- Fix: columnas encriptadas con AES-256-CBC necesitan espacio para IV (24 chars base64) + ':' + texto encriptado
-- Un valor de 5 chars encriptado ocupa ~49 chars; uno de 100 chars ocupa ~161 chars.
-- Se amplían todas las columnas de patient_clinical_records que almacenan datos encriptados.

ALTER TABLE patient_clinical_records
  MODIFY COLUMN gender            VARCHAR(500),
  MODIFY COLUMN curp              VARCHAR(500),
  MODIFY COLUMN phone             VARCHAR(500),
  MODIFY COLUMN birthplace        VARCHAR(500),
  MODIFY COLUMN nationality       VARCHAR(500),
  MODIFY COLUMN address_line      TEXT,
  MODIFY COLUMN city              VARCHAR(500),
  MODIFY COLUMN state             VARCHAR(500),
  MODIFY COLUMN postal_code       VARCHAR(500),
  MODIFY COLUMN residence_inegi   VARCHAR(500);
