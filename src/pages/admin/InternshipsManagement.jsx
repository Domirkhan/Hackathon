import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

const InternshipsManagement = () => {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    direction: '',
    duration: { value: '', unit: 'weeks' },
    isPaid: false,
    description: '',
    conditions: [''],
    requirements: ['']
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await axios.get('/internships/employer');
      setInternships(response.data.data);
    } catch (error) {
      console.error('Ошибка при загрузке стажировок:', error);
    }
  };

  // Добавляем функцию resetForm
  const resetForm = () => {
    setSelectedInternship(null);
    setFormData({
      title: '',
      direction: '',
      duration: { value: '', unit: 'weeks' },
      isPaid: false,
      description: '',
      conditions: [''],
      requirements: ['']
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedInternship) {
        await axios.put(`/internships/${selectedInternship._id}`, formData);
      } else {
        await axios.post('/internships', formData);
      }
      fetchInternships();
      resetForm();
    } catch (error) {
      console.error('Ошибка при сохранении стажировки:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту стажировку?')) {
      try {
        await axios.delete(`/internships/${id}`);
        fetchInternships();
      } catch (error) {
        console.error('Ошибка при удалении стажировки:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addField = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeField = (fieldName, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="internships-management">
      <h1>Управление стажировками</h1>
      
      <form onSubmit={handleSubmit} className="internship-form">
        <div className="form-group">
          <label>Название стажировки</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Направление</label>
          <input
            type="text"
            name="direction"
            value={formData.direction}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group duration-group">
          <label>Продолжительность</label>
          <div className="duration-inputs">
            <input
              type="number"
              name="duration.value"
              value={formData.duration.value}
              onChange={handleChange}
              required
            />
            <select
              name="duration.unit"
              value={formData.duration.unit}
              onChange={handleChange}
            >
              <option value="weeks">Недель</option>
              <option value="months">Месяцев</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isPaid"
              checked={formData.isPaid}
              onChange={(e) => setFormData({...formData, isPaid: e.target.checked})}
            />
            Оплачиваемая стажировка
          </label>
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Условия</label>
          {formData.conditions.map((condition, index) => (
            <div key={index} className="array-field">
              <input
                type="text"
                value={condition}
                onChange={(e) => {
                  const newConditions = [...formData.conditions];
                  newConditions[index] = e.target.value;
                  setFormData({...formData, conditions: newConditions});
                }}
              />
              <button 
                type="button" 
                onClick={() => removeField('conditions', index)}
              >
                Удалить
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => addField('conditions')}
          >
            Добавить условие
          </button>
        </div>

        <div className="form-group">
          <label>Требования</label>
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="array-field">
              <input
                type="text"
                value={requirement}
                onChange={(e) => {
                  const newRequirements = [...formData.requirements];
                  newRequirements[index] = e.target.value;
                  setFormData({...formData, requirements: newRequirements});
                }}
              />
              <button 
                type="button" 
                onClick={() => removeField('requirements', index)}
              >
                Удалить
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => addField('requirements')}
          >
            Добавить требование
          </button>
        </div>

        <div className="form-actions">
          <button type="submit">
            {selectedInternship ? 'Обновить' : 'Создать'} стажировку
          </button>
          {selectedInternship && (
            <button type="button" onClick={resetForm}>
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="internships-list">
        {internships.map(internship => (
          <div key={internship._id} className="internship-card">
            <h3>{internship.title}</h3>
            <p>{internship.description}</p>
            <div className="internship-actions">
              <button onClick={() => {
                setSelectedInternship(internship);
                setFormData({...internship});
              }}>
                Редактировать
              </button>
              <button onClick={() => handleDelete(internship._id)}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternshipsManagement;