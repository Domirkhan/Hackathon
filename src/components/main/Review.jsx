import '../../styles/main/Review.css';
import userAvatar from '../../image/review.png'; // Добавьте свой аватар в assets

function Review() {
  const reviews = [
    {
      id: 1,
      name: "Александра Смирнова",
      avatar: userAvatar,
      text: "Благодаря ProfJob я нашла работу своей мечты! Тест точно определил мои сильные стороны и подобрал идеальную профессию.",
      position: "Frontend Developer"
    },
    {
      id: 2,
      name: "Дмитрий Петров",
      avatar: userAvatar,
      text: "Отличный сервис! После прохождения теста я получил подробный анализ и рекомендации по развитию карьеры.",
      position: "UI/UX Designer"
    },
    {
      id: 3,
      name: "Елена Кузнецова",
      avatar: userAvatar,
      text: "ProfJob помог мне определиться с выбором профессии. Рекомендую всем, кто находится в поиске своего призвания!",
      position: "Project Manager"
    }
  ];

  return (
    <div className="review-container">
      <div className="review-content">
        <h2 className="review-title">Отзывы пользователей ProfJob</h2>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <img src={review.avatar} alt={review.name} className="review-avatar" />
                <div className="review-info">
                  <h3 className="review-name">{review.name}</h3>
                  <p className="review-position">{review.position}</p>
                </div>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Review;