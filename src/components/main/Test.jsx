import '../../styles/main/Test.css';
import { BiMoney } from 'react-icons/bi';
import { BsPeople } from 'react-icons/bs';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BiTime } from 'react-icons/bi';
import { MdOutlineFreeBreakfast, MdWorkOutline } from 'react-icons/md';

function Test() {
  return (
    <div className="test-container">
      <div className="test-content">
        <h1 className="test-title">Сомневаетесь по поводу будущей профессии?</h1>
        <h2 className="test-subtitle">Пройдите тест и узнайте, что подойдёт именно вам</h2>
        
        <div className="stats-section">
          <div className="stats-row">
            <div className="stat-item">
              <BiMoney className="stat-icon" />
              <div className="stat-value">350.000 ₸</div>
              <div className="stat-label">средняя зарплата</div>
            </div>
            <div className="stat-item">
              <BsPeople className="stat-icon" />
              <div className="stat-value">98%</div>
              <div className="stat-label">находят работу</div>
            </div>
            <div className="stat-item">
              <AiOutlineCheckCircle className="stat-icon" />
              <div className="stat-value">100%</div>
              <div className="stat-label">точность выбора</div>
            </div>
          </div>
          
          <div className="features-row">
            <div className="feature-item">
              <BiTime className="feature-icon" />
              <div className="feature-info">
                <span className="feature-value">5 минут</span>
                <span className="feature-label">на прохождение теста</span>
              </div>
            </div>
            <div className="feature-item">
              <MdOutlineFreeBreakfast className="feature-icon" />
              <div className="feature-info">
                <span className="feature-value">Бесплатно</span>
                <span className="feature-label">полный доступ</span>
              </div>
            </div>
            <div className="feature-item">
              <MdWorkOutline className="feature-icon" />
              <div className="feature-info">
                <span className="feature-value">37 профессий</span>
                <span className="feature-label">подробный анализ</span>
              </div>
            </div>
          </div>
        </div>

        <button className="test-button">Пройти тест</button>
      </div>
    </div>
  );
}

export default Test;