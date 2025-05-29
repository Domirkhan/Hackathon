import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vacancyAPI } from '../../services/api';
import ApplicationForm from './ApplicationForm';
import '../../styles/jobs/JobDetails.css';
import '../../styles/jobs/JobsList.css'
const JobDetails = () => {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const data = await vacancyAPI.getById(id);
        setVacancy(data);
      } catch (error) {
        console.error('Error fetching vacancy:', error);
      }
      setLoading(false);
    };
    fetchVacancy();
  }, [id]);

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (!vacancy) return <div className="error-container">Вакансия не найдена</div>;

  return (
    <div className="job-details-container">
      <Link to="/jobs" className="back-link">
        <i className="fas fa-arrow-left"></i> Назад к списку вакансий
      </Link>
      
      <div className="job-header">
        <div className="job-header-main">
          <h1>{vacancy.title}</h1>
          <div className="company-info">
            <img src={vacancy.employer?.logo || '/default-company-logo.png'} alt="company logo" />
            <div>
              <h2>{vacancy.employer?.nickname}</h2>
              <p className="location"><i className="fas fa-map-marker-alt"></i> {vacancy.location}</p>
            </div>
          </div>
        </div>
        <div className="job-header-side">
          <div className="salary-badge">
            {vacancy.salary?.from} - {vacancy.salary?.to} {vacancy.salary?.currency}
          </div>
          <div className="employment-badge">
            {vacancy.employmentType}
          </div>
        </div>
      </div>

      <div className="job-content">
        <div className="job-main">
          <section className="job-section">
            <h3>Описание вакансии</h3>
            <div className="section-content">
              {vacancy.description}
            </div>
          </section>

          <section className="job-section">
            <h3>Требования</h3>
            <div className="section-content requirements-list">
              {vacancy.requirements?.map((req, index) => (
                <div key={index} className="requirement-item">
                  <i className="fas fa-check"></i>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="job-section">
            <h3>Условия работы</h3>
            <div className="section-content conditions-list">
              <div className="condition-item">
                <i className="fas fa-clock"></i>
                <span>{vacancy.workSchedule}</span>
              </div>
              <div className="condition-item">
                <i className="fas fa-building"></i>
                <span>Офис в {vacancy.location}</span>
              </div>
              {/* Добавьте другие условия работы */}
            </div>
          </section>
        </div>

        <div className="job-sidebar">
          <div className="application-card">
            <h3>Заинтересовала вакансия?</h3>
            <button 
              className="apply-button"
              onClick={() => setShowApplicationForm(true)}
            >
              Откликнуться
            </button>
            <div className="contact-info">
              <h4>Контактная информация</h4>
              <p><i className="fas fa-envelope"></i> {vacancy.employer?.email}</p>
              <p><i className="fas fa-phone"></i> {vacancy.employer?.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {showApplicationForm && (
        <div className="modal-overlay">
          <ApplicationForm 
            vacancyId={id}
            onClose={() => setShowApplicationForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default JobDetails;
