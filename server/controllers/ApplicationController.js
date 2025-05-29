import Application from '../model/Application.js';
import Vacancy from '../model/Vacancy.js';
import User from '../model/User.js';

// Создание отклика на вакансию
export const createApplication = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Только студенты могут откликаться на вакансии'
      });
    }

    const vacancy = await Vacancy.findById(req.params.vacancyId);
    if (!vacancy || vacancy.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Вакансия не найдена или неактивна'
      });
    }

    // Проверка на повторный отклик
    const existingApplication = await Application.findOne({
      student: req.user.id,
      vacancy: req.params.vacancyId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Вы уже откликнулись на эту вакансию'
      });
    }

    const student = await User.findById(req.user.id);
    if (!student.resume) {
      return res.status(400).json({
        success: false,
        message: 'Для отклика необходимо загрузить резюме'
      });
    }

    const application = await Application.create({
      student: req.user.id,
      vacancy: req.params.vacancyId,
      resume: student.resume,
      coverLetter: req.body.coverLetter
    });

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании отклика',
      error: error.message
    });
  }
};

// Получение откликов для работодателя
export const getEmployerApplications = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
    }

    const applications = await Application.find({
      vacancy: { $in: await Vacancy.find({ employer: req.user.id }).select('_id') }
    })
    .populate('student', 'nickname profession')
    .populate('vacancy', 'title')
    .sort('-createdAt')
    .lean();

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении откликов',
      error: error.message
    });
  }
};

// Получение откликов студента
export const getStudentApplications = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
    }

    const applications = await Application.find({ student: req.user.id })
      .populate('vacancy', 'title company salary status')
      .sort('-createdAt')
      .lean();

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении ваших откликов',
      error: error.message
    });
  }
};

// Обновление статуса отклика работодателем
export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Отклик не найден'
      });
    }

    const vacancy = await Vacancy.findById(application.vacancy);
    if (vacancy.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Нет прав на изменение статуса'
      });
    }

    application.status = req.body.status;
    application.employerViewed = true;
    await application.save();

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении статуса',
      error: error.message
    });
  }
};

// Отзыв отклика студентом
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Отклик не найден'
      });
    }

    if (application.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Нет прав на отзыв этого отклика'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Можно отозвать только отклики в статусе ожидания'
      });
    }

    await application.deleteOne();

    res.json({
      success: true,
      message: 'Отклик успешно отозван'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при отзыве отклика',
      error: error.message
    });
  }
};