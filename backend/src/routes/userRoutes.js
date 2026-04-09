import express from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware, doctorOnly } from '../middleware/auth.js';

const router = express.Router();


// Paciente elimina su propia cuenta
router.delete('/me', authMiddleware, userController.deleteOwnAccount);

router.get('/patients', authMiddleware, doctorOnly, userController.getAllPatients);
router.get('/patients/:patient_id/profile', authMiddleware, doctorOnly, userController.getPatientProfile);
router.put('/patients/:patient_id/clinical-record', authMiddleware, doctorOnly, userController.updatePatientClinicalRecord);
router.patch('/patients/:patient_id/status', authMiddleware, doctorOnly, userController.updatePatientStatus);
router.delete('/patients/:patient_id', authMiddleware, doctorOnly, userController.deletePatient);
router.post('/doctors', authMiddleware, doctorOnly, userController.createDoctor);
router.get('/doctors', authMiddleware, doctorOnly, userController.getAllDoctors);

export default router;
