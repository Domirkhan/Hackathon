import express from 'express';
import {
  createVacancy,
  getVacancies,
  getVacancy,
  updateVacancy,
  deleteVacancy,
  getRecommendedVacancies
} from '../controllers/vacancyController.js';
import {
  createApplication,
  getEmployerApplications,
  getStudentApplications,
  updateApplicationStatus,
  withdrawApplication
} from '../controllers/applicationController.js';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';

const router = express.Router();

// Публичные маршруты
router.get('/', getVacancies);
router.get('/:id', getVacancy);

// Защищенные маршруты
router.use(auth);

// Маршруты для работодателей
router.post('/', roleCheck(['employer']), createVacancy);
router.put('/:id', roleCheck(['employer']), updateVacancy);
router.delete('/:id', roleCheck(['employer']), deleteVacancy);
router.get('/employer/applications', roleCheck(['employer']), getEmployerApplications);
router.put('/applications/:id/status', roleCheck(['employer']), updateApplicationStatus);

// Маршруты для студентов
router.get('/recommended', roleCheck(['student']), getRecommendedVacancies);
router.post('/:vacancyId/apply', roleCheck(['student']), createApplication);
router.get('/student/applications', roleCheck(['student']), getStudentApplications);
router.delete('/applications/:id', roleCheck(['student']), withdrawApplication);

export default router;