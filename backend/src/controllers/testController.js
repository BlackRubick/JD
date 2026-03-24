import { testModel } from '../models/testModel.js';

export const testController = {
  async createSession(req, res) {
    try {
      const patient_id = req.user.role === 'patient' ? req.user.id : req.body.patient_id;
      const assigned_by = req.user.role === 'doctor' ? req.user.id : null;

      if (!patient_id) {
        return res.status(400).json({ error: 'patient_id es requerido para crear sesión' });
      }

      const inProgress = await testModel.getInProgressSessionByPatient(patient_id);
      if (inProgress) {
        return res.status(200).json({
          message: 'Sesión en progreso recuperada',
          session_id: inProgress.id,
          resumed: true
        });
      }

         const pendingFeedback = await testModel.getCompletedSessionWithoutFeedback(patient_id);
         if (pendingFeedback) {
           return res.status(409).json({
             error: 'Debes esperar la retroalimentación de tu último test antes de iniciar uno nuevo.'
           });
         }

      const sessionId = await testModel.createSession(patient_id, assigned_by);
      res.status(201).json({
        message: 'Sesión de test creada',
        session_id: sessionId,
        resumed: false
      });
    } catch (error) {
      console.error('Error al crear sesión:', error);
      res.status(500).json({ error: 'Error al crear sesión de test' });
    }
  },

  async saveResponse(req, res) {
    try {
      const { session_id, question_id, response_value } = req.body;

      const session = await testModel.getSessionById(session_id);
      if (!session) {
        return res.status(404).json({ error: 'Sesión no encontrada' });
      }

      if (req.user.role === 'patient' && session.patient_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para esta sesión' });
      }

      await testModel.saveResponse(session_id, question_id, response_value);
      res.json({ message: 'Respuesta guardada' });
    } catch (error) {
      console.error('Error al guardar respuesta:', error);
      res.status(500).json({ error: 'Error al guardar respuesta' });
    }
  },

  async completeSession(req, res) {
    try {
      const { session_id, total_score } = req.body;

      const session = await testModel.getSessionById(session_id);
      if (!session) {
        return res.status(404).json({ error: 'Sesión no encontrada' });
      }

      if (req.user.role === 'patient' && session.patient_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para esta sesión' });
      }

      await testModel.completeSession(session_id, total_score);
      res.json({ message: 'Test completado exitosamente' });
    } catch (error) {
      console.error('Error al completar test:', error);
      res.status(500).json({ error: 'Error al completar test' });
    }
  },

  async getPatientSessions(req, res) {
    try {
      const patient_id = req.user.role === 'patient' ? req.user.id : req.params.patient_id;
      const sessions = await testModel.getSessionsByPatient(patient_id);
      res.json(sessions);
    } catch (error) {
      console.error('Error al obtener sesiones:', error);
      res.status(500).json({ error: 'Error al obtener sesiones' });
    }
  },

  async getAllSessions(req, res) {
    try {
      const sessions = await testModel.getAllSessionsWithPatients();
      res.json(sessions);
    } catch (error) {
      console.error('Error al obtener todas las sesiones:', error);
      res.status(500).json({ error: 'Error al obtener sesiones' });
    }
  },

  async getSessionDetails(req, res) {
    try {
      const { session_id } = req.params;
      const session = await testModel.getSessionById(session_id);

      if (!session) {
        return res.status(404).json({ error: 'Sesión no encontrada' });
      }

      if (req.user.role === 'patient' && session.patient_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para ver esta sesión' });
      }

      const responses = await testModel.getSessionResponses(session_id);
      const feedback = await testModel.getFeedback(session_id);

         res.json({
           session,
           responses,
           feedback
         });
    } catch (error) {
      console.error('Error al obtener detalles:', error);
      res.status(500).json({ error: 'Error al obtener detalles de la sesión' });
    }
  },

  async addFeedback(req, res) {
    try {
      const { session_id, feedback_text } = req.body;

      const feedbackId = await testModel.addFeedback(
        session_id,
        req.user.id,
        feedback_text
      );

      res.status(201).json({
        message: 'Retroalimentación agregada exitosamente',
        feedback_id: feedbackId
      });
    } catch (error) {
      console.error('Error al agregar feedback:', error);
      res.status(500).json({ error: 'Error al agregar retroalimentación' });
    }
  }
};
