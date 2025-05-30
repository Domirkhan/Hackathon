import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vacancyAPI } from '../../services/api';
import '../../styles/main/SearchMain.css';

function SearchMain() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacancies = async () => {
      setLoading(true);
      try {
        const response = await vacancyAPI.getAll();
        if (response.success && Array.isArray(response.data.data)) {
          setVacancies(response.data.data);
        } else {
          setVacancies([]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке вакансий:', error);
        setVacancies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      const filtered = vacancies.filter(vacancy =>
        vacancy.title?.toLowerCase().includes(value.toLowerCase()) ||
        vacancy.employer?.nickname?.toLowerCase().includes(value.toLowerCase()) ||
        vacancy.profession?.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationInput = (e) => {
    const value = e.target.value;
    setLocationQuery(value);

    if (value.trim()) {
      const uniqueLocations = [...new Set(
        vacancies
          .map(vacancy => vacancy.location)
          .filter(Boolean)
          .filter(location => 
            location.toLowerCase().includes(value.toLowerCase())
          )
      )];
      setLocationSuggestions(uniqueLocations.slice(0, 5));
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationClick = (location) => {
    setLocationQuery(location);
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
  };

  const handleSuggestionClick = (vacancy) => {
    navigate(`/jobs/${vacancy._id}`);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    if (locationQuery) {
      params.append('location', locationQuery);
    }

    navigate({
      pathname: '/jobs',
      search: params.toString()
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-input-wrapper')) {
        setShowSuggestions(false);
      }
      if (!event.target.closest('.location-input-wrapper')) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-container">
      <div className="search-content">
        <h1 className="search-title">Найди свою профессию уже сейчас</h1>
        <h2 className="search-subtitle">Как выглядит ваша идеальная работа?</h2>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input 
              type="text" 
              className="search-input"
              placeholder="Поиск вакансий"
              value={searchQuery}
              onChange={handleSearchInput}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((vacancy) => (
                  <div
                    key={vacancy._id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(vacancy)}
                  >
                    <div className="suggestion-title">{vacancy.title}</div>
                    <div className="suggestion-company">
                      {vacancy.employer?.nickname || 'Компания'}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="submit" className="search-button" disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.5 16.5M16.5 16.5C17.9497 15.0503 19 13.1004 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C13.1004 19 15.0503 17.9497 16.5 16.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchMain;