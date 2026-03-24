import bcrypt from 'bcryptjs';
import { userModel } from '../models/userModel.js';

export const userController = {
  async getAllPatients(req, res) {
    try {
         const patients = await userModel.getAllPatients();
         res.json(patients);
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      res.status(500).json({ error: 'Error al obtener pacientes' });
    }
  },

  async createDoctor(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const doctorId = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role: 'doctor',
        created_by: req.user.id
      });

      res.status(201).json({
        message: 'Doctor creado exitosamente',
        doctor: { id: doctorId, name, email, role: 'doctor' }
      });
    } catch (error) {
      console.error('Error al crear doctor:', error);
      res.status(500).json({ error: 'Error al crear doctor' });
    }
  },

  async getAllDoctors(req, res) {
    try {
         const doctors = await userModel.getAllDoctors();
         res.json(doctors);
    } catch (error) {
      console.error('Error al obtener doctores:', error);
      res.status(500).json({ error: 'Error al obtener doctores' });
    }
  },

  // Soft delete: marca la cuenta como eliminada y guarda fecha de eliminación
  async deleteOwnAccount(req, res) {
    try {
      const userId = req.user.id;
      await userModel.softDelete(userId);
      res.json({ message: 'Cuenta marcada para eliminación. Puedes recuperarla en los próximos 60 días iniciando sesión.' });
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      res.status(500).json({ error: 'Error al eliminar cuenta' });
    }
  }
};
