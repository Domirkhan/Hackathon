import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employerAPI } from '../../../services/api';
import '../../../styles/dashboard/Dashboard.css';

const EmployerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      vacanciesCount: 0,
      activeVacancies: 0,
      totalApplications: 0,
      totalInternships: 0
    },
    recentApplications: [],
    employer: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await employerAPI.getDashboardStats();
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.message || 'Ошибка при получении данных');
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setError(error.message || 'Произошла ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Обновление данных каждые 5 минут
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  

  const { stats, recentApplications, employer } = dashboardData;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          {employer && (
            <div className="employer-info">
              {employer.logo && (
                <img 
                  src={employer.logo} 
                  alt={`${employer.company} logo`} 
                  className="company-logo"
                />
              )}
              <div>
                <h1 className="dashboard-title">Панель управления</h1>
                <p className="dashboard-subtitle">{employer.company}</p>
              </div>
            </div>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-title">Вакансии</h3>
            <p className="stat-value">{stats.vacanciesCount}</p>
            <p className="stat-subtitle">Активных: {stats.activeVacancies}</p>
            <Link to="/admin/jobs" className="stat-link">
              Управление вакансиями →
            </Link>
          </div>

          <div className="stat-card">
            <h3 className="stat-title">Отклики</h3>
            <p className="stat-value">{stats.totalApplications}</p>
            <Link to="/admin/applications" className="stat-link">
              Просмотреть отклики →
            </Link>
          </div>

          <div className="stat-card">
            <h3 className="stat-title">Стажировки</h3>
            <p className="stat-value">{stats.totalInternships}</p>
            <Link to="/admin/internships" className="stat-link">
              Управление стажировками →
            </Link>
          </div>
        </div>

        <div className="content-section">
          <h2 className="section-title">Последние отклики</h2>
          <div className="applications-list">
            {recentApplications && recentApplications.length > 0 ? (
              recentApplications.map(application => (
                <div key={application._id} className="application-item">
                  <div className="application-header">
                    <div className="application-title">
                      <h3>{application.vacancy?.title}</h3>
                      <span className="company-name">{application.vacancy?.company}</span>
                    </div>
                    <span className={`status ${application.status}`}>
                      {application.status === 'pending' ? 'На рассмотрении' :
                       application.status === 'accepted' ? 'Принято' : 'Отклонено'}
                    </span>
                  </div>

                  <div className="application-body">
                    <div className="applicant-info">
                      {application.student?.avatar && (
                        <img 
                          src={application.student.avatar}
                          alt={application.student.nickname}
                          className="applicant-avatar"
                        />
                      )}
                      <div>
                        <p className="applicant-name">{application.student?.nickname}</p>
                        <p className="applicant-profession">{application.student?.profession}</p>
                      </div>
                    </div>
                    <div className="application-date">
                      Получено: {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {application.status === 'pending' && (
                    <div className="application-actions">
                      <Link 
                        to={`/admin/applications/${application._id}`}
                        className="view-application-btn"
                      >
                        Просмотреть отклик →
                      </Link>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Пока нет новых откликов</p>
                <span className="empty-state-subtitle">
                  Когда появятся новые отклики, они будут отображаться здесь
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;