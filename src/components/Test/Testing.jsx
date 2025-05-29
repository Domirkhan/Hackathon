import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Test/Testing.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const questions = [
  {
    id: 1,
    question: "Что тебе интереснее всего делать?",
    options: [
      "Решать логические задачи",
      "Помогать людям",
      "Создавать что-то новое",
      "Работать с техникой или инструментами",
      "Организовывать и планировать процессы",
      "Работать с цифрами и данными"
    ]
  },
  {
    id: 2,
    question: "Какой формат работы тебе больше подходит?",
    options: [
      "Работа в команде",
      "Работа в одиночку",
      "Смешанный формат",
      "Удалённая работа",
      "Работа с людьми вживую (офлайн)"
    ]
  },
  {
    id: 3,
    question: "Какие школьные предметы тебе больше всего нравились?",
    options: [
      "Математика / Информатика",
      "Литература / История",
      "Биология / Химия",
      "Труд / Технология",
      "Обществознание / Экономика",
      "Иностранные языки"
    ]
  },
  {
    id: 4,
    question: "Что тебе ближе по типу мышления?",
    options: [
      "Аналитическое мышление (анализ, логика, схемы)",
      "Творческое мышление (идеи, дизайн, образы)",
      "Практическое мышление (делать руками, ремонтировать)",
      "Коммуникативное (убеждать, объяснять, общаться)",
      "Стратегическое (планировать, управлять)"
    ]
  },
  {
    id: 5,
    question: "Что тебя больше мотивирует в работе?",
    options: [
      "Возможность помогать другим",
      "Стабильный доход",
      "Творческая реализация",
      "Постоянное развитие и обучение",
      "Карьерный рост и признание"
    ]
  },
  {
    id: 6,
    question: "Какие виды деятельности тебе больше всего нравятся?",
    options: [
      "Писать тексты, создавать контент",
      "Программировать, писать код",
      "Чинить, строить, собирать",
      "Преподавать, объяснять",
      "Рисовать, проектировать, моделировать",
      "Проводить исследования, анализировать данные"
    ]
  },
  {
    id: 7,
    question: "Как ты относишься к риску и нестабильности?",
    options: [
      "Люблю вызовы, готов рисковать",
      "Предпочитаю стабильность и чёткие правила",
      "Комбинация: готов к переменам, но с разумной уверенностью",
      "Зависит от ситуации"
    ]
  }
];

const professionMapping = {
  technical: {
    name: "Технические профессии",
    professions: ["Программист", "Инженер", "Системный администратор", "DevOps-инженер"],
    keywords: ["логические задачи", "техника", "математика", "код", "аналитическое"]
  },
  creative: {
    name: "Творческие профессии",
    professions: ["UI/UX дизайнер", "Веб-дизайнер", "Графический дизайнер", "Контент-мейкер"],
    keywords: ["создавать", "творческое", "дизайн", "контент", "проектировать"]
  },
  social: {
    name: "Социальные профессии",
    professions: ["HR-менеджер", "Учитель", "Психолог", "Социальный работник"],
    keywords: ["помогать людям", "общаться", "преподавать", "коммуникативное"]
  },
  business: {
    name: "Бизнес и управление",
    professions: ["Проект-менеджер", "Бизнес-аналитик", "Продукт-менеджер", "Предприниматель"],
    keywords: ["планировать", "управлять", "стратегическое", "карьерный рост"]
  }
};

function Testing() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion]: option
    });
  };

  const analyzeAnswers = () => {
    const answersArray = Object.values(answers);
    const scores = {
      technical: 0,
      creative: 0,
      social: 0,
      business: 0
    };

    answersArray.forEach(answer => {
      Object.entries(professionMapping).forEach(([category, data]) => {
        if (data.keywords.some(keyword => answer.toLowerCase().includes(keyword.toLowerCase()))) {
          scores[category]++;
        }
      });
    });

    const maxScore = Math.max(...Object.values(scores));
    const recommendedCategories = Object.entries(scores)
      .filter(([_, score]) => score === maxScore)
      .map(([category]) => professionMapping[category]);

    return recommendedCategories;
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFinish = () => {
    if (Object.keys(answers).length === questions.length) {
      const results = analyzeAnswers();
      setResults(results);
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="testing-container">
        <div className="testing-card">
          <h2 className="results-title">Ваши результаты</h2>
          <div className="results-content">
            {results.map((category, index) => (
              <div key={index} className="result-category">
                <h3>{category.name}</h3>
                <ul>
                  {category.professions.map((profession, idx) => (
                    <li key={idx}>{profession}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button 
            className="nav-button next"
            onClick={() => navigate('/')}
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="testing-container">
      <div className="testing-card">
        <div className="question-header">
          <h2>Вопрос №{currentQuestion + 1}</h2>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h3 className="question-text">{questions[currentQuestion].question}</h3>

        <div className="options-container">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${answers[currentQuestion] === option ? 'selected' : ''}`}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="navigation-buttons">
          <button 
            className="nav-button previous"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <FaArrowLeft /> Предыдущий вопрос
          </button>
          {isLastQuestion ? (
            <button 
              className="nav-button finish"
              onClick={handleFinish}
              disabled={!answers[currentQuestion]}
            >
              Завершить тест
            </button>
          ) : (
            <button 
              className="nav-button next"
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
            >
              Следующий вопрос <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default Testing;