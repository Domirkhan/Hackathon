import Vacancy from '../model/Vacancy.js';
import User from '../model/User.js';
import Application from '../model/Application.js';

// Создание новой вакансии
export const createVacancy = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Только работодатели могут создавать вакансии' 
      });
    }

    const vacancy = await Vacancy.create({
      ...req.body,
      employer: req.user.id
    });

    res.status(201).json({
      success: true,
      data: vacancy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании вакансии',
      error: error.message
    });
  }
};

// Получение всех вакансий с фильтрацией
export const getVacancies = async (req, res) => {
  try {
    const { profession, status, salary, sort = '-createdAt' } = req.query;
    const queryObject = {};

    // Фильтрация
    if (profession) {
      queryObject.profession = new RegExp(profession, 'i');
    }
    if (status) {
      queryObject.status = status;
    }
    if (salary) {
      queryObject['salary.from'] = { $lte: Number(salary) };
      queryObject['salary.to'] = { $gte: Number(salary) };
    }

    const vacancies = await Vacancy.find(queryObject)
      .populate('employer', 'nickname')
      .sort(sort)
      .lean();

    res.json({
      success: true,
      count: vacancies.length,
      data: vacancies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении вакансий',
      error: error.message
    });
  }
};

// Получение рекомендованных вакансий для студента
export const getRecommendedVacancies = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const vacancies = await Vacancy.find({
      profession: new RegExp(user.profession, 'i'),
      status: 'active'
    })
    .populate('employer', 'nickname')
    .sort('-createdAt')
    .limit(10)
    .lean();

    res.json({
      success: true,
      count: vacancies.length,
      data: vacancies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении рекомендаций',
      error: error.message
    });
  }
};

// Получение одной вакансии
export const getVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id)
      .populate('employer', 'nickname email')
      .lean();

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Вакансия не найдена'
      });
    }

    res.json({
      success: true,
      data: vacancy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении вакансии',
      error: error.message
    });
  }
};

// Обновление вакансии
export const updateVacancy = async (req, res) => {
  try {
    let vacancy = await Vacancy.findById(req.params.id);

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Вакансия не найдена'
      });
    }

    // Проверка прав на редактирование
    if (vacancy.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Нет прав на редактирование этой вакансии'
      });
    }

    vacancy = await Vacancy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: vacancy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении вакансии',
      error: error.message
    });
  }
};

// Удаление вакансии
export const deleteVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Вакансия не найдена'
      });
    }

    if (vacancy.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Нет прав на удаление этой вакансии'
      });
    }

    // Удаляем все связанные отклики
    await Application.deleteMany({ vacancy: req.params.id });
    await vacancy.deleteOne();

    res.json({
      success: true,
      message: 'Вакансия успешно удалена'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении вакансии',
      error: error.message
    });
  }
};