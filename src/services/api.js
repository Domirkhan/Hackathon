import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Создаем инстанс axios с базовой конфигурацией
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавляем перехватчик запросов для токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем перехватчик ответов для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Методы для работы с авторизацией
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  }
};

// Методы для работы с вакансиями
export const vacancyAPI = {
  getAll: async () => {
    const response = await api.get('/vacancies');
    return response.data;
  },

  getEmployerVacancies: async () => {
    const response = await api.get('/vacancies/employer');
    return response.data;
  },

  create: async (vacancyData) => {
    const response = await api.post('/vacancies', vacancyData);
    return response.data;
  },

  update: async (id, vacancyData) => {
    const response = await api.put(`/vacancies/${id}`, vacancyData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/vacancies/${id}`);
    return response.data;
  }
};

// Методы для работы со стажировками
export const internshipAPI = {
  getAll: async () => {
    const response = await api.get('/internships');
    return response.data;
  },

  getEmployerInternships: async () => {
    const response = await api.get('/internships/employer');
    return response.data;
  },

  create: async (internshipData) => {
    const response = await api.post('/internships', internshipData);
    return response.data;
  },

  update: async (id, internshipData) => {
    const response = await api.put(`/internships/${id}`, internshipData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/internships/${id}`);
    return response.data;
  }
};

// Методы для работы с откликами
export const applicationAPI = {
  getEmployerApplications: async () => {
    const response = await api.get('/vacancies/employer/applications');
    return response.data;
  },

  getStudentApplications: async () => {
    const response = await api.get('/vacancies/student/applications');
    return response.data;
  },

  apply: async (vacancyId, applicationData) => {
    const response = await api.post(`/vacancies/${vacancyId}/apply`, applicationData);
    return response.data;
  },

  updateStatus: async (applicationId, status) => {
    const response = await api.put(`/vacancies/applications/${applicationId}/status`, { status });
    return response.data;
  },

  withdraw: async (applicationId) => {
    const response = await api.delete(`/vacancies/applications/${applicationId}`);
    return response.data;
  }
};

// Методы для работы с профилем пользователя
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  uploadResume: async (formData) => {
    const response = await api.post('/users/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default api;