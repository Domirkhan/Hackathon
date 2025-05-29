import Internship from '../model/Internship.js';

export const createInternship = async (req, res) => {
  try {
    const internship = await Internship.create({
      ...req.body,
      employer: req.user.id
    });

    res.status(201).json({
      success: true,
      data: internship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании стажировки',
      error: error.message
    });
  }
};

export const getEmployerInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ employer: req.user.id })
      .sort('-createdAt');

    res.json({
      success: true,
      count: internships.length,
      data: internships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении стажировок',
      error: error.message
    });
  }
};

export const updateInternship = async (req, res) => {
  try {
    let internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Стажировка не найдена'
      });
    }

    if (internship.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Нет прав на редактирование'
      });
    }

    internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: internship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении стажировки',
      error: error.message
    });
  }
};

export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Стажировка не найдена'
      });
    }

    if (internship.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Нет прав на удаление'
      });
    }

    await internship.deleteOne();

    res.json({
      success: true,
      message: 'Стажировка успешно удалена'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении стажировки',
      error: error.message
    });
  }
};