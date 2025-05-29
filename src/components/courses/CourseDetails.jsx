import React from 'react';
import { useParams } from 'react-router-dom';
import { FaGraduationCap, FaClock, FaStar, FaUsers, FaCheckCircle, FaBook } from 'react-icons/fa';
import '../../styles/courses/CourseDetails.css';

const courseDetails = {
  'web-development': {
    title: 'Web-разработка с нуля',
    category: 'Программирование',
    description: 'Комплексный курс по веб-разработке, который научит вас создавать современные веб-приложения.',
    fullDescription: `Станьте востребованным веб-разработчиком с нуля. В процессе обучения вы освоите HTML, CSS, JavaScript, React и Node.js. Научитесь создавать адаптивные веб-сайты и работать с базами данных.`,
    duration: '3 месяца',
    lessons: 36,
    price: '75.000 ₸',
    rating: 4.8,
    students: 1200,
    image: 'https://www.thomas.co/sites/default/files/2024-05/Personal-Development-Goals.jpg',
    skills: [
      'HTML5 и CSS3',
      'JavaScript ES6+',
      'React.js',
      'Node.js',
      'MongoDB',
      'Git'
    ],
    program: [
      {
        title: 'Основы веб-разработки',
        topics: ['Введение в HTML', 'CSS стилизация', 'Основы JavaScript']
      },
      {
        title: 'Продвинутый JavaScript',
        topics: ['DOM манипуляции', 'Асинхронное программирование', 'ES6 возможности']
      },
      {
        title: 'React разработка',
        topics: ['Компоненты React', 'Хуки', 'Управление состоянием']
      },
      {
        title: 'Бэкенд разработка',
        topics: ['Node.js основы', 'Express.js', 'MongoDB']
      }
    ]
  },
  'ui-ux': {
    title: 'UI/UX Дизайн',
    category: 'Дизайн',
    description: 'Научитесь создавать привлекательные и удобные интерфейсы.',
    fullDescription: `Освойте искусство создания пользовательских интерфейсов и опыта взаимодействия. Вы научитесь работать с современными инструментами дизайна, проводить исследования пользователей и создавать прототипы.`,
    duration: '2 месяца',
    lessons: 24,
    price: '65.000 ₸',
    rating: 4.9,
    students: 850,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3',
    skills: [
      'Figma',
      'Adobe XD',
      'Прототипирование',
      'Дизайн-системы',
      'Пользовательские исследования',
      'Веб-дизайн'
    ],
    program: [
      {
        title: 'Основы UI/UX',
        topics: ['Принципы дизайна', 'Типографика', 'Цветовые теории']
      },
      {
        title: 'Инструменты дизайна',
        topics: ['Работа в Figma', 'Adobe XD основы', 'Создание прототипов']
      },
      {
        title: 'UX исследования',
        topics: ['Пользовательские персоны', 'Пользовательские сценарии', 'A/B тестирование']
      },
      {
        title: 'Практический дизайн',
        topics: ['Дизайн-системы', 'Адаптивный дизайн', 'Анимации интерфейсов']
      }
    ]
  },
  'data-science': {
    title: 'Data Science для начинающих',
    category: 'Аналитика',
    description: 'Изучите основы анализа данных и машинного обучения.',
    fullDescription: `Погрузитесь в мир данных и аналитики. Вы изучите Python, основы статистики, методы машинного обучения и визуализацию данных. Научитесь применять полученные знания для решения реальных бизнес-задач.`,
    duration: '4 месяца',
    lessons: 48,
    price: '85.000 ₸',
    rating: 4.7,
    students: 650,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3',
    skills: [
      'Python',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'Matplotlib',
      'SQL'
    ],
    program: [
      {
        title: 'Введение в Data Science',
        topics: ['Основы Python', 'Работа с данными', 'Статистика']
      },
      {
        title: 'Анализ данных',
        topics: ['Pandas и NumPy', 'Визуализация данных', 'SQL запросы']
      },
      {
        title: 'Машинное обучение',
        topics: ['Классификация', 'Регрессия', 'Кластеризация']
      },
      {
        title: 'Практические проекты',
        topics: ['Анализ реальных данных', 'Построение моделей', 'Оценка качества']
      }
    ]
  }
};

function CourseDetails() {
  const { courseId } = useParams();
  const course = courseDetails[courseId];

  if (!course) {
    return <div className="error-message">Курс не найден</div>;
  }

  return (
    <div className="course-details">
      <div className="course-header">
        <span className="course-category">{course.category}</span>
        <h1 className="course-title">{course.title}</h1>
        <div className="course-image">
          <img src={course.image} alt={course.title} />
        </div>
        <p className="course-description">{course.fullDescription}</p>
        
        <div className="course-meta">
          <div className="meta-item">
            <div className="meta-value">{course.duration}</div>
            <div className="meta-label">Длительность</div>
          </div>
          <div className="meta-item">
            <div className="meta-value">{course.students}</div>
            <div className="meta-label">Студентов</div>
          </div>
          <div className="meta-item">
            <div className="meta-value">{course.rating}</div>
            <div className="meta-label">Рейтинг</div>
          </div>
          <div className="meta-item">
            <div className="meta-value">{course.lessons}</div>
            <div className="meta-label">Уроков</div>
          </div>
        </div>
      </div>

      <div className="course-content-wrapper">
        <div className="main-content">
          <section className="content-section">
            <h2>Чему вы научитесь</h2>
            <div className="skills-grid">
              {course.skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <FaCheckCircle />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="content-section">
            <h2>Программа курса</h2>
            <div className="program-modules">
              {course.program.map((module, index) => (
                <div key={index} className="module">
                  <h3>{module.title}</h3>
                  <ul>
                    {module.topics.map((topic, topicIndex) => (
                      <li key={topicIndex}>
                        <FaCheckCircle />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="sidebar">
          <div className="price-card">
            <div className="course-price">{course.price}</div>
            <button className="enroll-button">Записаться на курс</button>
            <div className="features-list">
              <div className="feature-item">
                <FaCheckCircle />
                <span>Доступ к материалам навсегда</span>
              </div>
              <div className="feature-item">
                <FaGraduationCap />
                <span>Сертификат по окончании</span>
              </div>
              <div className="feature-item">
                <FaClock />
                <span>Обучение в своем темпе</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
