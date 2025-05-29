import React from 'react';
import '../../styles/main/Course.css';
import { FaGraduationCap, FaClock, FaStar } from 'react-icons/fa';

const courses = [
  {
    id: 1,
    title: 'Web-разработка с нуля',
    category: 'Программирование',
    rating: 4.8,
    duration: '3 месяца',
    price: '75.000 ₸',
    students: 1200,
    image: 'https://example.com/web-dev.jpg' // Добавьте свой путь к изображению
  },
  {
    id: 2,
    title: 'UI/UX Дизайн',
    category: 'Дизайн',
    rating: 4.9,
    duration: '2 месяца',
    price: '65.000 ₸',
    students: 850,
    image: 'https://example.com/uiux.jpg'
  },
  {
    id: 3,
    title: 'Data Science для начинающих',
    category: 'Аналитика',
    rating: 4.7,
    duration: '4 месяца',
    price: '85.000 ₸',
    students: 650,
    image: 'https://example.com/data-science.jpg'
  }
];

function Courses() {
  return (
      <div className="courses-container">
        <div className="courses-header">
          <h2>Актуальные курсы</h2>
          <p>Начните обучение по востребованным направлениям</p>
        </div>

        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <span className="course-category">{course.category}</span>
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <div className="course-info">
                  <div className="info-item">
                    <FaClock />
                    <span>{course.duration}</span>
                  </div>
                  <div className="info-item">
                    <FaGraduationCap />
                    <span>{course.students} студентов</span>
                  </div>
                  <div className="info-item">
                    <FaStar />
                    <span>{course.rating}</span>
                  </div>
                </div>
                <div className="course-footer">
                  <span className="course-price">{course.price}</span>
                  <button className="course-button">Подробнее</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}

export default Courses;