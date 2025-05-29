import '../../styles/main/SearchMain.css';

function SearchMain() {
  return (
    <div className="search-container">
      <div className="search-content">
        <h1 className="search-title">Найди свою профессию уже сейчас</h1>
        <h2 className="search-subtitle">Как выглядит ваша идеальная работа?</h2>
        
        <div className="search-form">
          <div className="search-input-wrapper">
            <input 
              type="text" 
              className="search-input"
              placeholder="Поиск вакансий"
            />
            <button className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.5 16.5M16.5 16.5C17.9497 15.0503 19 13.1004 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C13.1004 19 15.0503 17.9497 16.5 16.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="location-input-wrapper">
            <input 
              type="text" 
              className="location-input"
              placeholder="Местоположение"
            />
            <button className="location-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMain;