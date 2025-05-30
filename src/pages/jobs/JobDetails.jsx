import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vacancyAPI } from '../../services/api';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaBuilding, FaClock, FaEnvelope, FaPhone } from 'react-icons/fa';
import ApplicationForm from './ApplicationForm';
import '../../styles/jobs/JobDetails.css';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vacancy, setVacancy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);

    useEffect(() => {
        const fetchVacancyDetails = async () => {
            try {
                setLoading(true);
                const response = await vacancyAPI.getById(id);
                
                if (response.success) {
                    setVacancy(response.data);
                } else {
                    setError('Не удалось загрузить информацию о вакансии');
                }
            } catch (err) {
                setError('Произошла ошибка при загрузке данных');
                console.error('Error fetching vacancy:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchVacancyDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Загрузка данных...</p>
            </div>
        );
    }

    if (error || !vacancy) {
        return (
            <div className="error-container">
                <p>{error || 'Вакансия не найдена'}</p>
                <button onClick={() => navigate('/jobs')} className="back-button">
                    Вернуться к списку вакансий
                </button>
            </div>
        );
    }

    return (
        <div className="job-details-container">
            <div className="job-details-content">
                <Link to="/jobs" className="back-link">
                    <FaBriefcase /> Назад к списку вакансий
                </Link>

                <div className="job-header">
                    <div className="job-header-main">
                        <h1>{vacancy.title}</h1>
                    </div>
                    <div className="job-header-side">
                        <div className="salary-info">
                            <FaMoneyBillWave />
                            <span>{vacancy.salary?.from} - {vacancy.salary?.to} {vacancy.salary?.currency}</span>
                        </div>
                        <div className="employment-type">
                            <FaBriefcase />
                            <span>{vacancy.employmentType}</span>
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

                        {vacancy.requirements?.length > 0 && (
                            <section className="job-section">
                                <h3>Требования</h3>
                                <ul className="requirements-list">
                                    {vacancy.requirements.map((req, index) => (
                                        <li key={index}>
                                            <span className="bullet">•</span>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
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
                            {vacancy.employer && (
                                <div className="contact-info">
                                    <h4>Контактная информация</h4>
                                    {vacancy.employer.email && (
                                        <p><FaEnvelope /> {vacancy.employer.email}</p>
                                    )}
                                    {vacancy.employer.phone && (
                                        <p><FaPhone /> {vacancy.employer.phone}</p>
                                    )}
                                </div>
                            )}
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
        </div>
    );
};

export default JobDetails;