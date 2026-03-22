# 🧠 Psybioneer - Plataforma de Evaluación de Salud Mental

Sistema completo de evaluación psicológica con backend Node.js + MySQL y frontend React.

## 🎯 Características Implementadas

### Para Pacientes
- ✅ Registro de cuenta
- ✅ Login con autenticación JWT
- ✅ Realizar tests de evaluación CES-D (20 preguntas)
- ✅ Ver historial de tests completados
- ✅ Recibir retroalimentación del doctor

### Para Doctores
- ✅ Login con cuenta de doctor
- ✅ Ver dashboard con estadísticas en tiempo real
- ✅ Ver lista de todos los pacientes
- ✅ Ver resultados completos de tests de cada paciente
- ✅ Ver qué respondió cada paciente en cada pregunta
- ✅ Dar retroalimentación personalizada a pacientes
- ✅ Crear/editar/eliminar preguntas del cuestionario
- ✅ Crear nuevos doctores

## 🚀 Instalación

### 1. Backend (Node.js + MySQL)

```bash
cd backend
npm install
```

Configurar MySQL:
```bash
mysql -u root -p < database.sql
```

Configurar `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=psybioneer
JWT_SECRET=psybioneer_secret_key_2026
```

Iniciar servidor:
```bash
npm run dev
```

### 2. Frontend (React)

```bash
cd jared
npm install
npm start
```

El frontend correrá en `http://localhost:3000`

## 👥 Cuentas de Prueba

### Doctor
- Email: `doctor@psybioneer.com`
- Password: `doctor123`

### Paciente
- Email: `prueba@hotmail.com`
- Password: `prueba123`

## 📋 Funcionalidades por Rol

### Paciente
1. **Registrarse**: Crear cuenta desde `/register`
2. **Iniciar test**: Ir a "Evaluación" para responder el cuestionario
3. **Ver historial**: En "Mis Tests" ver tests completados
4. **Ver feedback**: Cada test muestra la retroalimentación del doctor

### Doctor
1. **Dashboard**: Ver métricas generales (pacientes, tests, promedios)
2. **Pacientes**: Ver lista completa de pacientes registrados
3. **Resultados**: Click en un paciente para ver todos sus tests
4. **Detalles**: Ver respuestas individuales de cada pregunta
5. **Retroalimentación**: Escribir feedback personalizado para cada test
6. **Preguntas**: Crear/editar/eliminar preguntas del cuestionario
7. **Crear Doctor**: Agregar nuevos terapeutas al sistema

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar paciente
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil usuario

### Tests
- `POST /api/tests/sessions` - Crear sesión de test
- `POST /api/tests/responses` - Guardar respuesta
- `POST /api/tests/complete` - Completar test
- `GET /api/tests/sessions/my` - Mis tests (paciente)
- `GET /api/tests/sessions/all` - Todos los tests (doctor)
- `GET /api/tests/sessions/:id` - Detalles de test
- `POST /api/tests/feedback` - Agregar feedback (doctor)

### Usuarios (Solo Doctor)
- `GET /api/users/patients` - Listar pacientes
- `POST /api/users/doctors` - Crear doctor
- `GET /api/users/doctors` - Listar doctores

### Preguntas
- `GET /api/questions` - Listar preguntas
- `POST /api/questions` - Crear pregunta (doctor)
- `PUT /api/questions/:id` - Actualizar pregunta (doctor)
- `DELETE /api/questions/:id` - Eliminar pregunta (doctor)

## 🗄️ Base de Datos

### Tablas
- `users` - Pacientes y doctores
- `questions` - Preguntas del cuestionario
- `test_sessions` - Sesiones de tests
- `test_responses` - Respuestas individuales
- `feedback` - Retroalimentación de doctores

## 🎨 Navegación

### Paciente
- `/` - Inicio
- `/test` - Realizar evaluación
- `/my-tests` - Ver mi historial y feedback
- `/resources` - Recursos de salud mental

### Doctor
- `/dashboard` - Dashboard con estadísticas
- `/patients` - Gestión de pacientes
- `/patient/:id/tests` - Tests de un paciente específico
- `/admin/questions` - Administrar preguntas
- `/admin/create-doctor` - Crear nuevo doctor

## 🔐 Seguridad

- Autenticación JWT con tokens de 7 días
- Contraseñas hasheadas con bcrypt (10 rounds)
- Rutas protegidas por rol (patient/doctor)
- Validación de datos en frontend y backend

## 📊 Escala CES-D

El sistema usa la Escala de Depresión del Centro de Estudios Epidemiológicos (CES-D):
- 20 preguntas
- Opciones de respuesta: 0-3 puntos
- Puntaje total: 0-60
- Puntaje ≥ 16 sugiere seguimiento

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- MySQL
- JWT para autenticación
- bcryptjs para contraseñas
- CORS habilitado

### Frontend
- React 18
- React Router v6
- SweetAlert2 para notificaciones
- Fetch API para peticiones HTTP
- CSS-in-JS con variables

## 📝 Notas

- El backend debe estar corriendo en puerto 5000
- El frontend se conecta a `http://localhost:5000/api`
- Todos los datos se almacenan en MySQL
- Las sesiones se mantienen con JWT en localStorage
