import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/layout/Header.css';


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

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <h2>ProfJob</h2>
                    </Link>
                </div>
                
                <nav className="nav-menu">
                    <ul className="nav-list">
                        <li><NavLink to="/" className="nav-link">Главная</NavLink></li>
                        <li><NavLink to="/jobs" className="nav-link">Вакансии</NavLink></li>
                        <li><NavLink to="/internships" className="nav-link">Стажировки</NavLink></li>
                        <li><NavLink to="/courses" className="nav-link">Курсы</NavLink></li>

                        {!user ? (
                            <li className="nav-item">
                                <NavLink to="/login" className="nav-link">
                                    <img  alt="Профиль" className="user-icon" />
                                </NavLink>
                            </li>
                        ) : (
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link dropdown-toggle"
                                    onClick={toggleDropdown}
                                >
                                    <img  alt="Профиль" className="user-icon" />
                                </button>
                                <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                    <li>
                                        <span className="dropdown-user-info">
                                            {user.nickname}
                                        </span>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="dropdown-item"
                                        >
                                            Выйти
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </nav>

                <div className="mobile-menu">
                    <button className="burger-menu" onClick={toggleMenu}>
                        <div className={`burger-line ${isMenuOpen ? 'active' : ''}`}></div>
                        <div className={`burger-line ${isMenuOpen ? 'active' : ''}`}></div>
                        <div className={`burger-line ${isMenuOpen ? 'active' : ''}`}></div>
                    </button>
                    
                    <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
                        <ul>
                            <li><NavLink to="/" onClick={() => setIsMenuOpen(false)}>Главная</NavLink></li>
                            <li><NavLink to="/jobs" onClick={() => setIsMenuOpen(false)}>Вакансии</NavLink></li>
                            <li><NavLink to="/internships" onClick={() => setIsMenuOpen(false)}>Стажировки</NavLink></li>
                            <li><NavLink to="/courses" onClick={() => setIsMenuOpen(false)}>Курсы</NavLink></li>
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