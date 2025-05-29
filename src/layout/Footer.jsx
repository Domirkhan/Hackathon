import '../styles/layout/Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

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
            <li><a href="#home">Главная</a></li>
            <li><a href="#test">Тест</a></li>
            <li><a href="#about">О нас</a></li>
            <li><a href="#contacts">Контакты</a></li>
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