import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/layout/Header.css';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogin = () => {
        navigate('/login');
        setIsMenuOpen(false);
    };

    const handleRegister = () => {
        navigate('/register');
        setIsMenuOpen(false);
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
                    <ul>
                        <li><Link to="/">Главная</Link></li>
                        <li><Link to="/test">Стажировки</Link></li>
                        <li><Link to="/vacancies">Вакансий</Link></li>
                    </ul>
                    <button className='login-button' onClick={handleLogin}>Войти</button>
                    <button className='register-button' onClick={handleRegister}>Регистрация</button>
                </nav>

                <div className="mobile-menu">
                    <div className="burger-menu" onClick={toggleMenu}>
                        <div className={`burger-line ${isMenuOpen ? 'active' : ''}`}></div>
                        <div className={`burger-line ${isMenuOpen ? 'active' : ''}`}></div>
                        <div className={`burger-line ${isMenuOpen ? 'active' : ''}`}></div>
                    </div>
                    
                    <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
                        <ul>
                            <li><Link to="/">Главная</Link></li>
                            <li><Link to="/test">Стажировки</Link></li>
                            <li><Link to="/vacancies">Вакансий</Link></li>
                        </ul>
                        <button className='mobile-login-button' onClick={handleLogin}>Войти</button>
                        <button className='mobile-register-button' onClick={handleRegister}>Регистрация</button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;