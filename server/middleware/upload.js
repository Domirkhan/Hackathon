import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создание директорий для загрузки файлов
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/avatars'),
    path.join(__dirname, '../uploads/resumes')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Конфигурация хранилища
const storage = {
  avatar: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads/avatars'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `avatar-${uniqueSuffix}${ext}`);
    }
  }),
  
  resume: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads/resumes'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `resume-${uniqueSuffix}${ext}`);
    }
  })
};

// Фильтры файлов
const fileFilter = {
  avatar: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Разрешены только изображения форматов JPEG, PNG и GIF'), false);
    }
    cb(null, true);
  },
  
  resume: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Разрешены только PDF файлы'), false);
    }
    cb(null, true);
  }
};

// Настройки лимитов
const limits = {
  avatar: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  resume: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
};

// Конфигурация мультера
const avatarUpload = multer({
  storage: storage.avatar,
  fileFilter: fileFilter.avatar,
  limits: limits.avatar
});

const resumeUpload = multer({
  storage: storage.resume,
  fileFilter: fileFilter.resume,
  limits: limits.resume
});

// Экспорт конфигураций загрузки
export const upload = {
  avatar: avatarUpload,
  resume: resumeUpload
};

// Middleware обработки ошибок загрузки
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'Размер файла превышает допустимый предел'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Неверное имя поля для файла'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Ошибка при загрузке файла',
          error: err.message
        });
    }
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

// Middleware валидации загрузки файла
export const validateFileUpload = (fileType) => (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: `Файл ${fileType} не был загружен. Проверьте, что отправляете файл с правильным именем поля`
    });
  }
  next();
};