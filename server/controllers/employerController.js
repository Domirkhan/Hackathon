import User from '../model/User.js';
import Vacancy from '../model/Vacancy.js';
import Application from '../model/Application.js';
import Internship from '../model/Internship.js';

export const getDashboardStats = async (req, res) => {
  try {
    const employerId = req.user.id;
    const [activeVacancies, totalApplications, totalInternships] = await Promise.all([
      Vacancy.countDocuments({ employer: employerId, status: 'active' }),
      Application.countDocuments({
        vacancy: { $in: await Vacancy.find({ employer: employerId }).select('_id') }
      }),
      Internship.countDocuments({ employer: employerId })
    ]);

    res.json({
      success: true,
      data: {
        activeVacancies,
        totalApplications,
        totalInternships
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении статистики',
      error: error.message
    });
  }
};

export const getRecentApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      vacancy: { $in: await Vacancy.find({ employer: req.user.id }).select('_id') }
    })
    .populate('student', 'nickname profession')
    .populate('vacancy', 'title')
    .sort('-createdAt')
    .limit(5)
    .lean();

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении последних откликов',
      error: error.message
    });
  }
};

export const updateApplicationView = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const employerId = req.user.id;

    const application = await Application.findOneAndUpdate(
      {
        _id: applicationId,
        vacancy: {
          $in: await Vacancy.find({ employer: employerId }).select('_id')
        }
      },
      { employerViewed: true },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        message: 'Отклик не найден или нет прав для просмотра'
      });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ 
      message: 'Ошибка при обновлении статуса просмотра',
      error: error.message 
    });
  }
};