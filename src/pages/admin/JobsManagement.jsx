import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import '../../styles/admin/JobsManagement.css';

const JobsManagement = () => {
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    salary: { from: '', to: '', currency: 'RUB' },
    workSchedule: '',
    employmentType: '',
    description: '',
    requirements: [''],
    location: ''
  });

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const response = await axios.get('/vacancies/employer');
      setVacancies(response.data.data);
    } catch (error) {
      console.error('Ошибка при загрузке вакансий:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedVacancy) {
        await axios.put(`/vacancies/${selectedVacancy._id}`, formData);
      } else {
        await axios.post('/vacancies', formData);
      }
      fetchVacancies();
      resetForm();
    } catch (error) {
      console.error('Ошибка при сохранении вакансии:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту вакансию?')) {
      try {
        await axios.delete(`/vacancies/${id}`);
        fetchVacancies();
      } catch (error) {
        console.error('Ошибка при удалении вакансии:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedVacancy(null);
    setFormData({
      title: '',
      salary: { from: '', to: '', currency: 'RUB' },
      workSchedule: '',
      employmentType: '',
      description: '',
      requirements: [''],
      location: ''
    });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  return (
    <div className="jobs-management">
      <h1>Управление вакансиями</h1>
      
      <form onSubmit={handleSubmit} className="vacancy-form">
        <div className="form-group">
          <label>Название должности</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
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

        {/* Остальные поля формы */}

        <div className="form-actions">
          <button type="submit">
            {selectedVacancy ? 'Обновить' : 'Создать'} вакансию
          </button>
          {selectedVacancy && (
            <button type="button" onClick={resetForm}>
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="vacancies-list">
        {vacancies.map(vacancy => (
          <div key={vacancy._id} className="vacancy-card">
            <h3>{vacancy.title}</h3>
            <p>{vacancy.description}</p>
            <div className="vacancy-actions">
              <button onClick={() => {
                setSelectedVacancy(vacancy);
                setFormData({...vacancy});
              }}>
                Редактировать
              </button>
              <button onClick={() => handleDelete(vacancy._id)}>
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