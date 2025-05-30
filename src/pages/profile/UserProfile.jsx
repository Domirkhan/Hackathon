import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { FaUser, FaUpload } from 'react-icons/fa';
import '../../styles/profile/UserProfile.css';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nickname: user?.nickname || '',
    email: user?.email || '',
    profession: user?.profession || '',
    resume: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.success) {
        setFormData({
          nickname: response.data.nickname,
          email: response.data.email,
          profession: response.data.profession || '',
          resume: response.data.resume
        });
      }
    } catch (err) {
      setError('Ошибка при загрузке профиля');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Обновление основных данных профиля
      const profileResponse = await userAPI.updateProfile({
        nickname: formData.nickname,
        profession: formData.profession
      });

      // Если выбран новый файл резюме
      if (formData.resume instanceof File) {
        const resumeFormData = new FormData();
        resumeFormData.append('resume', formData.resume);
        await userAPI.uploadResume(resumeFormData);
      }

      updateUser(profileResponse.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <h1>Профиль пользователя</h1>
        </div>

       

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="input-disabled"
            />
          </div>

          <div className="form-group">
            <label>Имя пользователя</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>

          {user?.role === 'student' && (
            <>
              <div className="form-group">
                <label>Профессия</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Резюме (PDF)</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    id="resume"
                    className="file-input"
                  />
                  <label htmlFor="resume" className="file-label">
                    <FaUpload />
                    <span>
                      {formData.resume instanceof File 
                        ? formData.resume.name 
                        : formData.resume 
                        ? 'Резюме загружено' 
                        : 'Выберите файл'}
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>

          {formData.resume && !(formData.resume instanceof File) && (
            <a 
              href={formData.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="view-resume-button"
            >
              Просмотреть текущее резюме
            </a>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;