import React, { useState } from 'react';
import { applicationAPI } from '../../services/api';
import '../../styles/jobs/ApplicationForm.css';

const ApplicationForm = ({ vacancyId, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    coverLetter: '',
    resume: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await applicationAPI.apply(vacancyId, formDataToSend);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при отправке');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-form-container">
      <div className="application-form-header">
        <h2>Отклик на вакансию</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="application-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Имя</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Сопроводительное письмо</label>
          <textarea
            value={formData.coverLetter}
            onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
            required
            rows={5}
          />
        </div>

        <div className="form-group">
          <label>Резюме</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
              accept=".pdf,.doc,.docx"
              required
            />
            <span className="file-input-text">
              {formData.resume ? formData.resume.name : 'Выберите файл'}
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="cancel-button">
            Отмена
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
