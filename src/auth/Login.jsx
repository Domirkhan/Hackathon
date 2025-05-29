import '../styles/auth/Login.css';

function Login() {
  return (
    <div className="login-container">
      <h2>Вход в систему</h2>
      <form className="login-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Пароль" required />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;