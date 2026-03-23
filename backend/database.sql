CREATE DATABASE IF NOT EXISTS psybioneer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE psybioneer;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor') NOT NULL DEFAULT 'patient',
  date_of_birth DATE,
  sex VARCHAR(50),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  text TEXT NOT NULL,
  created_by INT,
  is_active BOOLEAN DEFAULT TRUE,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS test_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  assigned_by INT,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  total_score INT,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS test_responses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  test_session_id INT NOT NULL,
  question_id INT NOT NULL,
  response_value INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_response (test_session_id, question_id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  test_session_id INT NOT NULL,
  doctor_id INT NOT NULL,
  feedback_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS custom_test_assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS custom_test_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT NOT NULL,
  question_id INT NOT NULL,
  position INT DEFAULT 0,
  FOREIGN KEY (assignment_id) REFERENCES custom_test_assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, role) VALUES 
('Doctor Admin', 'doctor@psybioneer.com', '$2a$10$rZ5qH5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5e', 'doctor'),
('Paciente Prueba', 'prueba@hotmail.com', '$2a$10$rZ5qH5Z5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5e', 'patient');

INSERT INTO questions (text, position) VALUES 
('Me molestaron cosas que usualmente no me molestan', 1),
('No me sentí con ganas de comer; mi apetito estuvo malo', 2),
('Sentí que no podía quitarme de encima la tristeza aún con la ayuda de mi familia o amigos', 3),
('Sentí que yo era tan bueno como cualquier otra persona', 4),
('Tuve problemas para concentrarme en lo que estaba haciendo', 5),
('Me sentí deprimido', 6),
('Sentí que todo lo que hice fue con esfuerzo', 7),
('Me sentí optimista acerca del futuro', 8),
('Pensé que mi vida había sido un fracaso', 9),
('Me sentí con miedo', 10),
('Mi sueño fue inquieto', 11),
('Fui feliz', 12),
('Hablé menos de lo usual', 13),
('Me sentí solo', 14),
('La gente no fue amistosa', 15),
('Disfruté de la vida', 16),
('Pasé ratos llorando', 17),
('Me sentí triste', 18),
('Sentí que no le agradaba a la gente', 19),
('No pude seguir adelante', 20);

-- PSS-14
INSERT INTO questions (text, position) VALUES
('En el último mes, ¿con qué frecuencia ha estado afectado por algo que ha ocurrido inesperadamente?', 21),
('En el último mes, ¿con qué frecuencia se ha sentido incapaz de controlar las cosas importantes en su vida?', 22),
('En el último mes, ¿con qué frecuencia se ha sentido nervioso o estresado?', 23),
('En el último mes, ¿con qué frecuencia ha manejado con éxito los pequeños problemas irritantes de la vida?', 24),
('En el último mes, ¿con qué frecuencia ha sentido que ha afrontado efectivamente los cambios importantes que han estado ocurriendo en su vida?', 25),
('En el último mes, ¿con qué frecuencia ha estado seguro sobre su capacidad para manejar sus problemas personales?', 26),
('En el último mes, ¿con qué frecuencia ha sentido que las cosas le van bien?', 27),
('En el último mes, ¿con qué frecuencia ha sentido que no podía afrontar todas las cosas que tenía que hacer?', 28),
('En el último mes, ¿con qué frecuencia ha podido controlar las dificultades de su vida?', 29),
('En el último mes, ¿con qué frecuencia ha sentido que tenía todo bajo control?', 30),
('En el último mes, ¿con qué frecuencia ha estado enfadado porque las cosas que le han ocurrido estaban fuera de su control?', 31),
('En el último mes, ¿con qué frecuencia ha pensado sobre las cosas que le quedan por hacer?', 32),
('En el último mes, ¿con qué frecuencia ha podido controlar la forma de pasar el tiempo?', 33),
('En el último mes, ¿con qué frecuencia ha sentido que las dificultades se acumulan tanto que no puede superarlas?', 34);

-- IDARE - Ansiedad Estado
INSERT INTO questions (text, position) VALUES
('Me siento calmado', 35),
('Me siento seguro', 36),
('Estoy tenso', 37),
('Estoy contrariado', 38),
('Me siento a gusto', 39),
('Me siento alterado', 40),
('Estoy preocupado actualmente por algún posible contratiempo', 41),
('Me siento descansado', 42),
('Me siento ansioso', 43),
('Me siento cómodo', 44),
('Me siento con confianza en mí mismo', 45),
('Me siento nervioso', 46),
('Estoy agitado', 47),
('Me siento a punto de explotar', 48),
('Me siento relajado', 49),
('Me siento satisfecho', 50),
('Estoy preocupado', 51),
('Me siento muy preocupado y aturdido', 52),
('Me siento alegre', 53),
('Me siento bien', 54);

-- IDARE - Ansiedad Rasgo
INSERT INTO questions (text, position) VALUES
('Me siento mal', 55),
('Me canso rápidamente', 56),
('Siento ganas de llorar', 57),
('Quisiera ser tan feliz como otras personas parecen ser', 58),
('Pierdo oportunidades por no poder decidirme', 59),
('Me siento descansado', 60),
('Soy una persona tranquila, serena y sosegada', 61),
('Siento que las dificultades se me amontonan', 62),
('Me preocupo demasiado por cosas sin importancia', 63),
('Soy feliz', 64),
('Tomo las cosas muy a pecho', 65),
('Me falta confianza en mí mismo', 66),
('Me siento seguro', 67),
('Trato de evitar crisis y dificultades', 68),
('Me siento melancólico', 69),
('Me siento satisfecho', 70),
('Algunas ideas poco importantes pasan por mi mente', 71),
('Me afectan mucho los desengaños', 72),
('Soy una persona estable', 73),
('Me tenso al pensar en mis asuntos', 74);

-- BSS
INSERT INTO questions (text, position) VALUES
('Deseo de vivir', 75),
('Deseo de morir', 76),
('Razones para vivir/morir', 77),
('Deseo de intentar activamente el suicidio', 78),
('Deseos pasivos de suicidio', 79),
('Dimensión temporal (duración de la ideación/deseo suicida)', 80),
('Dimensión temporal (frecuencia del suicidio)', 81),
('Actitud hacia la ideación/deseo', 82),
('Control sobre la actividad suicida/deseos de acting out', 83),
('Disuasivos para un intento activo (familia, religión, irreversibilidad)', 84),
('Razones para el intento contemplado', 85),
('Método (especificidad/planificación del intento contemplado)', 86),
('Método (accesibilidad/oportunidad para el intento contemplado)', 87),
('Sentido de «capacidad» para llevar adelante el intento', 88),
('Expectativas/espera del intento actual', 89),
('Preparación actual para el intento contemplado', 90),
('Nota suicida', 91),
('Actos finales en anticipación de la muerte', 92),
('Engaño/encubrimiento del intento contemplado', 93);

-- Tabla para opciones de respuesta por pregunta
CREATE TABLE IF NOT EXISTS answer_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  label VARCHAR(255) NOT NULL,
  value INT NOT NULL,
  score INT,
  position INT DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Opciones de respuesta para CES-D (preguntas 1-20)
INSERT INTO answer_options (question_id, label, value, score, position) VALUES
-- Para cada pregunta del 1 al 20
(1, 'Raramente o nunca: Menos de 1 día', 0, 0, 1),
(1, 'Algo o poco: Entre 1-2 días', 1, 1, 2),
(1, 'A veces o bastante: Entre 3-4 días', 2, 2, 3),
(1, 'Mucho o siempre: Entre 5-7 días', 3, 3, 4),
(2, 'Raramente o nunca: Menos de 1 día', 0, 0, 1),
(2, 'Algo o poco: Entre 1-2 días', 1, 1, 2),
(2, 'A veces o bastante: Entre 3-4 días', 2, 2, 3),
(2, 'Mucho o siempre: Entre 5-7 días', 3, 3, 4),
-- ... repetir igual para preguntas 3 a 20 ...
(20, 'Raramente o nunca: Menos de 1 día', 0, 0, 1),
(20, 'Algo o poco: Entre 1-2 días', 1, 1, 2),
(20, 'A veces o bastante: Entre 3-4 días', 2, 2, 3),
(20, 'Mucho o siempre: Entre 5-7 días', 3, 3, 4);

-- Opciones de respuesta para PSS-14 (preguntas 21-34)
INSERT INTO answer_options (question_id, label, value, score, position) VALUES
(21, 'Nunca', 0, 0, 1),
(21, 'Casi nunca', 1, 1, 2),
(21, 'De vez en cuando', 2, 2, 3),
(21, 'A menudo', 3, 3, 4),
(21, 'Muy a menudo', 4, 4, 5),
-- ... repetir igual para preguntas 22 a 34 ...
(34, 'Nunca', 0, 0, 1),
(34, 'Casi nunca', 1, 1, 2),
(34, 'De vez en cuando', 2, 2, 3),
(34, 'A menudo', 3, 3, 4),
(34, 'Muy a menudo', 4, 4, 5);

-- Opciones de respuesta para IDARE Estado (preguntas 35-54)
INSERT INTO answer_options (question_id, label, value, score, position) VALUES
(35, 'No en lo absoluto', 1, 1, 1),
(35, 'Un poco', 2, 2, 2),
(35, 'Bastante', 3, 3, 3),
(35, 'Mucho', 4, 4, 4),
-- ... repetir igual para preguntas 36 a 54 ...
(54, 'No en lo absoluto', 1, 1, 1),
(54, 'Un poco', 2, 2, 2),
(54, 'Bastante', 3, 3, 3),
(54, 'Mucho', 4, 4, 4);

-- Opciones de respuesta para IDARE Rasgo (preguntas 55-74)
INSERT INTO answer_options (question_id, label, value, score, position) VALUES
(55, 'Casi nunca', 1, 1, 1),
(55, 'Algunas veces', 2, 2, 2),
(55, 'Frecuentemente', 3, 3, 3),
(55, 'Casi siempre', 4, 4, 4),
-- ... repetir igual para preguntas 56 a 74 ...
(74, 'Casi nunca', 1, 1, 1),
(74, 'Algunas veces', 2, 2, 2),
(74, 'Frecuentemente', 3, 3, 3),
(74, 'Casi siempre', 4, 4, 4);

-- Opciones de respuesta para BSS (preguntas 75-93)
INSERT INTO answer_options (question_id, label, value, score, position) VALUES
(75, 'Moderado a fuerte', 0, 0, 1),
(75, 'Débil', 1, 1, 2),
(75, 'Ninguno', 2, 2, 3),
(76, 'Ninguno', 0, 0, 1),
(76, 'Débil', 1, 1, 2),
(76, 'Moderado a fuerte', 2, 2, 3),
(77, 'Porque seguir viviendo vale más que morir', 0, 0, 1),
(77, 'Aproximadamente iguales', 1, 1, 2),
(77, 'Porque la muerte vale más que seguir viviendo', 2, 2, 3),
(78, 'Ninguno', 0, 0, 1),
(78, 'Débil', 1, 1, 2),
(78, 'Moderado a fuerte', 2, 2, 3),
(79, 'Puede tomar precauciones para salvaguardar la vida', 0, 0, 1),
(79, 'Puede dejar de vivir/morir por casualidad', 1, 1, 2),
(79, 'Puede evitar las etapas necesarias para seguir con vida', 2, 2, 3),
(80, 'Breve, períodos pasajeros', 0, 0, 1),
(80, 'Por amplios períodos de tiempo', 1, 1, 2),
(80, 'Continuo (crónico) o casi continuo', 2, 2, 3),
(81, 'Raro, ocasional', 0, 0, 1),
(81, 'Intermitente', 1, 1, 2),
(81, 'Persistente o continuo', 2, 2, 3),
(82, 'Rechazo', 0, 0, 1),
(82, 'Ambivalente, indiferente', 1, 1, 2),
(82, 'Aceptación', 2, 2, 3),
(83, 'Tiene sentido del control', 0, 0, 1),
(83, 'Inseguro', 1, 1, 2),
(83, 'No tiene sentido del control', 2, 2, 3),
(84, 'Puede no intentarlo a causa de un disuasivo', 0, 0, 1),
(84, 'Alguna preocupación sobre los medios pueden disuadirlo', 1, 1, 2),
(84, 'Mínima o ninguna preocupación o interés por ellos', 2, 2, 3),
(85, 'Manipular el entorno, llamar la atención, vengarse', 0, 0, 1),
(85, 'Combinación de 0 y 2', 1, 1, 2),
(85, 'Escapar, solucionar los problemas, finalizar de forma absoluta', 2, 2, 3),
(86, 'No considerado', 0, 0, 1),
(86, 'Considerado, pero detalles no calculados', 1, 1, 2),
(86, 'Detalles calculados/bien formulados', 2, 2, 3),
(87, 'Método no disponible, inaccesible. No hay oportunidad', 0, 0, 1),
(87, 'El método puede tomar tiempo o esfuerzo. Oportunidad escasa', 1, 1, 2),
(87, 'Método y oportunidad accesibles', 2, 2, 3),
(88, 'No tiene valor, demasiado débil, miedoso, incompetente', 0, 0, 1),
(88, 'Inseguridad sobre su valor', 1, 1, 2),
(88, 'Seguro de su valor, capacidad', 2, 2, 3),
(89, 'No', 0, 0, 1),
(89, 'Incierto', 1, 1, 2),
(89, 'Sí', 2, 2, 3),
(90, 'Ninguna', 0, 0, 1),
(90, 'Parcial (ej. empieza a almacenar pastillas, etc.)', 1, 1, 2),
(90, 'Completa (ej. tiene las pastillas, pistola cargada, etc.)', 2, 2, 3),
(91, 'Ninguna', 0, 0, 1),
(91, 'Piensa sobre ella o comenzada y no terminada', 1, 1, 2),
(91, 'Nota terminada', 2, 2, 3),
(92, 'Ninguno', 0, 0, 1),
(92, 'Piensa sobre ello o hace algunos arreglos', 1, 1, 2),
(92, 'Hace planes definitivos o terminó los arreglos finales', 2, 2, 3),
(93, 'Reveló las ideas abiertamente', 0, 0, 1),
(93, 'Frenó lo que estaba expresando', 1, 1, 2),
(93, 'Intentó engañar, ocultar, mentir', 2, 2, 3);
