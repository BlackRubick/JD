# 🚀 Guía de Instalación - Psybioneer Backend

## 📋 Requisitos Previos

1. **Node.js** (v16 o superior)
2. **MySQL** (8.0 o superior)
3. **npm** o **yarn**

## 🔧 Instalación Paso a Paso

### 1. Instalar MySQL (si no lo tienes)

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Configurar MySQL

Iniciar sesión en MySQL:
```bash
mysql -u root -p
```

### 4. Crear la base de datos y tablas

Desde la terminal (fuera de MySQL):
```bash
mysql -u root -p < database.sql
```

O desde dentro de MySQL:
```sql
source /ruta/completa/al/archivo/database.sql
```

### 5. Generar hashes de contraseñas

```bash
node generateHashes.js
```

Copia los hashes generados y actualiza el archivo `database.sql` en las líneas de INSERT de usuarios.

### 6. Configurar variables de entorno

El archivo `.env` ya está creado. Verifica que tenga:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=psybioneer
JWT_SECRET=psybioneer_secret_key_2026_change_in_production
```

**IMPORTANTE:** Cambia `DB_PASSWORD` con tu contraseña de MySQL.

### 7. Iniciar el servidor

```bash
npm run dev
```

Deberías ver:
```
✅ Servidor corriendo en http://localhost:5000
```

### 8. Probar la API

Abre tu navegador o Postman y visita:
```
http://localhost:5000
```

Deberías ver:
```json
{"message": "Psybioneer API está corriendo"}
```

## 🧪 Probar el Login

### Con curl:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@psybioneer.com","password":"doctor123"}'
```

### Respuesta esperada:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Doctor Admin",
    "email": "doctor@psybioneer.com",
    "role": "doctor"
  }
}
```

## 👥 Cuentas de Prueba

**Doctor:**
- Email: `doctor@psybioneer.com`
- Password: `doctor123`

**Paciente:**
- Email: `prueba@hotmail.com`
- Password: `prueba123`

## 🐛 Solución de Problemas

### Error de conexión a MySQL
```bash
sudo systemctl start mysql     # Linux
brew services start mysql      # macOS
```

### Error "Access denied"
Verifica tu contraseña de MySQL en el archivo `.env`

### Puerto 5000 ocupado
Cambia el PORT en `.env` a otro número (ej: 5001)

### Base de datos no existe
```bash
mysql -u root -p -e "CREATE DATABASE psybioneer;"
mysql -u root -p psybioneer < database.sql
```

## 📚 Endpoints Disponibles

### Autenticación
- POST `/api/auth/register` - Registrar paciente
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Perfil del usuario

### Usuarios (Solo Doctor)
- GET `/api/users/patients` - Ver todos los pacientes
- POST `/api/users/doctors` - Crear nuevo doctor
- GET `/api/users/doctors` - Ver todos los doctores

### Preguntas
- GET `/api/questions` - Listar preguntas
- POST `/api/questions` - Crear pregunta (solo doctor)
- PUT `/api/questions/:id` - Actualizar (solo doctor)
- DELETE `/api/questions/:id` - Eliminar (solo doctor)

### Tests
- POST `/api/tests/sessions` - Crear sesión
- POST `/api/tests/responses` - Guardar respuesta
- POST `/api/tests/complete` - Completar test
- GET `/api/tests/sessions/my` - Mis tests (paciente)
- GET `/api/tests/sessions/all` - Todos los tests (doctor)
- GET `/api/tests/sessions/:id` - Detalles de test
- POST `/api/tests/feedback` - Dar feedback (doctor)

## ✅ Siguiente Paso

Una vez que el backend esté corriendo, el frontend necesita ser actualizado para usar la API en lugar de localStorage. 

Los cambios principales serán en:
- LoginPage.jsx
- RegisterPage.jsx
- TestPage.jsx
- QuestionAdminPage.jsx
- DashboardPage.jsx
