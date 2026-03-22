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
