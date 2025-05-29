import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI, vacancyAPI } from '../../services/api';
import '../../styles/dashboard/Dashboard.css';
import { FaGraduationCap, FaBriefcase, FaRegBookmark, FaCalendarAlt } from 'react-icons/fa';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      appliedJobs: 0,
      savedJobs: 0,
      interviews: 0,
      completedCourses: 0
    },
    applications: [],
    recommendedVacancies: [],
    courses: [],
    student: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, applications, recommendedVacancies] = await Promise.all([
        studentAPI.getStats(),
        studentAPI.getApplications(),
        vacancyAPI.getRecommendedVacancies()
      ]);

      setDashboardData({
        stats: stats.data,
        applications: applications.data,
        recommendedVacancies: recommendedVacancies.data,
        student: stats.data.student
      });
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setError(error.message || 'Произошла ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Обновление каждые 5 минут
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

 

  const { stats, applications, recommendedVacancies, student } = dashboardData;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          {student && (
            <div className="student-info">
              {student.avatar && (
                <img 
                  src={student.avatar} 
                  alt={student.nickname} 
                  className="student-avatar"
                />
              )}
              <div>
                <h1 className="dashboard-title">Добро пожаловать, {student.nickname}!</h1>
                <p className="dashboard-subtitle">{student.profession || 'Укажите вашу специализацию'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBriefcase />
            </div>
            <h3 className="stat-title">Отправленные заявки</h3>
            <p className="stat-value">{stats.appliedJobs}</p>
            <Link to="/applications" className="stat-link">
              Просмотреть заявки →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaRegBookmark />
            </div>
            <h3 className="stat-title">Сохраненные вакансии</h3>
            <p className="stat-value">{stats.savedJobs}</p>
            <Link to="/saved-jobs" className="stat-link">
              Перейти к сохраненным →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <h3 className="stat-title">Собеседования</h3>
            <p className="stat-value">{stats.interviews}</p>
            <Link to="/interviews" className="stat-link">
              Расписание →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaGraduationCap />
            </div>
            <h3 className="stat-title">Пройденные курсы</h3>
            <p className="stat-value">{stats.completedCourses}</p>
            <Link to="/courses" className="stat-link">
              Все курсы →
            </Link>
          </div>
        </div>

        <div className="content-section">
          <h2 className="section-title">Рекомендуемые вакансии</h2>
          <div className="vacancies-grid">
            {recommendedVacancies.map(vacancy => (
              <div key={vacancy._id} className="vacancy-card">
                <div className="vacancy-header">
                  <h3>{vacancy.title}</h3>
                  <span className="company-name">{vacancy.company}</span>
                </div>
                <div className="vacancy-details">
                  <p className="salary">
                    {vacancy.salary.from} - {vacancy.salary.to} ₸
                  </p>
                  <p className="location">{vacancy.location}</p>
                </div>
                <div className="vacancy-footer">
                  <Link 
                    to={`/vacancies/${vacancy._id}`} 
                    className="view-vacancy-btn"
                  >
                    Подробнее →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h2 className="section-title">Последние отклики</h2>
          <div className="applications-list">
            {applications.length > 0 ? (
              applications.map(application => (
                <div key={application._id} className="application-item">
                  <div className="application-header">
                    <div className="application-title">
                      <h3>{application.vacancy.title}</h3>
                      <span className="company-name">{application.vacancy.company}</span>
                    </div>
                    <span className={`status ${application.status}`}>
                      {application.status === 'pending' ? 'На рассмотрении' :
                       application.status === 'accepted' ? 'Принято' : 'Отклонено'}
                    </span>
                  </div>
                  <div className="application-date">
                    Отправлено: {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>У вас пока нет откликов</p>
                <span className="empty-state-subtitle">
                  Найдите подходящую вакансию и отправьте отклик
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;