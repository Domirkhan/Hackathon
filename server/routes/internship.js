import express from 'express';
import {
  createInternship,
  getEmployerInternships,
  updateInternship,
  deleteInternship
} from '../controllers/internshipController.js';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';

const router = express.Router();

router.use(auth);
router.use(roleCheck(['employer']));

router.route('/')
  .get(getEmployerInternships)
  .post(createInternship);

router.route('/:id')
  .put(updateInternship)
  .delete(deleteInternship);

export default router;