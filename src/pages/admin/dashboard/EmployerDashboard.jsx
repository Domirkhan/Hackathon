import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employerAPI } from '../../../services/api';
import '../../../styles/dashboard/Dashboard.css';

const EmployerDashboard = () => {
  const [stats, setStats] = useState({
    activeVacancies: 0,
    totalApplications: 0,
    totalInternships: 0
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [statsData, applicationsData] = await Promise.all([
        employerAPI.getDashboardStats(),
        employerAPI.getRecentApplications()
      ]);

      setStats(statsData.data || stats);
      setApplications(applicationsData.data || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Панель управления</h1>
          <p className="dashboard-subtitle">Обзор вакансий и откликов</p>
        </div>

        
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-title">Активные вакансии</h3>
            <p className="stat-value">{stats?.activeVacancies || 0}</p>
            <Link to="/admin/jobs" className="stat-link">
              Управление вакансиями →
            </Link>
          </div>

          <div className="stat-card">
            <h3 className="stat-title">Новые отклики</h3>
            <p className="stat-value">{stats?.totalApplications || 0}</p>
            <Link to="/admin/applications" className="stat-link">
              Просмотреть отклики →
            </Link>
          </div>

          <div className="stat-card">
            <h3 className="stat-title">Стажировки</h3>
            <p className="stat-value">{stats?.totalInternships || 0}</p>
            <Link to="/admin/internships" className="stat-link">
              Управление стажировками →
            </Link>
          </div>
        </div>

        <div className="content-section">
          <h2 className="section-title">Последние отклики</h2>
          <div className="applications-list">
            {applications.length > 0 ? (
              applications.map(app => (
                <div key={app._id} className="application-item">
                  <div className="application-header">
                    <h3>{app.vacancy?.title}</h3>
                    <span className={`status ${app.status}`}>
                      {app.status === 'pending' ? 'На рассмотрении' :
                       app.status === 'accepted' ? 'Принято' : 'Отклонено'}
                    </span>
                  </div>
                  <p>Кандидат: {app.student?.nickname}</p>
                  <p>Дата: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Пока нет новых откликов</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;