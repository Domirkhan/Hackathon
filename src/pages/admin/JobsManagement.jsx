import React, { useState, useEffect } from 'react';
import { vacancyAPI } from '../../services/api';
import '../../styles/admin/JobsManagement.css';

const JobsManagement = () => {
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    profession: '',
    salary: { from: '', to: '', currency: 'RUB' },
    workSchedule: '',
    employmentType: '',
    description: '',
    requirements: [''],
    location: '',
    status: 'active'
  });

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const result = await vacancyAPI.getEmployerVacancies();
      if (!result.success) {
        throw new Error(result.message);
      }
      setVacancies(result.data);
    } catch (error) {
      setError(error.message || 'Ошибка при загрузке вакансий');
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (selectedVacancy) {
        await vacancyAPI.update(selectedVacancy._id, formData);
      } else {
        await vacancyAPI.create(formData);
      }
      fetchVacancies();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при сохранении вакансии');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту вакансию?')) {
      setLoading(true);
      try {
        await vacancyAPI.delete(id);
        fetchVacancies();
      } catch (error) {
        setError('Ошибка при удалении вакансии');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setSelectedVacancy(null);
    setFormData({
      title: '',
      profession: '',
      salary: { from: '', to: '', currency: 'RUB' },
      workSchedule: '',
      employmentType: '',
      description: '',
      requirements: [''],
      location: '',
      status: 'active'
    });
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  return (
    <div className="jobs-management">
      <div className="jobs-header">
        <h1>Управление вакансиями</h1>
        {!selectedVacancy && (
          <button className="add-job-btn" onClick={resetForm}>
            + Добавить вакансию
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="vacancy-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Название должности</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Профессия/Специализация</label>
            <input
              type="text"
              value={formData.profession}
              onChange={(e) => setFormData({...formData, profession: e.target.value})}
              required
            />
          </div>

          <div className="form-group salary-group">
            <label>Зарплата</label>
            <div className="salary-inputs">
              <input
                type="number"
                placeholder="От"
                value={formData.salary.from}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: {...formData.salary, from: e.target.value}
                })}
              />
              <input
                type="number"
                placeholder="До"
                value={formData.salary.to}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: {...formData.salary, to: e.target.value}
                })}
              />
              <select
                value={formData.salary.currency}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: {...formData.salary, currency: e.target.value}
                })}
              >
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>График работы</label>
            <select
              value={formData.workSchedule}
              onChange={(e) => setFormData({...formData, workSchedule: e.target.value})}
              required
            >
              <option value="">Выберите график</option>
              <option value="full-time">Полный день</option>
              <option value="part-time">Неполный день</option>
              <option value="flexible">Гибкий график</option>
              <option value="remote">Удаленная работа</option>
            </select>
          </div>

          <div className="form-group">
            <label>Тип занятости</label>
            <select
              value={formData.employmentType}
              onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
              required
            >
              <option value="">Выберите тип</option>
              <option value="full">Полная занятость</option>
              <option value="part">Частичная занятость</option>
              <option value="project">Проектная работа</option>
              <option value="internship">Стажировка</option>
            </select>
          </div>

          <div className="form-group">
            <label>Местоположение</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Описание вакансии</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            rows={5}
          />
        </div>

        <div className="form-group requirements-group">
          <label>Требования</label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="requirement-item">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                placeholder="Введите требование"
                required
              />
              {formData.requirements.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeRequirement(index)}
                  className="remove-btn"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addRequirement}
            className="add-requirement-btn"
          >
            + Добавить требование
          </button>
        </div>

        <div className="form-group">
          <label>Статус вакансии</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="active">Активная</option>
            <option value="closed">Закрытая</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Сохранение...' : (selectedVacancy ? 'Обновить' : 'Создать')}
          </button>
          {selectedVacancy && (
            <button type="button" onClick={resetForm} className="cancel-btn">
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="vacancies-list">
        {vacancies.map(vacancy => (
          <div key={vacancy._id} className="vacancy-card">
            <div className="vacancy-header">
              <h3>{vacancy.title}</h3>
              <span className={`status-badge ${vacancy.status}`}>
                {vacancy.status === 'active' ? 'Активная' : 'Закрытая'}
              </span>
            </div>
            <div className="vacancy-details">
              <p><strong>Профессия:</strong> {vacancy.profession}</p>
              <p><strong>Зарплата:</strong> {vacancy.salary.from} - {vacancy.salary.to} {vacancy.salary.currency}</p>
              <p><strong>Локация:</strong> {vacancy.location}</p>
            </div>
            <p className="vacancy-description">{vacancy.description}</p>
            <div className="vacancy-actions">
              <button 
                onClick={() => {
                  setSelectedVacancy(vacancy);
                  setFormData({...vacancy});
                }}
                className="edit-btn"
              >
                Редактировать
              </button>
              <button 
                onClick={() => handleDelete(vacancy._id)}
                className="delete-btn"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsManagement;