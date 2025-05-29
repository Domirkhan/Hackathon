export const mockVacancies = [
  {
    _id: '1',
    title: 'Frontend Developer',
    employer: { nickname: 'IT Solutions' },
    location: 'Москва',
    salary: { from: 120000, to: 180000, currency: 'RUB' },
    description: 'Требуется Frontend разработчик со знанием React. Опыт работы от 2 лет. Разработка и поддержка веб-приложений.',
    employmentType: 'full'
  },
  {
    _id: '2',
    title: 'UX/UI Designer',
    employer: { nickname: 'Creative Studio' },
    location: 'Санкт-Петербург',
    salary: { from: 90000, to: 150000, currency: 'RUB' },
    description: 'Ищем креативного дизайнера для работы над интересными проектами. Создание пользовательских интерфейсов.',
    employmentType: 'remote'
  },
  {
    _id: '3',
    title: 'Python Developer',
    employer: { nickname: 'Tech Corp' },
    location: 'Казань',
    salary: { from: 150000, to: 200000, currency: 'RUB' },
    description: 'Разработка backend сервисов на Python/Django. Работа с базами данных, API интеграции.',
    employmentType: 'full'
  }
];
