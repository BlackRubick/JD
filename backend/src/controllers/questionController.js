import { questionModel } from '../models/questionModel.js';

export const questionController = {
  async getAll(req, res) {
    try {
         const questions = await questionModel.getAll();
         res.json(questions);
    } catch (error) {
      console.error('Error al obtener preguntas:', error);
      res.status(500).json({ error: 'Error al obtener preguntas' });
    }
  },

  async create(req, res) {
    try {
      const { text, position } = req.body;
      const questionId = await questionModel.create(text, position || 0, req.user.id);
      res.status(201).json({
        message: 'Pregunta creada exitosamente',
        question: { id: questionId, text, position }
      });
    } catch (error) {
      console.error('Error al crear pregunta:', error);
      res.status(500).json({ error: 'Error al crear pregunta' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { text, position } = req.body;
      await questionModel.update(id, text, position);
      res.json({ message: 'Pregunta actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar pregunta:', error);
      res.status(500).json({ error: 'Error al actualizar pregunta' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await questionModel.delete(id);
      res.json({ message: 'Pregunta eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar pregunta:', error);
      res.status(500).json({ error: 'Error al eliminar pregunta' });
    }
  }
};
