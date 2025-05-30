import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  uploadResume, 
    uploadAvatar,
  getStudents,
  getStudentProfile
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';
import { upload, handleUploadError, validateFileUpload } from '../middleware/upload.js';

const router = express.Router();

router.use(auth);

// Маршруты профиля
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/avatar', 
  upload.avatar.single('avatar'),
  handleUploadError,
  validateFileUpload('аватар'),
  uploadAvatar
);
// Маршруты для студентов
router.post('/resume', roleCheck(['student']), upload.resume.single('resume'), handleUploadError, validateFileUpload('резюме'), uploadResume);

// Маршруты для работодателей
router.get('/students', roleCheck(['employer']), getStudents);
router.get('/students/:id', roleCheck(['employer']), getStudentProfile);

export default router;