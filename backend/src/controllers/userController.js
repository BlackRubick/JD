import bcrypt from 'bcryptjs';
import { userModel } from '../models/userModel.js';
import { testModel } from '../models/testModel.js';

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

  async getPatientProfile(req, res) {
    try {
      const patientId = req.params.patient_id;
      const profile = await userModel.getPatientProfile(patientId);

      if (!profile) {
        return res.status(404).json({ error: 'Paciente no encontrado' });
      }

      const [tests, statuses] = await Promise.all([
        testModel.getSessionsByPatient(patientId),
        testModel.getPatientInstrumentStatuses(patientId),
      ]);

      res.json({
        patient: profile,
        evaluation_statuses: statuses,
        tests,
      });
    } catch (error) {
      console.error('Error al obtener perfil del paciente:', error);
      res.status(500).json({ error: 'Error al obtener perfil del paciente' });
    }
  },

  async updatePatientClinicalRecord(req, res) {
    try {
      const patientId = req.params.patient_id;
      await userModel.upsertClinicalRecord(patientId, req.body || {});
      const profile = await userModel.getPatientProfile(patientId);
      res.json({
        message: 'Expediente clinico actualizado',
        patient: profile,
      });
    } catch (error) {
      console.error('Error al actualizar expediente clinico:', error);
      res.status(500).json({ error: 'Error al actualizar expediente clinico' });
    }
  },

  async updatePatientStatus(req, res) {
    try {
      const patientId = req.params.patient_id;
      const { status, reason } = req.body;
      const allowed = ['active', 'inactive', 'discharged'];

      if (!allowed.includes(status)) {
        return res.status(400).json({ error: 'status invalido' });
      }

      await userModel.updatePatientStatus(patientId, status, reason, req.user.id);
      const profile = await userModel.getPatientProfile(patientId);
      res.json({
        message: 'Estatus del paciente actualizado',
        patient: profile,
      });
    } catch (error) {
      console.error('Error al actualizar estatus del paciente:', error);
      res.status(500).json({ error: 'Error al actualizar estatus del paciente' });
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
