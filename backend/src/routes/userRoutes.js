import express from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware, doctorOnly } from '../middleware/auth.js';

const router = express.Router();


// Paciente elimina su propia cuenta
router.delete('/me', authMiddleware, userController.deleteOwnAccount);

router.get('/patients', authMiddleware, doctorOnly, userController.getAllPatients);
router.post('/doctors', authMiddleware, doctorOnly, userController.createDoctor);
router.get('/doctors', authMiddleware, doctorOnly, userController.getAllDoctors);

export default router;
