# Psybioneer Backend API

Backend API para la plataforma Psybioneer de salud mental.

## Requisitos

- Node.js v16 o superior
- MySQL 8.0 o superior

## Instalación

1. Instalar dependencias:
```bash
cd backend
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de MySQL.

3. Crear la base de datos:
```bash
mysql -u root -p < database.sql
```

4. Aplicar migración de sesiones por instrumento:
```bash
mysql -u root -p psybioneer < migrations/2026-04-08_phase1_test_instruments.sql
```

5. Aplicar migración de expediente clinico y estatus administrativo:
```bash
mysql -u root -p psybioneer < migrations/2026-04-09_phase2_patient_profile_nom024.sql
```

6. Aplicar migración de codigo de comunidad por doctor:
```bash
mysql -u root -p psybioneer < migrations/2026-04-11_phase3_doctor_community_code.sql
```

7. Aplicar migración de preguntas por instrumento (sin limite de rangos fijos):
```bash
mysql -u root -p psybioneer < migrations/2026-04-11_phase4_question_instrument_code.sql
```

8. Si las preguntas historicas quedaron en un solo instrumento, aplicar hotfix de recuperacion:
```bash
mysql -u root -p psybioneer < migrations/2026-04-11_phase4_hotfix_recover_instrument_split.sql
```

## Iniciar el servidor

```bash
npm run dev
```

El servidor correrá en `http://localhost:5000`

## Endpoints API

### Autenticación
- `POST /api/auth/register` - Registrar paciente
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere token)

### Usuarios (Solo doctores)
- `GET /api/users/patients` - Listar pacientes
- `POST /api/users/doctors` - Crear nuevo doctor
- `GET /api/users/doctors` - Listar doctores

### Preguntas
- `GET /api/questions` - Listar preguntas (autenticado)
- `POST /api/questions` - Crear pregunta (solo doctor)
- `PUT /api/questions/:id` - Actualizar pregunta (solo doctor)
- `DELETE /api/questions/:id` - Eliminar pregunta (solo doctor)

### Tests
- `POST /api/tests/sessions` - Crear sesión de test
- `POST /api/tests/responses` - Guardar respuesta
- `POST /api/tests/complete` - Completar test
- `GET /api/tests/sessions/my` - Mis sesiones (paciente)
- `GET /api/tests/sessions/all` - Todas las sesiones (doctor)
- `GET /api/tests/sessions/:session_id` - Detalles de sesión
- `POST /api/tests/feedback` - Agregar retroalimentación (doctor)

## Autenticación

Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

## Roles

- `patient` - Paciente (puede hacer tests, ver su historial y retroalimentación)
- `doctor` - Doctor (puede ver todos los pacientes, resultados, crear doctores, dar feedback)
