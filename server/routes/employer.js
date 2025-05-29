import express from 'express';
import { 
  getDashboardStats,
  getRecentApplications,
  updateApplicationView
} from '../controllers/employerController.js';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';

const router = express.Router();

// Защита маршрутов
router.use(auth);
router.use(roleCheck(['employer']));

// Маршруты
router.get('/stats', getDashboardStats);
router.get('/applications', getRecentApplications);
router.put('/applications/:applicationId/view', updateApplicationView);

export default router;