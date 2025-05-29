import User from '../model/User.js';
import Vacancy from '../model/Vacancy.js';
import Application from '../model/Application.js';
import Internship from '../model/Internship.js';

// Получение статистики для дашборда работодателя


// Получение последних откликов
export const getDashboardStats = async (req, res) => {
  try {
    const employerId = req.user.id;
    
    if (!employerId) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован'
      });
    }

    // Получение всех данных параллельно
    const [
      vacanciesCount,
      activeVacancies,
      totalApplications,
      totalInternships,
      recentApplications,
      employerInfo
    ] = await Promise.all([
      // Общее количество вакансий
      Vacancy.countDocuments({ employer: employerId }),
      
      // Активные вакансии
      Vacancy.countDocuments({ 
        employer: employerId, 
        status: 'active' 
      }),
      
      // Все отклики
      Application.countDocuments({
        vacancy: { 
          $in: await Vacancy.find({ employer: employerId }).select('_id') 
        }
      }),
      
      // Стажировки
      Internship.countDocuments({ employer: employerId }),

      // Последние отклики
      Application.find({
        vacancy: { 
          $in: await Vacancy.find({ employer: employerId }).select('_id') 
        }
      })
      .populate('student', 'nickname profession avatar')
      .populate('vacancy', 'title company salary')
      .sort('-createdAt')
      .limit(5)
      .lean(),

      // Информация о работодателе
      User.findById(employerId).select('nickname company logo').lean()
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          vacanciesCount,
          activeVacancies,
          totalApplications,
          totalInternships
        },
        recentApplications,
        employer: employerInfo
      }
    });

  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении статистики',
      error: error.message
    });
  }
};

// Обновление статуса просмотра отклика
export const updateApplicationView = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const employerId = req.user.id;

    if (!applicationId || !employerId) {
      return res.status(400).json({
        success: false,
        message: 'Не указан ID отклика или работодателя'
      });
    }

    const application = await Application.findOneAndUpdate(
      {
        _id: applicationId,
        vacancy: {
          $in: await Vacancy.find({ employer: employerId }).select('_id')
        }
      },
      { 
        employerViewed: true,
        updatedAt: Date.now()
      },
      { 
        new: true,
        runValidators: true
      }
    )
    .populate('student', 'nickname profession')
    .populate('vacancy', 'title');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Отклик не найден или нет прав для просмотра'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Ошибка при обновлении статуса просмотра:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при обновлении статуса просмотра',
      error: error.message 
    });
  }
};

// Получение последних откликов
export const getRecentApplications = async (req, res) => {
  try {
    const employerId = req.user.id;
    
    if (!employerId) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован'
      });
    }

    const applications = await Application.find({
      vacancy: { 
        $in: await Vacancy.find({ employer: employerId }).select('_id') 
      }
    })
    .populate('student', 'nickname profession avatar')
    .populate('vacancy', 'title company salary')
    .sort('-createdAt')
    .limit(5)
    .lean();

    res.status(200).json({
      success: true,
      data: applications
    });
    
  } catch (error) {
    console.error('Ошибка при получении откликов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении откликов',
      error: error.message
    });
  }
};