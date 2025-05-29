import React, { useState, useEffect } from 'react';
import { vacancyAPI } from '../../services/api';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import '../../styles/jobs/JobsList.css';

const employmentTypes = [
	{ value: '', label: 'Все типы' },
	{ value: 'full', label: 'Полная занятость' },
	{ value: 'part', label: 'Частичная занятость' },
	{ value: 'remote', label: 'Удалённая работа' },
	{ value: 'project', label: 'Проектная работа' },
	{ value: 'internship', label: 'Стажировка' },
];

const cities = [
	'Москва',
	'Санкт-Петербург',
	'Казань',
	'Новосибирск',
	'Екатеринбург',
	'Нижний Новгород',
	'Самара',
	'Омск',
	'Ростов-на-Дону',
	'Уфа',
];

const JobsList = () => {
	const [searchParams] = useSearchParams();
	const [vacancies, setVacancies] = useState([]);
	const [filters, setFilters] = useState({
		location: '',
		salary: '',
		employmentType: '',
	});
	const [loading, setLoading] = useState(true);
	const [searchValue, setSearchValue] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [locationSuggestions, setLocationSuggestions] = useState([]);
	const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const query = searchParams.get('query');
		const location = searchParams.get('location');

		if (query || location) {
			setFilters({
				...filters,
				title: query || '',
				location: location || '',
			});
			fetchVacancies({
				title: query,
				location: location,
			});
		} else {
			fetchVacancies();
		}
		// eslint-disable-next-line
	}, [searchParams]);

	const fetchVacancies = async (filterParams = {}) => {
		setLoading(true);
		try {
			const params = {};
			if (filterParams.location) params['location'] = filterParams.location;
			if (filterParams.title) params['title'] = filterParams.title;
			if (filterParams.salary) params['salary'] = filterParams.salary;
			if (filterParams.employmentType)
				params['employmentType'] = filterParams.employmentType;

			const all = await vacancyAPI.getAll();
			let filtered = all;

			if (params.title) {
				filtered = filtered.filter((v) =>
					v.title.toLowerCase().includes(params.title.toLowerCase())
				);
			}

			if (params.location) {
				filtered = filtered.filter((v) =>
					v.location?.toLowerCase().includes(params.location.toLowerCase())
				);
			}
			if (params.salary) {
				filtered = filtered.filter(
					(v) =>
						Number(v.salary?.from) <= Number(params.salary) &&
						Number(v.salary?.to) >= Number(params.salary)
				);
			}
			if (params.employmentType) {
				filtered = filtered.filter(
					(v) => v.employmentType === params.employmentType
				);
			}
			setVacancies(filtered);
		} catch {
			setVacancies([]);
		}
		setLoading(false);
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		const newFilters = { ...filters, [name]: value };
		setFilters(newFilters);
	};

	const handleFilterSubmit = (e) => {
		e.preventDefault();
		fetchVacancies(filters);
	};

	const handleSearch = (value) => {
		if (!value.trim()) {
			setSuggestions([]);
			return;
		}

		const filtered = vacancies.filter(
			(vacancy) =>
				vacancy.title.toLowerCase().includes(value.toLowerCase()) ||
				vacancy.profession?.toLowerCase().includes(value.toLowerCase())
		);

		setSuggestions(filtered.slice(0, 5));
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		setSearchValue(value);
		handleSearch(value);
		setShowSuggestions(true);
	};

	const handleSuggestionClick = (vacancy) => {
		setSearchValue(vacancy.title);
		setSuggestions([]);
		setShowSuggestions(false);
		navigate(`/jobs/${vacancy._id}`);
	};

	const handleLocationChange = (e) => {
		const value = e.target.value;
		setFilters({ ...filters, location: value });

		if (value.trim()) {
			const filtered = cities.filter((city) =>
				city.toLowerCase().includes(value.toLowerCase())
			);
			setLocationSuggestions(filtered);
			setShowLocationSuggestions(true);
		} else {
			setLocationSuggestions([]);
			setShowLocationSuggestions(false);
		}
	};

	const handleLocationSelect = (city) => {
		setFilters({ ...filters, location: city });
		setShowLocationSuggestions(false);
	};

	return (
		<div className="jobs-list-page">
			<h1 className="jobs-list-title">Вакансии</h1>
			<form className="jobs-filter-form" onSubmit={handleFilterSubmit}>
				<div className="search-input-container">
					<input
						type="text"
						name="search"
						placeholder="Поиск вакансий"
						value={searchValue}
						onChange={handleInputChange}
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
										{vacancy.employer?.nickname}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="location-input-container">
					<input
						type="text"
						name="location"
						placeholder="Город"
						value={filters.location}
						onChange={handleLocationChange}
						onFocus={() => setShowLocationSuggestions(true)}
					/>
					{showLocationSuggestions && locationSuggestions.length > 0 && (
						<div className="suggestions-dropdown">
							{locationSuggestions.map((city, index) => (
								<div
									key={index}
									className="suggestion-item"
									onClick={() => handleLocationSelect(city)}
								>
									{city}
								</div>
							))}
						</div>
					)}
				</div>
				<input
					type="number"
					name="salary"
					placeholder="Зарплата от"
					value={filters.salary}
					onChange={handleFilterChange}
				/>
				<select
					name="employmentType"
					value={filters.employmentType}
					onChange={handleFilterChange}
				>
					{employmentTypes.map((type) => (
						<option key={type.value} value={type.value}>
							{type.label}
						</option>
					))}
				</select>
				<button type="submit">Фильтровать</button>
			</form>
			<div className="jobs-cards-list">
				{loading ? (
					<div className="loading">Загрузка...</div>
				) : vacancies.length === 0 ? (
					<div className="empty-state">Вакансии не найдены</div>
				) : (
					vacancies.map((vacancy) => (
						<div className="job-card" key={vacancy._id}>
							<h2 className="job-title">{vacancy.title}</h2>
							<div className="job-company">
								{vacancy.employer?.nickname || 'Компания'}
							</div>
							<div className="job-location">{vacancy.location}</div>
							<div className="job-salary">
								{vacancy.salary?.from} - {vacancy.salary?.to}{' '}
								{vacancy.salary?.currency}
							</div>
							<div className="job-description">
								{vacancy.description?.slice(0, 100)}...
							</div>
							<Link
								to={`/jobs/${vacancy._id}`}
								className="job-details-btn"
							>
								Подробнее
							</Link>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default JobsList;
