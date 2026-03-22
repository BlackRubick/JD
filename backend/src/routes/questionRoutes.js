import express from 'express';
import { questionController } from '../controllers/questionController.js';
import { authMiddleware, doctorOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, questionController.getAll);
router.post('/', authMiddleware, doctorOnly, questionController.create);
router.put('/:id', authMiddleware, doctorOnly, questionController.update);
router.delete('/:id', authMiddleware, doctorOnly, questionController.delete);

export default router;
