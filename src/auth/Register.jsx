// filepath: c:\Users\Инжу\Desktop\Hackathon\src\auth\Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/auth/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    role: '',
    profession: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await authAPI.register(formData);
    if (response?.user && response?.accessToken) {
      login(response.user, response.accessToken);
      navigate('/'); // Редирект на главную после успешной регистрации
    } else {
      throw new Error('Некорректный ответ от сервера');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Произошла ошибка при регистрации');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="text"
          name="nickname"
          placeholder="Имя"
          value={formData.nickname}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="role-selector">
          <h3>Выберите роль:</h3>
          <div className="role-options">
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === 'student'}
                onChange={handleChange}
                required
              />
              <span className="role-label">Студент</span>
            </label>
            
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="employer"
                checked={formData.role === 'employer'}
                onChange={handleChange}
              />
              <span className="role-label">Работодатель</span>
            </label>
          </div>
        </div>

        {formData.role === 'student' && (
          <input
            type="text"
            name="profession"
            placeholder="Профессия"
            value={formData.profession}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
}

export default Register;