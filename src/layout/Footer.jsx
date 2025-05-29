import '../styles/layout/Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">ProfJob</h3>
          <p className="footer-description">
            Найдите работу своей мечты с помощью профессионального тестирования
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Навигация</h4>
          <ul className="footer-links">
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/testing">Тест</Link></li>
            <li><Link to="/about">О нас</Link></li>
            <li><Link to="/contacts">Контакты</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Контакты</h4>
          <ul className="footer-contact">
            <li>Email: info@profjob.kz</li>
            <li>Тел: +7 (777) 777-77-77</li>
            <li>Адрес: г. Астана, ул. Примерная 123</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Социальные сети</h4>
          <div className="social-links">
            <a href="#" className="social-link"><FaFacebook /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 ProfJob. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;