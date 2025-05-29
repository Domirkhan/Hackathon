import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import '../../styles/dashboard/Dashboard.css';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    appliedJobs: 0,
    savedJobs: 0,
    interviews: 0,
    completedCourses: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/student/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Добро пожаловать!</h1>
          <p className="dashboard-subtitle">Ваша персональная панель управления</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-title">Отправленные заявки</h3>
            <p className="stat-value">{stats.appliedJobs}</p>
            <Link to="/applications" className="stat-link">
              Просмотреть заявки →
            </Link>
          </div>

          <div className="stat-card">
            <h3 className="stat-title">Сохраненные вакансии</h3>
            <p className="stat-value">{stats.savedJobs}</p>
            <Link to="/saved-jobs" className="stat-link">
              Перейти к сохраненным →
            </Link>
          </div>

          <div className="stat-card">
            <h3 className="stat-title">Предстоящие собеседования</h3>
            <p className="stat-value">{stats.interviews}</p>
            <Link to="/interviews" className="stat-link">
              Просмотреть расписание →
            </Link>
          </div>

          <div className="stat-card">
            <h3 className="stat-title">Пройденные курсы</h3>
            <p className="stat-value">{stats.completedCourses}</p>
            <Link to="/courses" className="stat-link">
              Все курсы →
            </Link>
          </div>
        </div>

        <div className="content-section">
          <h2 className="section-title">Рекомендуемые вакансии</h2>
          {/* Здесь будет компонент с рекомендуемыми вакансиями */}
        </div>

        <div className="content-section">
          <h2 className="section-title">Ваша активность</h2>
          {/* Здесь будет компонент с последней активностью */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;