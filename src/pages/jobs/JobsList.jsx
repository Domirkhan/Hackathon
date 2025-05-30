import React, { useState, useEffect } from 'react';
import { vacancyAPI } from '../../services/api';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaSearch } from 'react-icons/fa';
import '../../styles/jobs/JobsList.css';

const employmentTypes = [
    { value: '', label: 'Все типы' },
    { value: 'full', label: 'Полная занятость' },
    { value: 'part', label: 'Частичная занятость' },
    { value: 'remote', label: 'Удалённая работа' },
    { value: 'project', label: 'Проектная работа' },
    { value: 'internship', label: 'Стажировка' }
];

const cities = [
    'Алматы',
    'Астана',
    'Шымкент',
    'Караганда',
    'Актобе',
    'Тараз',
    'Павлодар',
    'Усть-Каменогорск',
    'Семей',
    'Атырау',
    'Костанай',
    'Кызылорда',
    'Уральск',
    'Петропавловск',
    'Актау',
    'Темиртау',
    'Кокшетау',
    'Талдыкорган',
    'Экибастуз',
    'Туркестан'
];

const JobsList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [vacancies, setVacancies] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        salary: '',
        employmentType: ''
    });
    const [loading, setLoading] = useState(true);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const initialFilters = {
            search: searchParams.get('search') || '',
            location: searchParams.get('location') || '',
            salary: searchParams.get('salary') || '',
            employmentType: searchParams.get('employmentType') || ''
        };
        setFilters(initialFilters);
        fetchVacancies(initialFilters);

        // Закрываем выпадающий список при клике вне него
        const handleClickOutside = (event) => {
            if (!event.target.closest('.location-input-container')) {
                setShowLocationSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchParams]);
const fetchVacancies = async (params = {}) => {
    setLoading(true);
    try {
        const response = await vacancyAPI.getAll(params);
        if (response.success) {
            // Убедимся, что vacancies всегда будет массивом
            const vacanciesData = Array.isArray(response.data.data) ? response.data.data : [];
            setVacancies(vacanciesData);
        } else {
            console.error('Ошибка при получении вакансий:', response.error);
            setVacancies([]);
        }
    } catch (error) {
        console.error('Ошибка при загрузке вакансий:', error);
        setVacancies([]);
    } finally {
        setLoading(false);
    }
};

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        updateSearchParams(newFilters);
    };

    const updateSearchParams = (newFilters) => {
        const params = {};
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params[key] = value;
        });
        setSearchParams(params);
    };

    const handleLocationInput = (e) => {
        const value = e.target.value;
        handleFilterChange(e);

        if (value.trim()) {
            const filtered = cities.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            );
            setLocationSuggestions(filtered);
            setShowLocationSuggestions(true);
        } else {
            setLocationSuggestions([]);
            setShowLocationSuggestions(false);
        }
    };

    const handleLocationSelect = (city) => {
        setFilters(prev => {
            const newFilters = { ...prev, location: city };
            updateSearchParams(newFilters);
            return newFilters;
        });
        setShowLocationSuggestions(false);
    };
        const handleViewDetails = (vacancyId) => {
        navigate(`/jobs/${vacancyId}`);
    };


    return (
        <div className="jobs-list-page">
            <div className="jobs-header">
                <h1 className="jobs-list-title">Поиск вакансий</h1>
                <p className="jobs-list-subtitle">Найдите работу своей мечты</p>
            </div>

            <form className="jobs-filter-form" onSubmit={(e) => e.preventDefault()}>
                <div className="search-input-container">
                    <FaSearch className="input-icon" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Поиск по названию, профессии или описанию"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>


                <div className="salary-input-container">
                    <FaMoneyBillWave className="input-icon" />
                    <input
                        type="number"
                        name="salary"
                        placeholder="Зарплата от"
                        value={filters.salary}
                        onChange={handleFilterChange}
                    />
                </div>


            </form>

            <div className="jobs-cards-list">
                {loading ? (
                    <div className="loading">
                        <div className="loader"></div>
                        <p>Загрузка вакансий...</p>
                    </div>
                ) : vacancies.length === 0 ? (
                    <div className="empty-state">
                        <FaBriefcase className="empty-icon" />
                        <p>Вакансии не найдены</p>
                        <p className="empty-subtitle">Попробуйте изменить параметры поиска</p>
                    </div>
                ) : (
                    vacancies.map((vacancy) => (
                        <div className="job-card" key={vacancy._id}>
                            <div className="job-card-header">
                                <h2 className="job-title">{vacancy.title}</h2>
                                <span className={`job-type-badge ${vacancy.employmentType}`}>
                                    {employmentTypes.find(t => t.value === vacancy.employmentType)?.label}
                                </span>
                            </div>
                            <div className="job-info">
                                <span className="job-salary">
                                    {vacancy.salary?.from} - {vacancy.salary?.to} {vacancy.salary?.currency}
                                </span>
                            </div>
                            <p className="job-description">
                                {vacancy.description?.slice(0, 150)}...
                            </p>
                            <button 
                                onClick={() => handleViewDetails(vacancy._id)} 
                                className="job-details-btn"
                            >
                                Подробнее
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobsList;