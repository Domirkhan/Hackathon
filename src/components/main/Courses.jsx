import { Link } from 'react-router-dom';
import '../../styles/main/Course.css';
import '../../styles/courses/CourseDetails.css';
import { FaGraduationCap, FaClock, FaStar } from 'react-icons/fa';

const courses = [
	{
		id: 'web-development',
		title: 'Web-разработка с нуля',
		category: 'Программирование',
		rating: 4.8,
		duration: '3 месяца',
		price: '75.000 ₸',
		students: 1200,
		image: 'https://ugc.futurelearn.com/uploads/images/d5/6d/d56d20b4-1072-48c0-b832-deecf6641d49.jpg',
	},
	{
		id: 'ui-ux',
		title: 'UI/UX Дизайн',
		category: 'Дизайн',
		rating: 4.9,
		duration: '2 месяца',
		price: '65.000 ₸',
		students: 850,
		image: 'https://static.tildacdn.com/tild3161-6436-4631-a132-316634366664/photo.jpg',
	},
	{
		id: 'data-science',
		title: 'Data Science для начинающих',
		category: 'Аналитика',
		rating: 4.7,
		duration: '4 месяца',
		price: '85.000 ₸',
		students: 650,
		image: 'https://zidiolearning.in/public/uploads/main/files/09-02-2025/644a18b637053fa3709c5ba2_what-is-data-science.jpg',
	},
];

function Courses() {
	return (
		<section className="courses-section">
			<div className="courses-container">
				<div className="courses-header">
					<h2>Актуальные курсы</h2>
					<p>Начните обучение по востребованным направлениям</p>
				</div>

				<div className="courses-grid">
					{courses.map((course) => (
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
									<Link
										to={`/courses/${course.id}`}
										className="course-button"
										onClick={(e) => {
											e.preventDefault();
											window.location.href = `/courses/${course.id}`;
										}}
									>
										Подробнее
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Courses;