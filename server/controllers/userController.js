import User from '../model/User.js';
import path from 'path';
import fs from 'fs/promises';
// Получение профиля пользователя
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Обновление профиля
export const updateProfile = async (req, res) => {
  try {
    const { nickname, profession } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false, 
        message: 'Пользователь не найден'
      });
    }

    user.nickname = nickname || user.nickname;
    user.profession = profession || user.profession;

    const updatedUser = await user.save();
    res.json({
      success: true,
      data: {
        id: updatedUser._id,
        nickname: updatedUser.nickname,
        profession: updatedUser.profession
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Загрузка резюме
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не загружен'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Только студенты могут загружать резюме'
      });
    }

    user.resume = `/uploads/resumes/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      data: {
        resume: user.resume
      },
      message: 'Резюме успешно загружено'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке резюме',
      error: error.message
    });
  }
};

// Получение списка студентов (для работодателей)
export const getStudents = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
    }

    const students = await User.find({ role: 'student' })
      .select('nickname profession')
      .sort('-createdAt');

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Получение профиля студента по ID (для работодателей)
export const getStudentProfile = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
    }

    const student = await User.findOne({ 
      _id: req.params.id, 
      role: 'student' 
    }).select('nickname profession resume');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Студент не найден'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не загружен'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Удаляем старый аватар если есть
    if (user.avatar) {
      const oldPath = path.join(process.cwd(), 'uploads', user.avatar.replace(/^\/uploads/, ''));
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        console.error('Ошибка при удалении старого аватара:', err);
      }
    }

    // Сохраняем путь к новому файлу
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке аватара'
    });
  }
};