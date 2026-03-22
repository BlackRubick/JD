import express from 'express';
import { testController } from '../controllers/testController.js';
import { authMiddleware, doctorOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/sessions', authMiddleware, testController.createSession);
router.post('/responses', authMiddleware, testController.saveResponse);
router.post('/complete', authMiddleware, testController.completeSession);
router.get('/sessions/my', authMiddleware, testController.getPatientSessions);
router.get('/sessions/all', authMiddleware, doctorOnly, testController.getAllSessions);
router.get('/sessions/:session_id', authMiddleware, testController.getSessionDetails);
router.post('/feedback', authMiddleware, doctorOnly, testController.addFeedback);
router.get('/sessions/patient/:patient_id', authMiddleware, doctorOnly, testController.getPatientSessions);

export default router;
