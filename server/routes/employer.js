import express from 'express';
import { 
  getDashboardStats,
  getRecentApplications,
  updateApplicationView
} from '../controllers/employerController.js';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';

const router = express.Router();

router.use(auth);
router.use(roleCheck(['employer']));

// Dashboard маршруты
router.route('/stats').get(getDashboardStats);
router.route('/applications').get(getRecentApplications);
router.route('/applications/:applicationId/view').put(updateApplicationView);

export default router;