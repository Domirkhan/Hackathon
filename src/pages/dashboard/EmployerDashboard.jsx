import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';


const EmployerDashboard = () => {
  const [stats, setStats] = useState({
    totalVacancies: 0,
    activeVacancies: 0,
    totalApplications: 0,
    newApplications: 0,
    totalInternships: 0
  });
  
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [vacanciesRes, applicationsRes, internshipsRes] = await Promise.all([
        api.get('/vacancies/employer'),
        api.get('/vacancies/employer/applications'),
        api.get('/internships/employer')
      ]);

      setStats({
        totalVacancies: vacanciesRes.data.count,
        activeVacancies: vacanciesRes.data.data.filter(v => v.status === 'active').length,
        totalApplications: applicationsRes.data.count,
        newApplications: applicationsRes.data.data.filter(a => !a.employerViewed).length,
        totalInternships: internshipsRes.data.count
      });

      setRecentApplications(applicationsRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="employer-dashboard">
      <h1>Панель управления</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Активные вакансии</h3>
          <p className="stat-number">{stats.activeVacancies}</p>
          <Link to="/admin/jobs">Управлять вакансиями</Link>
        </div>

        <div className="stat-card">
          <h3>Новые отклики</h3>
          <p className="stat-number">{stats.newApplications}</p>
          <Link to="/admin/applications">Просмотреть отклики</Link>
        </div>

        <div className="stat-card">
          <h3>Стажировки</h3>
          <p className="stat-number">{stats.totalInternships}</p>
          <Link to="/admin/internships">Управлять стажировками</Link>
        </div>
      </div>

      <div className="recent-applications">
        <h2>Последние отклики</h2>
        <div className="applications-list">
          {recentApplications.map(app => (
            <div key={app._id} className="application-card">
              <div className="application-header">
                <h3>{app.vacancy.title}</h3>
                <span className={`status ${app.status}`}>{app.status}</span>
              </div>
              <p>Кандидат: {app.student.nickname}</p>
              <p>Дата: {new Date(app.createdAt).toLocaleDateString()}</p>
              <div className="application-actions">
                <button className="view-btn">Просмотреть</button>
                <button className="accept-btn">Принять</button>
                <button className="reject-btn">Отклонить</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;