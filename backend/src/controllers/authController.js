import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel.js';

export const authController = {
  async register(req, res) {
    try {
      const { name, email, password, date_of_birth, sex, doctor_code } = req.body;

      if (!doctor_code) {
        return res.status(400).json({ error: 'Debes ingresar el codigo del especialista' });
      }

      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const doctor = await userModel.findDoctorByCode(doctor_code);
      if (!doctor) {
        return res.status(400).json({ error: 'Codigo de especialista invalido' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role: 'patient',
        date_of_birth: date_of_birth ?? null,
        sex: sex ?? null,
        linked_doctor_id: doctor.id,
        created_by: doctor.id,
      });

      const token = jwt.sign(
        { id: userId, email, role: 'patient' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: { id: userId, name, email, role: 'patient', linked_doctor_id: doctor.id }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  }
};
