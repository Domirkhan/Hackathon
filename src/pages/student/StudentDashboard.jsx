import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../services/api';
import '../../styles/dashboard/StudentDashboard.css';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    recommendedVacancies: []
  });
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [applicationsRes, recommendedRes] = await Promise.all([
        axios.get('/vacancies/student/applications'),
        axios.get('/vacancies/recommended')
      ]);

      const apps = applicationsRes.data.data;
      setStats({
        totalApplications: apps.length,
        pendingApplications: apps.filter(a => a.status === 'pending').length,
        acceptedApplications: apps.filter(a => a.status === 'accepted').length,
        recommendedVacancies: recommendedRes.data.data
      });

      setApplications(apps.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="student-dashboard">
      <h1>Личный кабинет студента</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Активные отклики</h3>
          <p className="stat-number">{stats.pendingApplications}</p>
        </div>

        <div className="stat-card">
          <h3>Принятые заявки</h3>
          <p className="stat-number">{stats.acceptedApplications}</p>
        </div>

        <div className="stat-card">
          <h3>Всего откликов</h3>
          <p className="stat-number">{stats.totalApplications}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="applications-section">
          <h2>Ваши отклики</h2>
          <div className="applications-list">
            {applications.map(app => (
              <div key={app._id} className="application-card">
                <h3>{app.vacancy.title}</h3>
                <span className={`status ${app.status}`}>{app.status}</span>
                <p>Компания: {app.vacancy.employer.nickname}</p>
                <p>Дата отклика: {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="recommended-section">
          <h2>Рекомендуемые вакансии</h2>
          <div className="vacancies-list">
            {stats.recommendedVacancies.map(vacancy => (
              <div key={vacancy._id} className="vacancy-card">
                <h3>{vacancy.title}</h3>
                <p>{vacancy.description}</p>
                <p className="salary">
                  {vacancy.salary.from} - {vacancy.salary.to} {vacancy.salary.currency}
                </p>
                <Link to={`/vacancies/${vacancy._id}`} className="view-btn">
                  Подробнее
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;