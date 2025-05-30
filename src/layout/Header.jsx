import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import '../styles/layout/Header.css';
import logo from '../image/logo.jpg'; // Assuming you have a logo image
function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogin = () => {
        navigate('/login');
        setIsMenuOpen(false);
    };

    const handleRegister = () => {
        navigate('/register');
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    };

    const handleProfileClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/profile');
    setIsDropdownOpen(false);
  };
return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <img src={logo} alt="ProfJob Logo" className="logo-image" />
                        <h2>ProfJob</h2>
                    </Link>
                </div>
                
               <nav className="nav-menu">
                    <ul>
                        <li><Link to="/">Главная</Link></li>
                        <li><Link to="/jobs" className="nav-link">Вакансии</Link></li>
                        <li><Link to="/courses">Курсы</Link></li>
                    </ul>

                    {user ? (
                        <div className="user-controls">
                            <div className="user-info" onClick={toggleDropdown}>
                                <FaUser className="user-icon" />
                                <span className="user-name">{user.nickname}</span>
                                {isDropdownOpen && (
                                    <div className="user-dropdown">
                                       <div className="dropdown-item" onClick={handleProfileClick}>
                                            <FaUserCircle />
                                            Профиль
                                        </div>
                                        <button onClick={handleLogout} className="dropdown-item">
                                            <FaSignOutAlt />
                                            Выйти
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button className="login-button" onClick={() => navigate('/login')}>
                                Войти
                            </button>
                            <button className="register-button" onClick={() => navigate('/register')}>
                                Регистрация
                            </button>
                        </div>
                    )}
                </nav>

                <div className="mobile-menu">
                    <button className="burger-menu" onClick={toggleMenu}>
                        <div className={`burger-line ${isMenuOpen ? 'active' : ''}`}></div>
                        <div className={`burger-line ${isMenuOpen ? 'active' : ''}`}></div>
                        <div className={`burger-line ${isMenuOpen ? 'active' : ''}`}></div>
                    </button>
                    
                    <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
                        <ul>
                            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Главная</Link></li>
                            <li><Link to="/jobs" onClick={() => setIsMenuOpen(false)}>Вакансии</Link></li>
                            <li><Link to="/courses" onClick={() => setIsMenuOpen(false)}>Курсы</Link></li>
                        </ul>

                        {user ? (
                            <div className="mobile-user-controls">
                                <span className="mobile-user-info">{user.nickname}</span>
                                <button className="mobile-logout-button" onClick={handleLogout}>
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <div className="mobile-auth-buttons">
                                <button className="mobile-login-button" onClick={handleLogin}>
                                    Войти
                                </button>
                                <button className="mobile-register-button" onClick={handleRegister}>
                                    Регистрация
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;