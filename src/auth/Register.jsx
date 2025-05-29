import { useState } from 'react';
import '../styles/auth/Register.css';

function Register() {
  const [selectedRole, setSelectedRole] = useState('');

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form className="register-form">
        <input type="text" placeholder="Имя" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Пароль" required />
        <input type="password" placeholder="Подтвердите пароль" required />
        
        <div className="role-selector">
          <h3>Выберите роль:</h3>
          <div className="role-options">
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="student"
                checked={selectedRole === 'student'}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
              />
              <span className="role-label">Студент</span>
            </label>
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="employer"
                checked={selectedRole === 'employer'}
                onChange={(e) => setSelectedRole(e.target.value)}
              />
              <span className="role-label">Работодатель</span>
            </label>
          </div>
        </div>

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default Register;